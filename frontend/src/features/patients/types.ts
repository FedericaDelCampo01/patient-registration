export interface Patient {
  id: number;
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  full_phone: string;
  document_photo_url: string;
  created_at: string;
}

export interface CreatePatientPayload {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  document_photo: File;
}

export interface PatientFormValues {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  document_photo: File | null;
}

export interface PatientFormErrors {
  full_name?: string;
  email?: string;
  country_code?: string;
  phone_number?: string;
  document_photo?: string;
}
