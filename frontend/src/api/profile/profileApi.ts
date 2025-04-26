import axios from 'axios';
import { ProfileFormData } from './profileTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getProfile = async (): Promise<ProfileFormData> => {
  const response = await axios.get(`${API_BASE_URL}/profile/`, {
    withCredentials: true, 
  });
  return response.data;
};

export const updateProfile = async (data: ProfileFormData): Promise<ProfileFormData> => {
  const response = await axios.patch(`${API_BASE_URL}/profile/`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const createProfile = async (data: ProfileFormData): Promise<ProfileFormData> => {
  const response = await axios.post(`${API_BASE_URL}/profile/create/`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const getProfileChoices = async () => {
  const response = await axios.get(`${API_BASE_URL}/profile/choices/`, {
    withCredentials: true,
  });
  return response.data;
};

