import React, {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../../app/store.ts";
import {
  getOneBoardThunk,
} from "../../model/kanban/thunks/kanbanThunk.ts";
import {updateBoardLocal} from "../../model/kanban/slices/kanbanSlice.ts";
import {Draggable, Droppable, type DropResult} from "@hello-pangea/dnd";
import {DragDropContext} from "@hello-pangea/dnd";
import styles from './styles/kanban.module.scss';
import {Column} from "./widgets/Column/Column.tsx";
import {AddColumnButton} from "./widgets/AddColumnButton/AddColumnButton.tsx";
import {OnDragEnd as DragEndLogic} from "./lib/Hooks.tsx";

export const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const boardId = searchParams.get("id");

  const {board} = useAppSelector((state) => state.trelloKanban);
  const {user} = useAppSelector((state) => state.auth);

  const handleOnDragEnd = useCallback(
    (result: DropResult) => {
      if (board) {
        DragEndLogic(
          result,
          board,
          dispatch,
          updateBoardLocal,
          user.ID
        );
      }
    },
    [board, dispatch, user.ID]
  );

  useEffect(() => {
    if (boardId) {
      dispatch(getOneBoardThunk({board_id: boardId}));
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
    return <div>Ошибка: Такой доски не существует.</div>;
  }

  if (!board) {
    return (
      <div className={styles.kanbanBoard} style={{justifyContent: 'center', alignItems: 'center'}}>
        Загрузка доски...
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className={styles.kanbanBoard}>
        <div className={styles.boardHeaderContainer}>
          <div className={styles.boardHeaderTitle}>
            {board.title}
          </div>
          <div className={styles.boardHeaderUserPopup}>

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
                        <Column column={column} index={index} board_id={board.id}/>
                      </div>
                    )}
                  </Draggable>
                ))}

              {provided.placeholder}

              <AddColumnButton board_id={board.id}/>

            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
