import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../../app/store.ts";
import {
  createCardThunk,
  createColumnThunk, deleteCardThunk, deleteColumnThunk,
  getOneBoardThunk, renameCardThunk,
  renameColumnThunk,
  updateBoardThunk
} from "../../model/kanban/thunks/kanbanThunk.ts";
import {type Cards, type Columns, updateBoardLocal} from "../../model/kanban/slices/kanbanSlice.ts";
import {Draggable, Droppable, type DropResult} from "@hello-pangea/dnd";
import {DragDropContext} from "@hello-pangea/dnd";
import styles from './kanban.module.scss';

interface DeleteColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  columnTitle: string;
}

const DeleteColumnModal: React.FC<DeleteColumnModalProps> = ({isOpen, onClose, onConfirm, columnTitle}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>Удаление колонки</div>
        <p style={{color: '#172b4d', marginBottom: '20px'}}>
          Вы уверены, что хотите удалить колонку {columnTitle}? Все карточки в ней также будут удалены.
        </p>
        <div className={styles.modalControls}>
          <button className={styles.buttonSecondary} onClick={onClose}>
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

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (content: string) => void;
}

const CreateCardModal: React.FC<CreateCardModalProps> = ({isOpen, onClose, onCreate}) => {
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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>Создать новую карточку</div>
        <textarea
          className={styles.modalInput}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Введите содержимое карточки..."
          autoFocus
        />
        <div className={styles.modalControls}>
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

interface CardProps {
  card: Cards;
  column_id: string;
  board_id: string;
  user_id: number;
  index: number;
}

const Card: React.FC<CardProps> = ({card, column_id, board_id, user_id, index}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(card.content);
  const dispatch = useAppDispatch();

  const handleSave = async () => {
    if (newContent.trim() !== card.content.trim()) {
      await dispatch(renameCardThunk({column_id: column_id, card_id: card.id, new_name: newContent.trim()}));
      await dispatch(getOneBoardThunk({board_id: board_id, user_id: user_id}));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewContent(card.content);
    setIsEditing(false);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(deleteCardThunk({column_id: column_id, card_id: card.id}));
    await dispatch(getOneBoardThunk({board_id: board_id, user_id: user_id}));
  }

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
              onClick={handleDeleteClick}
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
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSave().then(r => console.log(r));
                  }
                  if (e.key === 'Escape') {
                    handleCancel();
                  }
                }}
                autoFocus
              />
              <div className={styles.cardControls}>
                <button className={styles.cardSaveButton} onClick={handleSave} disabled={!newContent.trim()}>
                  Сохранить
                </button>
                <button className={styles.cardCancelButton} onClick={handleCancel}>
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

interface ColumnProps {
  column: Columns;
  index: number;
  board_id: string;
  user_id: number;
}

const Column: React.FC<ColumnProps> = ({column, board_id, user_id}) => {
  const [renameTitle, setRenameTitle] = useState<boolean>(false);
  const [newTitleColumn, setNewTitleColumn] = useState<string>(column.title);
  const dispatch = useAppDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);

  const handleDeleteColumn = async () => {
    await dispatch(deleteColumnThunk({board_id, column_id: column.id}))
    await dispatch(getOneBoardThunk({board_id: board_id, user_id: user_id}));
    setIsDeleteModalOpen(false);
  };

  const handleCreateCard = async (content: string) => {
    await dispatch(createCardThunk({column_id: column.id, card_title: content}))
    await dispatch(getOneBoardThunk({board_id: board_id, user_id: user_id}));
    setIsCreateCardModalOpen(false);
  };

  const handleRenameSave = async () => {
    if (newTitleColumn.trim() !== column.title) {
      await dispatch(renameColumnThunk({
        board_id: board_id,
        column_id: column.id,
        new_name: newTitleColumn.trim()
      }));
      await dispatch(getOneBoardThunk({board_id: board_id, user_id: user_id}));
    }
    setRenameTitle(false);
  };

  const handleRenameCancel = () => {
    setNewTitleColumn(column.title);
    setRenameTitle(false);
  };

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        {renameTitle ? (
          <div style={{width: '100%'}}>
            <input
              type="text"
              value={newTitleColumn}
              onChange={(e) => setNewTitleColumn(e.target.value)}
              className={styles.columnTitleInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSave();
                }
                if (e.key === 'Escape') {
                  handleRenameCancel();
                }
              }}
              onBlur={handleRenameSave}
              autoFocus
            />
            <div className={styles.columnTitleControls}>
              <button className={styles.columnTitleSave} onClick={handleRenameSave} disabled={!newTitleColumn.trim()}>
                Сохранить
              </button>
              <button className={styles.columnTitleCancel} onClick={handleRenameCancel}>
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div
            className={styles.columnTitleWrapper}
            onClick={() => setRenameTitle(true)}
          >
            <div>{column.title}({column.cards?.length ?? 0})</div>
          </div>
        )}

        {!renameTitle && (
          <div className={styles.columnHeaderButtonContainer}>
            <button
              className={styles.columnHeaderButton}
              onClick={() => setIsCreateCardModalOpen(true)}
            >
              C
            </button>
            <button
              className={styles.columnHeaderButton}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              D
            </button>
          </div>
        )}

      </div>

      <Droppable droppableId={column.id} type="card">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={[
              styles.cardsList,
              snapshot.isDraggingOver ? styles.isDraggingOver : ''
            ].join(' ')}
          >
            {(column.cards ?? [])
              .slice()
              .sort((a, b) => a.position - b.position)
              .map((card, idx) => (
                <Card key={card.id} card={card} index={idx} board_id={board_id} user_id={user_id}
                      column_id={column.id}/>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <DeleteColumnModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteColumn}
        columnTitle={column.title}
      />

      <CreateCardModal
        isOpen={isCreateCardModalOpen}
        onClose={() => setIsCreateCardModalOpen(false)}
        onCreate={handleCreateCard}
      />
    </div>
  );
};

interface AddColumnProps {
  board_id: string;
  user_id: number;
}

const AddColumnButton: React.FC<AddColumnProps> = ({board_id, user_id}: AddColumnProps) => {
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
                  await dispatch(getOneBoardThunk({board_id: board_id, user_id: user_id}))
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

export const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const boardId = searchParams.get("id");

  const {board} = useAppSelector((state) => state.trelloKanban);
  const {user} = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (boardId) {
      dispatch(getOneBoardThunk({board_id: boardId, user_id: user.ID}));
    }
  }, [dispatch, boardId, user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!boardId) {
    return <div>Ошибка: ID доски не указан в URL.</div>;
  }

  if (!board) {
    return (
      <div className={styles.kanbanBoard} style={{justifyContent: 'center', alignItems: 'center'}}>
        Загрузка доски...
      </div>
    );
  }

  const onDragEnd = (result: DropResult) => {
    const {destination, source, type} = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    if (!board || !board.columns) return;

    const updatedBoard = {
      ...board,
      columns: board.columns.map((col) => ({
        ...col,
        cards: (col.cards ?? []).map((c) => ({...c})),
      })),
    };

    if (type === "column") {
      const [moved] = updatedBoard.columns.splice(source.index, 1);
      updatedBoard.columns.splice(destination.index, 0, moved);
      updatedBoard.columns = updatedBoard.columns.map((col, i) => ({...col, position: i + 1}));
    } else {
      const sourceCol = updatedBoard.columns.find((c) => c.id === source.droppableId);
      const destCol = updatedBoard.columns.find((c) => c.id === destination.droppableId);
      if (!sourceCol || !destCol) {
        return;
      }

      const [movedCard] = sourceCol.cards.splice(source.index, 1);
      movedCard.column_id = destCol.id;
      destCol.cards.splice(destination.index, 0, movedCard);

      sourceCol.cards = sourceCol.cards.map((c, i) => ({...c, position: i + 1}));
      destCol.cards = destCol.cards.map((c, i) => ({...c, position: i + 1}));
    }

    dispatch(updateBoardLocal(updatedBoard));

    dispatch(
      updateBoardThunk({
        board_id: board.id,
        user_id: user.ID,
        columns: updatedBoard.columns,
      })
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.kanbanBoard}>
        <div className={styles.boardHeaderContainer}>
          <div className={styles.boardHeaderTitle}>
            {board.title}
          </div>
        </div>

        <Droppable droppableId="board" type="column" direction={isMobile ? "vertical" : "horizontal"}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={styles.columnsContainer}>

              {(board.columns ?? [])
                .slice()
                .sort((a, b) => a.position - b.position)
                .map((column, index) => (
                  <Draggable draggableId={column.id} index={index} key={column.id}>
                    {(providedDr) => (
                      <div
                        ref={providedDr.innerRef}
                        {...providedDr.draggableProps}
                        {...providedDr.dragHandleProps}
                        style={providedDr.draggableProps.style}
                      >
                        <Column column={column} index={index} board_id={board.id}
                                user_id={user.ID}/>
                      </div>
                    )}
                  </Draggable>
                ))}

              {provided.placeholder}

              <AddColumnButton board_id={board.id} user_id={user.ID}/>

            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
