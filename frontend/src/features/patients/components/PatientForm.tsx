import React, { useState } from 'react';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { FileDropzone } from '../../../components/FileDropzone';
import { CountryCodeSelect } from '../../../components/CountryCodeSelect';
import { COUNTRIES } from '../../../constants/countries';
import { STRINGS } from '../../../constants/strings';
import type { PatientFormValues, PatientFormErrors, CreatePatientPayload } from '../types';
import styles from './PatientForm.module.css';

interface PatientFormProps {
  onSubmit: (payload: CreatePatientPayload) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const INITIAL_VALUES: PatientFormValues = {
  full_name: '',
  email: '',
  country_code: '',
  phone_number: '',
  document_photo: null,
};

const validate = (values: PatientFormValues): PatientFormErrors => {
  const errors: PatientFormErrors = {};

  if (!values.full_name.trim()) {
    errors.full_name = STRINGS.ERROR_FULL_NAME_REQUIRED;
  } else if (!/^[\p{L}\s\-]+$/u.test(values.full_name)) {
    errors.full_name = STRINGS.ERROR_FULL_NAME_LETTERS;
  }

  if (!values.email.trim()) {
    errors.email = STRINGS.ERROR_EMAIL_REQUIRED;
  } else if (!values.email.endsWith('@gmail.com')) {
    errors.email = STRINGS.ERROR_EMAIL_GMAIL;
  }

  if (!values.country_code) {
    errors.country_code = STRINGS.ERROR_COUNTRY_CODE_REQUIRED;
  }

  if (!values.phone_number.trim()) {
    errors.phone_number = STRINGS.ERROR_PHONE_REQUIRED;
  } else if (!/^\d{6,15}$/.test(values.phone_number)) {
    errors.phone_number = STRINGS.ERROR_PHONE_FORMAT;
  }

  if (!values.document_photo) {
    errors.document_photo = STRINGS.ERROR_DOCUMENT_REQUIRED;
  }

  return errors;
};

export const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [values, setValues] = useState<PatientFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof PatientFormValues, value: string | File | null) => {
    const updated = { ...values, [field]: value };
    setValues(updated);
    if (submitted) {
      setErrors(validate(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const selectedCountry = COUNTRIES.find((c) => c.isoCode === values.country_code);
    onSubmit({
      full_name: values.full_name,
      email: values.email,
      country_code: selectedCountry?.dialCode ?? values.country_code,
      phone_number: values.phone_number,
      document_photo: values.document_photo as File,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <h2 className={styles.title}>{STRINGS.FORM_TITLE}</h2>
      </div>

      <div className={styles.fields}>
        <Input
          label={STRINGS.FORM_FULL_NAME_LABEL}
          placeholder={STRINGS.FORM_FULL_NAME_PLACEHOLDER}
          value={values.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          error={errors.full_name}
          autoComplete="name"
        />

        <Input
          label={STRINGS.FORM_EMAIL_LABEL}
          type="email"
          placeholder={STRINGS.FORM_EMAIL_PLACEHOLDER}
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <div className={styles.phoneRow}>
          <CountryCodeSelect
            label={STRINGS.FORM_COUNTRY_CODE_LABEL}
            value={values.country_code}
            onChange={(isoCode) => handleChange('country_code', isoCode)}
            error={errors.country_code}
          />
          <Input
            label={STRINGS.FORM_PHONE_LABEL}
            placeholder={STRINGS.FORM_PHONE_PLACEHOLDER}
            value={values.phone_number}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            error={errors.phone_number}
            className={styles.phoneNumber}
          />
        </div>

        <FileDropzone
          label={STRINGS.FORM_DOCUMENT_LABEL}
          value={values.document_photo}
          onChange={(file) => handleChange('document_photo', file)}
          error={errors.document_photo}
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          {STRINGS.FORM_CANCEL}
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {STRINGS.FORM_SUBMIT}
        </Button>
      </div>
    </form>
  );
};
