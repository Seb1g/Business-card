import apiClient from '../api/createApi';
import type {AxiosRequestConfig} from "axios";

export interface createBoardProps {
  title: string,
  user_id: number
}

// Board
export const createBoard = (board: createBoardProps) => {
  return apiClient.post('/api/v1/trello/create_board', board);
}

export const getOneBoard = (board_id: string, user_id: number) => {
  return apiClient.get(`/api/v1/trello/get_one_user_board?boardId=${board_id}&userId=${user_id}`);
}

export const getAllBoard = (user_id: number) => {
  return apiClient.get(`/api/v1/trello/get_all_user_boards?userId=${user_id}`);
}

export interface deleteBoardProps {
  board_id: string,
  user_id: number
}

export const deleteBoard = (deleteBoardProps: deleteBoardProps) => {
  const config: AxiosRequestConfig = {
    data: deleteBoardProps
  };

  return apiClient.delete('/api/v1/trello/delete_board', config);
};

export interface updateBoardProps {
  board_id: string,
  user_id: number,
  new_name: string,
}

export const renameBoard = (board: updateBoardProps) => {
  return apiClient.put('/api/v1/trello/rename_board', board);
}

export interface Cards {
  id: string;
  content: string;
  column_id: string;
  position: number;
}

export interface Columns {
  id: string;
  title: string;
  position: number;
  cards: Cards[] | null;
}

interface updateFullProps {
  board_id: string,
  user_id: number,
  board_data: Columns[],
}

export const updateBoard = (board: updateFullProps) => {
  return apiClient.post('/api/v1/trello/update_board',  board);
}
// Column
export interface createColumnProps {
  board_id: string;
  column_title: string;
}

export const createColumn = (column: createColumnProps) => {
  return apiClient.post(`/api/v1/trello/create_column`, column);
}

export interface deleteColumnProps {
  board_id: string;
  column_id: string;
}

export const deleteColumn = (column: deleteColumnProps) => {
  const config: AxiosRequestConfig = {
    data: column
  };

  return apiClient.delete('/api/v1/trello/delete_column', config)
}

export interface updateColumnProps {
  board_id: string,
  column_id: string,
  new_name: string,
}

export const updateColumn = (column: updateColumnProps) => {
  return apiClient.put(`/api/v1/trello/rename_column`, column);
}
// Card
export interface createCardProps {
  column_id: string;
  card_title: string;
}

export const createCard = (card: createCardProps) => {
  return apiClient.post(`/api/v1/trello/create_card`, card);
}

export interface updateCardProps {
  column_id: string;
  card_id: string;
  new_name: string;
}

export const updateCard = (card: updateCardProps) => {
  return apiClient.put(`/api/v1/trello/rename_card`, card);
}

export interface deleteCardProps {
  column_id: string;
  card_id: string;
}

export const deleteCard = (card: deleteCardProps) => {
  const config: AxiosRequestConfig = {
    data: card
  };

  return apiClient.delete(`/api/v1/trello/delete_card`, config);
}
