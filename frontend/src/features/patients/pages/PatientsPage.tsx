import React, { useState } from 'react';
import { PatientCard } from '../components/PatientCard';
import { PatientForm } from '../components/PatientForm';
import { SubmitStatusModal } from '../components/SubmitStatusModal';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { usePatients } from '../hooks/usePatients';
import { useCreatePatient } from '../hooks/useCreatePatient';
import { STRINGS } from '../../../constants/strings';
import type { CreatePatientPayload } from '../types';
import plusIcon from '../../../assets/plus-icon.png';
import styles from './PatientsPage.module.css';

export const PatientsPage: React.FC = () => {
  const { patients, isLoading, refresh } = usePatients();
  const { status, errorMessage, submit, reset } = useCreatePatient(refresh);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleOpenForm = () => setIsFormOpen(true);

  const handleCloseForm = () => setIsFormOpen(false);

  const handleSubmit = async (payload: CreatePatientPayload) => {
    await submit(payload);
    setIsFormOpen(false);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    reset();
  };

  const handleTryAgain = () => {
    setIsStatusModalOpen(false);
    reset();
    setIsFormOpen(true);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{STRINGS.APP_TITLE}</h1>
            <p className={styles.subtitle}>{STRINGS.APP_SUBTITLE}</p>
          </div>
          <Button variant="gradient" size="lg" pill onClick={handleOpenForm} className={styles.addBtn}>
            <img src={plusIcon} alt="" className={styles.plusIcon} />
            {STRINGS.ADD_PATIENT}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.main}>
        {/* Loading state */}
        {isLoading && (
          <div className={styles.centerState}>
            <div className={styles.spinner} />
            <p className={styles.stateText}>{STRINGS.PATIENTS_LOADING}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && patients.length === 0 && (
          <div className={styles.centerState}>
            <div className={styles.emptyIcon}>🏥</div>
            <h2 className={styles.emptyTitle}>{STRINGS.PATIENTS_EMPTY_TITLE}</h2>
            <p className={styles.stateText}>{STRINGS.PATIENTS_EMPTY_SUBTITLE}</p>
            <Button variant="gradient" pill onClick={handleOpenForm} className={styles.addBtn}>
              <img src={plusIcon} alt="" className={styles.plusIcon} />
              {STRINGS.ADD_PATIENT}
            </Button>
          </div>
        )}

        {/* Patients grid */}
        {!isLoading && patients.length > 0 && (
          <div className={styles.grid}>
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )}
      </main>

      {/* Registration form modal */}
      <Modal isOpen={isFormOpen} onClose={handleCloseForm} title={STRINGS.FORM_TITLE}>
        <PatientForm
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isLoading={status === 'loading'}
        />
      </Modal>

      {/* Success / Error status modal */}
      {isStatusModalOpen && (status === 'success' || status === 'error') && (
        <SubmitStatusModal
          isOpen={isStatusModalOpen}
          status={status}
          errorMessage={errorMessage}
          onClose={handleCloseStatusModal}
          onTryAgain={handleTryAgain}
        />
      )}
    </div>
  );
};
