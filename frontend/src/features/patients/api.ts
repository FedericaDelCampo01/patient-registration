import axios from 'axios';
import type { Patient, CreatePatientPayload } from './types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

export const patientsApi = {
  /**
   * Fetch all registered patients
   */
  getAll: async (): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>('/patients');
    return response.data;
  },

  /**
   * Register a new patient
   * Uses FormData because we need to upload a file (document photo)
   */
  create: async (payload: CreatePatientPayload): Promise<Patient> => {
    const formData = new FormData();
    formData.append('full_name', payload.full_name);
    formData.append('email', payload.email);
    formData.append('country_code', payload.country_code);
    formData.append('phone_number', payload.phone_number);
    formData.append('document_photo', payload.document_photo);

    const response = await apiClient.post<Patient>('/patients', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
