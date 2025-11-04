import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../app/store.ts";
import {
  createBoardThunk,
  deleteBoardThunk,
  getAllBoardThunk,
  renameBoardThunk,
} from "../../model/dashboard/thunks/dashboardThunk.ts";
import {useNavigate} from "react-router-dom";
import "./dashboard.scss";
import styles from "../kanban/kanban.module.scss";

interface BoardCardProps {
  board: { id: string; title: string };
}

const BoardCard: React.FC<BoardCardProps> = ({board}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [renameModal, setRenameModal] = useState(false);
  const [renameModalTitle, setRenameModalTitle] = useState(board.title);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState<string | null>(null);

  const {user} = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRenameModal(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModal(true);
  };

  const handleBoardClick = () => {
    if (!renameModal && !deleteModal) {
      navigate(`/kanban/board?id=${board.id}`);
    }
  };

  return (
    <div
      id={board.id}
      className={`board-card ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleBoardClick}
    >
      {renameModal && !deleteModal && (
        <div className="rename-section">
          <div className="board-title">Rename This Board?</div>
          <input
            type="text"
            value={renameModalTitle}
            onChange={(e) => setRenameModalTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const renameBoard = async () => {
                  await dispatch(
                    renameBoardThunk({
                      board_id: board.id,
                      user_id: user.ID,
                      new_name: renameModalTitle,
                    })
                  );
                  await dispatch(getAllBoardThunk({user_id: user.ID}));
                };
                renameBoard().then(r => console.log(r));
                setRenameModal(false);
              }
              if (e.key === "Escape") {
                setRenameModal(false);
              }
            }}
            autoFocus
          />
          <div className="actions">
            <button
              className={`btn secondary ${
                isDeleteHovered === "cancel" ? "hovered" : ""
              }`}
              onClick={() => setRenameModal(false)}
              onMouseEnter={() => setIsDeleteHovered("cancel")}
              onMouseLeave={() => setIsDeleteHovered(null)}
            >
              Отмена
            </button>
            <button
              className={`btn primary ${
                isDeleteHovered === "confirm" ? "hovered" : ""
              }`}
              onClick={() => {
                const renameBoard = async () => {
                  await dispatch(
                    renameBoardThunk({
                      board_id: board.id,
                      user_id: user.ID,
                      new_name: renameModalTitle,
                    })
                  );
                  await dispatch(getAllBoardThunk({user_id: user.ID}));
                };
                renameBoard().then(r => console.log(r));
                setRenameModal(false);
              }}
              onMouseEnter={() => setIsDeleteHovered("confirm")}
              onMouseLeave={() => setIsDeleteHovered(null)}
            >
              Rename
            </button>
          </div>
        </div>
      )}

      {deleteModal && !renameModal && (
        <div className="delete-section">
          <div className="board-title">Delete This Board?</div>
          <div className="actions">
            <button
              className={`btn secondary ${
                isDeleteHovered === "cancel" ? "hovered" : ""
              }`}
              onClick={() => setDeleteModal(false)}
              onMouseEnter={() => setIsDeleteHovered("cancel")}
              onMouseLeave={() => setIsDeleteHovered(null)}
            >
              Отмена
            </button>
            <button
              className={`btn primary ${
                isDeleteHovered === "confirm" ? "hovered" : ""
              }`}
              onClick={() => {
                const deleteBoard = async () => {
                  await dispatch(
                    deleteBoardThunk({
                      board_id: board.id,
                      user_id: user.ID,
                    })
                  );
                  await dispatch(getAllBoardThunk({user_id: user.ID}));
                };
                deleteBoard().then(r => console.log(r));
                setDeleteModal(false);
              }}
              onMouseEnter={() => setIsDeleteHovered("confirm")}
              onMouseLeave={() => setIsDeleteHovered(null)}
            >
              Удалить
            </button>
          </div>
        </div>
      )}

      {!renameModal && !deleteModal && (
        <>
          <div className="board-title">{board.title}</div>
          <div className="button-container">
            <button
              className={`rename ${
                hoveredButton === "rename" ? "hovered" : ""
              }`}
              onClick={handleRename}
              onMouseEnter={() => setHoveredButton("rename")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              1 (R)
            </button>
            <button
              className={`delete ${
                hoveredButton === "delete" ? "hovered" : ""
              }`}
              onClick={handleDelete}
              onMouseEnter={() => setHoveredButton("delete")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              2 (D)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector((state) => state.auth);
  const {boards} = useAppSelector((state) => state.trelloDashboard);

  const [isHovered, setIsHovered] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  useEffect(() => {
    if (user && user.ID) {
      dispatch(getAllBoardThunk({user_id: user.ID}));
    }
  }, [dispatch, user]);

  const handleCreateBoard = async () => {
    setCreating(false);
    await dispatch(createBoardThunk({title: newBoardTitle, user_id: user.ID}));
    await dispatch(getAllBoardThunk({user_id: user.ID}));
  };

  return (
    <div className="dashboard-container">
      <h1>Your Boards:</h1>
      <div className="boards-grid">
        {boards &&
          boards.map((board) => <BoardCard key={board.id} board={board}/>)}

        <div
          className={`board-card ${isHovered ? "hovered" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setCreating(true)}
        >
          {creating ? (
            <div className="create-section" onClick={(e) => e.stopPropagation()}>
              <div className="modal-title">Create New Board</div>
              <input
                type="text"
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateBoard().then(r => console.log(r));
                  if (e.key === "Escape") setCreating(false);
                }}
                autoFocus
              />
              <div className={styles.cardControls}>
                <button className={styles.cardSaveButton} onClick={handleCreateBoard} disabled={!newBoardTitle.trim()}>
                  Сохранить
                </button>
                <button className={styles.cardCancelButton} onClick={() => setCreating(false)}>
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="board-title">Create New Board</div>
          )}
        </div>
      </div>
    </div>
  );
};
