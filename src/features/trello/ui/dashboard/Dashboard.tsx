import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
  createBoardThunk,
  getAllBoardThunk,
} from "../../model/dashboard/thunks/dashboardThunk";

import { BoardCard } from "./widgets/BoardCard/BoardCard";

import styles from "./styles/dashboard.module.scss";
import boardCardStyles from "./widgets/BoardCard/boardCard.module.scss";
import ui from "./styles/ui.module.scss";

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { boards } = useAppSelector((state) => state.trelloDashboard);

  const [creating, setCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  useEffect(() => {
    if (user?.ID) {
      dispatch(getAllBoardThunk());
    }
  }, [dispatch, user]);

  const handleCreateBoard = async () => {
    setCreating(false);
    await dispatch(
      createBoardThunk({ title: newBoardTitle, user_id: user!.ID }),
    );
    await dispatch(getAllBoardThunk());
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Your Boards:</h1>

      <div className={styles.boardsGrid}>
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}

        <div
          className={boardCardStyles.boardCard}
          onClick={() => setCreating(true)}
        >
          {creating ? (
            <div onClick={(e) => e.stopPropagation()}>
              <div className={ui.modalTitle}>Create New Board</div>

              <input
                className={boardCardStyles.input}
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateBoard();
                  if (e.key === "Escape") setCreating(false);
                }}
                autoFocus
              />

              <div className={ui.actions}>
                <button
                  className={`${ui.btn} ${ui.primary}`}
                  onClick={handleCreateBoard}
                  disabled={!newBoardTitle.trim()}
                >
                  Сохранить
                </button>

                <button
                  className={`${ui.btn} ${ui.secondary}`}
                  onClick={() => setCreating(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className={boardCardStyles.boardTitle}>Create New Board</div>
          )}
        </div>
      </div>
    </div>
  );
};
