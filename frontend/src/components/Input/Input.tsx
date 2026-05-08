// Input – reusable input component with error state

import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  id,
  className,
  ...rest
}) => {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.wrapper}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        className={[
          styles.input,
          error ? styles.inputError : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error ? (
        <span
          id={`${inputId}-error`}
          className={styles.errorMessage}
          role="alert"
        >
          {error}
        </span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </div>
  );
};
