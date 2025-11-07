import apiClient from '../api/createApi';

export interface createBoardProps {
  title: string,
  user_id: number
}

// Board
export const createBoard = (board: createBoardProps) => {
  return apiClient.post('/api/v1/trello/create_board', board);
}

export const getOneBoard = (board_id: string) => {
  return apiClient.get(`/api/v1/trello/board/${board_id}`);
}

export const getAllBoard = () => {
  return apiClient.get(`/api/v1/trello/get_all_user_boards`);
}

export const deleteBoard = (board_id: string) => {
  return apiClient.delete(`/api/v1/trello/board/${board_id}`);
};

export const renameBoard = (board_id: string, new_name: string) => {
  return apiClient.put(`/api/v1/trello/board/${board_id}`, {new_name: new_name});
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

export const updateBoard = (board_id: string, columns: Columns[]) => {
  return apiClient.post(`/api/v1/trello/board/${board_id}`,  {board_data: columns});
}
// Column
export const createColumn = (board_id: string, column_title: string) => {
  return apiClient.post(`/api/v1/trello/board/${board_id}/column`, {column_title: column_title});
}

export const deleteColumn = (board_id: string, column_id: string) => {
  return apiClient.delete(`/api/v1/trello/board/${board_id}/column/${column_id}`);
}

export const updateColumn = (board_id: string, column_id: string, new_name: string) => {
  return apiClient.put(`/api/v1/trello/board/${board_id}/column/${column_id}`, {new_name: new_name});
}
// Card
export const createCard = (column_id: string, card_title: string) => {
  return apiClient.post(`/api/v1/trello/column/${column_id}/card`, {card_title: card_title});
}

export const updateCard = (column_id: string, card_id: string, new_name: string) => {
  return apiClient.put(`/api/v1/trello/column/${column_id}/card/${card_id}`, {new_name:  new_name});
}

export const deleteCard = (column_id: string, card_id: string,) => {
  return apiClient.delete(`/api/v1/trello/column/${column_id}/card/${card_id}`);
}
