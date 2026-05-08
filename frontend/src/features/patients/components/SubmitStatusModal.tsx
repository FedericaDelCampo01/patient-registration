import React from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { STRINGS } from '../../../constants/strings';
import tickIcon from '../../../assets/tick-icon.png';
import crossIcon from '../../../assets/ccross-icon.svg';
import styles from './SubmitStatusModal.module.css';

type ModalStatus = 'success' | 'error';

interface SubmitStatusModalProps {
  isOpen: boolean;
  status: ModalStatus;
  errorMessage?: string | null;
  onClose: () => void;
  onTryAgain?: () => void;
}

export const SubmitStatusModal: React.FC<SubmitStatusModalProps> = ({
  isOpen,
  status,
  errorMessage,
  onClose,
  onTryAgain,
}) => {
  const isSuccess = status === 'success';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={`${styles.content} ${isSuccess ? styles.success : styles.error}`}>
        {/* Icon */}
        <div className={styles.iconWrapper}>
          <img
            src={isSuccess ? tickIcon : crossIcon}
            className={styles.icon}
            alt=""
            aria-hidden="true"
          />
        </div>

        {/* Text */}
        <div className={styles.text}>
          <h3 className={styles.title}>
            {isSuccess ? STRINGS.MODAL_SUCCESS_TITLE : STRINGS.MODAL_ERROR_TITLE}
          </h3>
          <p className={styles.message}>
            {isSuccess
              ? STRINGS.MODAL_SUCCESS_MESSAGE
              : (errorMessage ?? STRINGS.MODAL_ERROR_MESSAGE)}
          </p>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {!isSuccess && onTryAgain && (
            <Button variant="ghost" onClick={onTryAgain}>
              {STRINGS.MODAL_TRY_AGAIN}
            </Button>
          )}
          <Button
            variant={isSuccess ? 'primary' : 'neutral'}
            onClick={onClose}
          >
            {STRINGS.MODAL_CLOSE}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
