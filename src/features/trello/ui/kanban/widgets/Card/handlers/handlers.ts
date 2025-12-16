import type {AsyncThunkAction} from "@reduxjs/toolkit";
import type {Cards} from "../../../../../model/kanban/slices/kanbanSlice.ts";
import React from "react";
import type {AppDispatch} from "../../../../../../../app/store.ts";


export const handleSave = async (
  dispatch: AppDispatch,
  newContent: string,
  card: Cards,
  renameCardThunk: (payload: { column_id: string, card_id: string, new_name: string }) => AsyncThunkAction<
    unknown,
    { column_id: string, card_id: string, new_name: string },
    { rejectValue: string }
  >,
  column_id: string,
  board_id: string,
  getOneBoardThunk: (payload: { board_id: string }) => AsyncThunkAction<
    unknown,
    { board_id: string },
    { rejectValue: string }
  >,
  setIsEditing: (arg: boolean) => void
) => {
  if (newContent.trim() !== card.content.trim()) {
    await dispatch(renameCardThunk({column_id: column_id, card_id: card.id, new_name: newContent.trim()}));
    await dispatch(getOneBoardThunk({board_id}));
  }
  setIsEditing(false);
};

export const handleCancel = (
  setNewContent: (arg: string) => void,
  setIsEditing: (arg: boolean) => void,
  card: Cards
) => {
  setNewContent(card.content);
  setIsEditing(false);
};

export const handleDeleteClick = async (
  e: React.MouseEvent,
  dispatch: AppDispatch,
  deleteCardThunk: (payload: { column_id: string, card_id: string }) => AsyncThunkAction<
    unknown,
    { column_id: string, card_id: string },
    { rejectValue: string }
  >,
  column_id: string,
  card: Cards,
  getOneBoardThunk: (payload: { board_id: string }) => AsyncThunkAction<
    unknown,
    { board_id: string },
    { rejectValue: string }
  >,
  board_id: string,
) => {
  e.stopPropagation();
  await dispatch(deleteCardThunk({column_id: column_id, card_id: card.id}));
  await dispatch(getOneBoardThunk({board_id}));
}