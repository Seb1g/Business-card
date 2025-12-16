import React, {useState} from "react";
import styles from "./createCardModal.module.scss";

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (content: string) => void;
}

export const CreateCardModal: React.FC<CreateCardModalProps> = ({isOpen, onClose, onCreate}) => {
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (content.trim()) {
      onCreate(content.trim());
      setContent('');
      onClose();
    }
  };

  return (
    <div className={styles.createModalOverlay}>
      <div className={styles.createModalContent}>
        <div className={styles.createModalHeader}>Создать новую карточку</div>
        <textarea
          className={styles.createModalInput}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Введите содержимое карточки..."
          autoFocus
        />
        <div className={styles.createModalControls}>
          <button className={styles.buttonSecondary} onClick={onClose}>
            Отмена
          </button>
          <button className={styles.buttonPrimary} onClick={handleCreate} disabled={!content.trim()}>
            Создать
          </button>
        </div>
      </div>
    </div>
  );
};