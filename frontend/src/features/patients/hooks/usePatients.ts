import { useState, useEffect, useCallback } from 'react';
import { patientsApi } from '../api';
import type { Patient } from '../types';

interface UsePatientsReturn {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export const usePatients = (): UsePatientsReturn => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch {
      setError('Failed to load patients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    isLoading,
    error,
    refresh: fetchPatients,
  };
};
