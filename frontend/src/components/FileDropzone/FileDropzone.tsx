// ============================================================
// FileDropzone – drag & drop file upload, JPG only
// ============================================================

import React, { useCallback, useState } from 'react';
import uploadIcon from '../../assets/upload-icon.svg';
import crossIcon from '../../assets/ccross-icon.svg';
import styles from './FileDropzone.module.css';
import { STRINGS } from '../../constants/strings';

interface FileDropzoneProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      const isJpg = file.type === 'image/jpeg';
      if (!isJpg) {
        onChange(null);
        return;
      }
      onChange(file);
    },
    [onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <div
        className={[
          styles.dropzone,
          isDragging ? styles.dragging : '',
          error ? styles.dropzoneError : '',
          value ? styles.hasFile : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById('file-input')?.click();
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          accept=".jpg,image/jpeg"
          className={styles.hiddenInput}
          onChange={handleInputChange}
        />
        {value ? (
          <>
            <div className={styles.fileInfo}>
              <span className={styles.fileIcon}>📄</span>
              <span className={styles.fileName}>{value.name}</span>
            </div>
            <button
              type="button"
              className={styles.removeButton}
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              aria-label="Remove file"
            >
              <img src={crossIcon} className={styles.removeIcon} alt="" aria-hidden="true" />
            </button>
          </>
        ) : (
          <div className={styles.placeholder}>
            <img src={uploadIcon} className={styles.uploadIcon} alt="" aria-hidden="true" />
            <span className={styles.hint}>{STRINGS.FORM_DOCUMENT_HINT}</span>
          </div>
        )}
      </div>
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
