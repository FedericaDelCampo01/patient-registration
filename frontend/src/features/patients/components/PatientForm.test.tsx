import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PatientForm } from './PatientForm';
import { STRINGS } from '../../../constants/strings';
import { COUNTRIES } from '../../../constants/countries';

vi.mock('../../../components/CountryCodeSelect', () => ({
  CountryCodeSelect: ({
    label,
    onChange,
    error,
  }: {
    label: string;
    onChange: (v: string) => void;
    error?: string;
  }) => (
    <div>
      <label htmlFor="country-select-mock">{label}</label>
      <select
        id="country-select-mock"
        data-testid="country-select"
        onChange={(e) => onChange(e.target.value)}
        defaultValue=""
      >
        <option value="">Select country</option>
        {COUNTRIES.slice(0, 5).map((c) => (
          <option key={c.isoCode} value={c.isoCode}>
            {c.name}
          </option>
        ))}
      </select>
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

vi.mock('../../../components/FileDropzone', () => ({
  FileDropzone: ({
    label,
    onChange,
    error,
  }: {
    label: string;
    value: File | null;
    onChange: (f: File | null) => void;
    error?: string;
  }) => (
    <div>
      <label htmlFor="file-dropzone-mock">{label}</label>
      <input
        id="file-dropzone-mock"
        data-testid="file-input"
        type="file"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {error && <span role="alert">{error}</span>}
    </div>
  ),
}));

describe('PatientForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderForm(isLoading = false) {
    render(
      <PatientForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={isLoading}
      />,
    );
  }

  it('does not show validation errors on initial render', () => {
    renderForm();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows all required field errors on empty submit', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: STRINGS.FORM_SUBMIT }));

    expect(screen.getByText(STRINGS.ERROR_FULL_NAME_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.ERROR_EMAIL_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.ERROR_COUNTRY_CODE_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.ERROR_PHONE_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.ERROR_DOCUMENT_REQUIRED)).toBeInTheDocument();
  });

  it('shows gmail error for non-gmail email', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(STRINGS.FORM_EMAIL_LABEL), 'test@yahoo.com');
    await user.click(screen.getByRole('button', { name: STRINGS.FORM_SUBMIT }));

    expect(screen.getByText(STRINGS.ERROR_EMAIL_GMAIL)).toBeInTheDocument();
  });

  it('shows format error for full name with digits', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(STRINGS.FORM_FULL_NAME_LABEL), 'John123');
    await user.click(screen.getByRole('button', { name: STRINGS.FORM_SUBMIT }));

    expect(screen.getByText(STRINGS.ERROR_FULL_NAME_LETTERS)).toBeInTheDocument();
  });

  it('shows format error for phone number with letters', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(STRINGS.FORM_PHONE_LABEL), 'abc123');
    await user.click(screen.getByRole('button', { name: STRINGS.FORM_SUBMIT }));

    expect(screen.getByText(STRINGS.ERROR_PHONE_FORMAT)).toBeInTheDocument();
  });

  it('does not call onSubmit when form has validation errors', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: STRINGS.FORM_SUBMIT }));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct payload on valid submission', async () => {
    const user = userEvent.setup();
    renderForm();

    const country = COUNTRIES[0];

    await user.type(screen.getByLabelText(STRINGS.FORM_FULL_NAME_LABEL), 'Jane Doe');
    await user.type(screen.getByLabelText(STRINGS.FORM_EMAIL_LABEL), 'jane@gmail.com');
    await user.selectOptions(screen.getByTestId('country-select'), country.isoCode);
    await user.type(screen.getByLabelText(STRINGS.FORM_PHONE_LABEL), '5551234567');

    const file = new File(['content'], 'document.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });

    await user.click(screen.getByRole('button', { name: STRINGS.FORM_SUBMIT }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: 'Jane Doe',
        email: 'jane@gmail.com',
        country_code: country.dialCode,
        phone_number: '5551234567',
        document_photo: file,
      }),
    );
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: STRINGS.FORM_CANCEL }));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('disables cancel button while loading', () => {
    renderForm(true);
    expect(screen.getByRole('button', { name: STRINGS.FORM_CANCEL })).toBeDisabled();
  });
});
