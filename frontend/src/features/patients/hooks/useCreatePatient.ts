import { useState } from 'react';
import { patientsApi } from '../api';
import type { CreatePatientPayload, Patient } from '../types';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseCreatePatientReturn {
  status: SubmitStatus;
  errorMessage: string | null;
  createdPatient: Patient | null;
  submit: (payload: CreatePatientPayload) => Promise<void>;
  reset: () => void;
}

export const useCreatePatient = (onSuccess?: () => void): UseCreatePatientReturn => {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdPatient, setCreatedPatient] = useState<Patient | null>(null);

  const submit = async (payload: CreatePatientPayload): Promise<void> => {
    setStatus('loading');
    setErrorMessage(null);
    try {
      const patient = await patientsApi.create(payload);
      setCreatedPatient(patient);
      setStatus('success');
      onSuccess?.();
    } catch (error: unknown) {
      setStatus('error');
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } };
        if (axiosError.response?.status === 422) {
          const errors = axiosError.response.data?.errors;
          const firstFieldError = errors ? Object.values(errors)[0]?.[0] : undefined;
          setErrorMessage(firstFieldError ?? axiosError.response.data?.message ?? 'Validation failed.');
        } else if (axiosError.response?.status === 500) {
          setErrorMessage('Server error. Please try again later.');
        } else {
          setErrorMessage('Something went wrong. Please try again.');
        }
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };

  const reset = () => {
    setStatus('idle');
    setErrorMessage(null);
    setCreatedPatient(null);
  };

  return { status, errorMessage, createdPatient, submit, reset };
};
