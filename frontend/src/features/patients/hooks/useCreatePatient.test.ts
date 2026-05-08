import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useCreatePatient } from './useCreatePatient';
import { patientsApi } from '../api';
import type { Patient, CreatePatientPayload } from '../types';

vi.mock('../api');

const mockPatient: Patient = {
  id: 1,
  full_name: 'Jane Doe',
  email: 'jane@example.com',
  country_code: '+1',
  phone_number: '5551234567',
  full_phone: '+15551234567',
  document_photo_url: 'http://localhost/storage/documents/photo.jpg',
  created_at: '2024-01-01T00:00:00.000000Z',
};

const validPayload: CreatePatientPayload = {
  full_name: 'Jane Doe',
  email: 'jane@example.com',
  country_code: '+1',
  phone_number: '5551234567',
  document_photo: new File(['content'], 'document.jpg', { type: 'image/jpeg' }),
};

describe('useCreatePatient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with idle status', () => {
    const { result } = renderHook(() => useCreatePatient());

    expect(result.current.status).toBe('idle');
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.createdPatient).toBeNull();
  });

  it('sets status to loading immediately on submit', () => {
    vi.mocked(patientsApi.create).mockImplementation(
      () => new Promise(() => {}),
    );

    const { result } = renderHook(() => useCreatePatient());

    act(() => {
      result.current.submit(validPayload);
    });

    expect(result.current.status).toBe('loading');
  });

  it('sets success state with patient data on resolved request', async () => {
    vi.mocked(patientsApi.create).mockResolvedValue(mockPatient);

    const { result } = renderHook(() => useCreatePatient());

    await act(async () => {
      await result.current.submit(validPayload);
    });

    expect(result.current.status).toBe('success');
    expect(result.current.createdPatient).toEqual(mockPatient);
    expect(result.current.errorMessage).toBeNull();
  });

  it('calls onSuccess callback after successful submission', async () => {
    const onSuccess = vi.fn();
    vi.mocked(patientsApi.create).mockResolvedValue(mockPatient);

    const { result } = renderHook(() => useCreatePatient(onSuccess));

    await act(async () => {
      await result.current.submit(validPayload);
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('extracts first field error message from 422 response', async () => {
    vi.mocked(patientsApi.create).mockRejectedValue({
      response: {
        status: 422,
        data: {
          message: 'The given data was invalid.',
          errors: { email: ['This email address is already registered.'] },
        },
      },
    });

    const { result } = renderHook(() => useCreatePatient());

    await act(async () => {
      await result.current.submit(validPayload);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe('This email address is already registered.');
  });

  it('sets server error message for 500 response', async () => {
    vi.mocked(patientsApi.create).mockRejectedValue({
      response: { status: 500 },
    });

    const { result } = renderHook(() => useCreatePatient());

    await act(async () => {
      await result.current.submit(validPayload);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe('Server error. Please try again later.');
  });

  it('resets all state when reset is called', async () => {
    vi.mocked(patientsApi.create).mockResolvedValue(mockPatient);

    const { result } = renderHook(() => useCreatePatient());

    await act(async () => {
      await result.current.submit(validPayload);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.createdPatient).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });
});
