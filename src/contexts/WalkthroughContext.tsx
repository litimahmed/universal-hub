import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface WalkthroughContextType {
  isRunning: boolean;
  stepIndex: number;
  startTour: () => void;
  stopTour: () => void;
  setStepIndex: (index: number) => void;
}

const WalkthroughContext = createContext<WalkthroughContextType | undefined>(undefined);

export function WalkthroughProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const startTour = useCallback(() => {
    setStepIndex(0);
    setIsRunning(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsRunning(false);
    setStepIndex(0);
  }, []);

  return (
    <WalkthroughContext.Provider
      value={{
        isRunning,
        stepIndex,
        startTour,
        stopTour,
        setStepIndex,
      }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough() {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error("useWalkthrough must be used within a WalkthroughProvider");
  }
  return context;
}
