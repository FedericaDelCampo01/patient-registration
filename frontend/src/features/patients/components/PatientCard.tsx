import React, { useState } from 'react';
import type { Patient } from '../types';
import { STRINGS } from '../../../constants/strings';
import arrowDownIcon from '../../../assets/arrow-down-icon.svg';
import styles from './PatientCard.module.css';

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date(patient.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
      {/* Always visible */}
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          {patient.full_name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.headerInfo}>
          <h3 className={styles.name}>{patient.full_name}</h3>
          <span className={styles.date}>{formattedDate}</span>
        </div>
        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? STRINGS.CARD_COLLAPSE : STRINGS.CARD_EXPAND}
        >
          <img
            src={arrowDownIcon}
            className={`${styles.chevron} ${isExpanded ? styles.chevronUp : ''}`}
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Document photo — always visible */}
      <div className={styles.documentPreview}>
        <img
          src={patient.document_photo_url}
          alt={`${patient.full_name} document`}
          className={styles.documentImage}
          loading="lazy"
        />
      </div>

      {/* Expanded details */}
      <div className={`${styles.details} ${isExpanded ? styles.detailsVisible : ''}`}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>{STRINGS.CARD_EMAIL_LABEL}</span>
          <span className={styles.detailValue}>{patient.email}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>{STRINGS.CARD_PHONE_LABEL}</span>
          <span className={styles.detailValue}>{patient.full_phone}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>{STRINGS.CARD_REGISTERED_LABEL}</span>
          <span className={styles.detailValue}>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};
