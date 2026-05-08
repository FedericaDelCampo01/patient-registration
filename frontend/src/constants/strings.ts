// UI Strings – Patient Registration

export const STRINGS = {
  // --- App ---
  APP_TITLE: 'Patient Registration',
  APP_SUBTITLE: 'Manage your patients efficiently',

  // --- Patients List ---
  ADD_PATIENT: 'Add Patient',
  PATIENTS_EMPTY_TITLE: 'No patients yet',
  PATIENTS_EMPTY_SUBTITLE: 'Add your first patient to get started',
  PATIENTS_LOADING: 'Loading patients...',

  // --- Patient Card ---
  CARD_EXPAND: 'View details',
  CARD_COLLAPSE: 'Hide details',
  CARD_EMAIL_LABEL: 'Email',
  CARD_PHONE_LABEL: 'Phone',
  CARD_REGISTERED_LABEL: 'Registered',
  CARD_DOCUMENT_LABEL: 'Document Photo',

  // --- Form ---
  FORM_TITLE: 'Register New Patient',
  FORM_SUBMIT: 'Register Patient',
  FORM_CANCEL: 'Cancel',

  FORM_FULL_NAME_LABEL: 'Full Name',
  FORM_FULL_NAME_PLACEHOLDER: 'John Doe',

  FORM_EMAIL_LABEL: 'Email Address',
  FORM_EMAIL_PLACEHOLDER: 'patient@gmail.com',

  FORM_COUNTRY_CODE_LABEL: 'Country',
  FORM_COUNTRY_SELECT_PLACEHOLDER: 'Select country',
  FORM_COUNTRY_SEARCH_PLACEHOLDER: 'Search...',
  FORM_COUNTRY_NO_RESULTS: 'No countries found',

  FORM_PHONE_LABEL: 'Phone Number',
  FORM_PHONE_PLACEHOLDER: '99123456',

  FORM_DOCUMENT_LABEL: 'Document Photo',
  FORM_DOCUMENT_HINT: 'Drag & drop a JPG file here, or click to select',
  FORM_DOCUMENT_SELECTED: 'File selected',

  // --- Validation errors ---
  ERROR_FULL_NAME_REQUIRED: 'Full name is required.',
  ERROR_FULL_NAME_LETTERS: 'Full name must contain only letters and spaces.',
  ERROR_EMAIL_REQUIRED: 'Email address is required.',
  ERROR_EMAIL_GMAIL: 'Only @gmail.com addresses are accepted.',
  ERROR_COUNTRY_CODE_REQUIRED: 'Please select a country.',
  ERROR_PHONE_REQUIRED: 'Phone number is required.',
  ERROR_PHONE_FORMAT: 'Phone number must contain only digits.',
  ERROR_DOCUMENT_REQUIRED: 'Document photo is required.',
  ERROR_DOCUMENT_FORMAT: 'Only JPG images are accepted.',

  // --- Modal states ---
  MODAL_SUCCESS_TITLE: 'Patient Registered!',
  MODAL_SUCCESS_MESSAGE: 'The patient has been successfully registered. A confirmation email has been sent.',
  MODAL_ERROR_TITLE: 'Registration Failed',
  MODAL_ERROR_MESSAGE: 'Something went wrong. Please try again.',
  MODAL_ERROR_DUPLICATE_EMAIL: 'This email address is already registered.',
  MODAL_CLOSE: 'Close',
  MODAL_TRY_AGAIN: 'Try Again',
} as const;
