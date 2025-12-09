import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminProfile, updateAdminProfile } from "@/services/admin/profileService";
import { UpdateProfilePayload } from "@/types/admin/profile";
import { toast } from "sonner";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: getAdminProfile,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfilePayload) => updateAdminProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  return { 
    profile, 
    isLoading, 
    error, 
    refetch,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
