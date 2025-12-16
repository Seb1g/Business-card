import React, {useState} from "react";
import {useAppDispatch} from "../../../../../../app/store.ts";
import styles from "./addColumnButton.module.scss"
import {createColumnThunk, getOneBoardThunk} from "../../../../model/kanban/thunks/kanbanThunk.ts";

interface AddColumnProps {
  board_id: string;
}

export const AddColumnButton: React.FC<AddColumnProps> = ({board_id}: AddColumnProps) => {
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [newColumnTitle, setNewColumnTitle] = useState<string>('');
  const dispatch = useAppDispatch();

  return (
    <div
      className={styles.addColumnButton}
      onClick={() => {
        if (!isCreated) setIsCreated(true)
      }}
    >
      {isCreated ? (
        <div className={styles.addColumnCreateBox} onClick={(e) => e.stopPropagation()}>
          <div className={styles.addColumnTitlePrompt}>Create New Column</div>
          <input
            type="text"
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className={styles.addColumnInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const createColumn = async () => {
                  await dispatch(createColumnThunk({board_id: board_id, column_title: newColumnTitle}))
                  await dispatch(getOneBoardThunk({board_id}))
                }
                createColumn().then(r => console.log(r))
                setIsCreated(false);
              }
              if (e.key === 'Escape') {
                setIsCreated(false);
              }
            }}
            onBlur={() => setIsCreated(false)}
            autoFocus
          />
        </div>
      ) : (
        <div className={styles.addColumnTitle}>
          Create New Column
        </div>
      )}
    </div>
  );
};