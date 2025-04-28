import { useQuery, useMutation } from '@tanstack/react-query';
import { getProfile, updateProfile, createProfile } from '@/api/profile'; 
import { getProfileChoices } from '@/api/profile/profileApi';  



export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false, 
  });
};

export const useProfileChoices = () => {
  return useQuery({
    queryKey: ['profileChoices'],
    queryFn: getProfileChoices,
    retry: false,  
  });
};


export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};

export const useCreateProfile = () => {
  return useMutation({
    mutationFn: createProfile,
  });
};

