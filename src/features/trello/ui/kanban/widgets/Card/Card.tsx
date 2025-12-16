import type {Cards} from "../../../../model/kanban/slices/kanbanSlice.ts";
import React, {useState} from "react";
import {useAppDispatch} from "../../../../../../app/store.ts";
import {deleteCardThunk, getOneBoardThunk, renameCardThunk} from "../../../../model/kanban/thunks/kanbanThunk.ts";
import {Draggable} from "@hello-pangea/dnd";
import styles from "./card.module.scss";
import {handleCancel, handleDeleteClick, handleSave} from "./handlers/handlers.ts";

interface CardProps {
  card: Cards;
  column_id: string;
  board_id: string;
  index: number;
}

export const Card: React.FC<CardProps> = ({card, column_id, board_id, index}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(card.content);
  const dispatch = useAppDispatch();

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={[
            styles.card,
            snapshot.isDragging ? styles.isDragging : ''
          ].join(' ')}
          style={provided.draggableProps.style}
          onClick={() => {
            if (!isEditing) {
              setIsEditing(true);
            }
          }}
        >
          {!isEditing && (
            <button
              className={styles.cardDeleteButton}
              onClick={(e: React.MouseEvent) => handleDeleteClick(
                e,
                dispatch,
                deleteCardThunk,
                column_id,
                card,
                getOneBoardThunk,
                board_id,
              )}
            >
              ✕
            </button>
          )}

          {isEditing ? (
            <>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className={styles.cardEditInput}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSave(
                      dispatch,
                      newContent,
                      card,
                      renameCardThunk,
                      column_id,
                      board_id,
                      getOneBoardThunk,
                      setIsEditing,
                    )
                  }
                  if (e.key === 'Escape') {
                    handleCancel(
                      setNewContent,
                      setIsEditing,
                      card
                    );
                  }
                }}
                autoFocus
              />
              <div className={styles.cardControls}>
                <button
                  type="button"
                  className={styles.cardSaveButton}
                  onClick={
                    () => handleSave(
                      dispatch,
                      newContent,
                      card,
                      renameCardThunk,
                      column_id,
                      board_id,
                      getOneBoardThunk,
                      setIsEditing,
                    )
                  }
                  disabled={!newContent.trim()}>
                  Сохранить
                </button>
                <button
                  type="button"
                  className={styles.cardCancelButton}
                  onClick={
                    () => handleCancel(
                      setNewContent,
                      setIsEditing,
                      card
                    )
                  }>
                  Отмена
                </button>
              </div>
            </>
          ) : (
            <div>
              {card.content}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};