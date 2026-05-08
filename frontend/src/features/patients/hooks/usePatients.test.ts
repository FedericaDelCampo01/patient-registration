import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { usePatients } from './usePatients';
import { patientsApi } from '../api';
import type { Patient } from '../types';

vi.mock('../api');

const mockPatients: Patient[] = [
  {
    id: 1,
    full_name: 'Jane Doe',
    email: 'jane@example.com',
    country_code: '+1',
    phone_number: '5551234567',
    full_phone: '+15551234567',
    document_photo_url: 'http://localhost/storage/documents/photo.jpg',
    created_at: '2024-01-01T00:00:00.000000Z',
  },
];

describe('usePatients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches patients on mount and sets them', async () => {
    vi.mocked(patientsApi.getAll).mockResolvedValue(mockPatients);

    const { result } = renderHook(() => usePatients());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.patients).toEqual(mockPatients);
    expect(result.current.error).toBeNull();
  });

  it('starts with isLoading true', () => {
    vi.mocked(patientsApi.getAll).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => usePatients());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.patients).toEqual([]);
  });

  it('sets error message when fetch fails', async () => {
    vi.mocked(patientsApi.getAll).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePatients());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Failed to load patients. Please try again.');
    expect(result.current.patients).toEqual([]);
  });

  it('re-fetches patients when refresh is called', async () => {
    vi.mocked(patientsApi.getAll).mockResolvedValue(mockPatients);

    const { result } = renderHook(() => usePatients());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(patientsApi.getAll).mockClear();
    vi.mocked(patientsApi.getAll).mockResolvedValue([]);

    result.current.refresh();

    await waitFor(() => expect(vi.mocked(patientsApi.getAll)).toHaveBeenCalledTimes(1));
  });
});
