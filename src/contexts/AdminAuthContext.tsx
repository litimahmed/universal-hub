import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { refreshAccessToken } from "@/services/admin/authService";

interface AdminAuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    setAuthenticated: (value: boolean) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Helper to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        // Add 30 second buffer before actual expiration
        return Date.now() >= (exp - 30000);
    } catch {
        return true; // If we can't decode, consider it expired
    }
};

// Helper to check if token exists and is valid
const hasValidToken = (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
    return !isTokenExpired(token);
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => hasValidToken());
    const [isLoading, setIsLoading] = useState(true);
    const isRefreshing = useRef(false);
    const hasInitialized = useRef(false);

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
    }, []);

    const validateAndRefreshToken = useCallback(async () => {
        // Prevent concurrent refresh attempts
        if (isRefreshing.current) {
            return;
        }

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        // Check if token is expired
        if (isTokenExpired(accessToken)) {
            isRefreshing.current = true;

            try {
                // Try to refresh the token
                const newToken = await refreshAccessToken();

                if (newToken) {
                    setIsAuthenticated(true);
                } else {
                    // Refresh failed, logout
                    logout();
                }
            } finally {
                isRefreshing.current = false;
            }
        } else {
            setIsAuthenticated(true);
        }

        setIsLoading(false);
    }, [logout]);

    useEffect(() => {
        // Only run initialization once
        if (hasInitialized.current) {
            return;
        }
        hasInitialized.current = true;

        validateAndRefreshToken();

        // Set up periodic token refresh every 2 minutes (more aggressive to prevent expiry)
        const refreshInterval = setInterval(() => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken && isTokenExpired(accessToken)) {
                console.log("Token expired, refreshing...");
                validateAndRefreshToken();
            }
        }, 2 * 60 * 1000); // 2 minutes

        // Listen for storage changes (logout from another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "accessToken") {
                if (!e.newValue) {
                    setIsAuthenticated(false);
                } else if (!isTokenExpired(e.newValue)) {
                    setIsAuthenticated(true);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // Listen for forced logout (token refresh failed from API calls)
        const handleForceLogout = () => {
            logout();
        };
        window.addEventListener("auth:logout", handleForceLogout);

        return () => {
            clearInterval(refreshInterval);
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("auth:logout", handleForceLogout);
        };
    }, [validateAndRefreshToken, logout]);

    const setAuthenticated = (value: boolean) => {
        setIsAuthenticated(value);
    };

    return (
        <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, logout, setAuthenticated }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error("useAdminAuth must be used within AdminAuthProvider");
    }
    return context;
};

// Wrapper component that handles forced logout redirect
export const AdminAuthRedirectHandler = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const hasRedirected = useRef(false);

    useEffect(() => {
        // Only redirect if we're on an admin route (not login), not loading, and not authenticated
        const isAdminRoute = location.pathname.startsWith("/admin") && !location.pathname.includes("/admin/login");

        if (!isLoading && !isAuthenticated && isAdminRoute && !hasRedirected.current) {
            hasRedirected.current = true;
            navigate("/admin/login", { replace: true });
        }

        // Reset the flag when becoming authenticated again
        if (isAuthenticated) {
            hasRedirected.current = false;
        }
    }, [isAuthenticated, isLoading, navigate, location.pathname]);

    return <>{children}</>;
};