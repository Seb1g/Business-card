import type {DropResult} from "@hello-pangea/dnd";
import {type Board} from "../../../model/kanban/slices/kanbanSlice.ts";
import type {Action} from "@reduxjs/toolkit";
import {updateBoardThunk} from "../../../model/kanban/thunks/kanbanThunk.ts";
import type {AppDispatch} from "../../../../../app/store.ts";

export const OnDragEnd = (
  result: DropResult,
  board: Board,
  dispatch: AppDispatch,
  updateBoardLocal: (payload: Board) => Action,
  ID: number
) => {
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
      user_id: ID,
      columns: updatedBoard.columns,
    })
  );
};