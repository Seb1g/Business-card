import React from "react";
import styles from "./deleteColumnModal.module.scss";

interface DeleteColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  columnTitle: string;
}

export const DeleteColumnModal: React.FC<DeleteColumnModalProps> = ({isOpen, onClose, onConfirm, columnTitle}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.deleteModalOverlay}>
      <div className={styles.deleteModalContent}>
        <div className={styles.deleteModalHeader}>Удаление колонки</div>
        <p style={{color: '#172b4d', marginBottom: '20px'}}>
          Вы уверены, что хотите удалить колонку {columnTitle}? Все карточки в ней также будут удалены.
        </p>
        <div className={styles.deleteModalControls}>
          <button className={styles.deleteColumnButtonSecondary} onClick={onClose}>
            Отмена
          </button>
          <button className={styles.buttonDanger} onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};