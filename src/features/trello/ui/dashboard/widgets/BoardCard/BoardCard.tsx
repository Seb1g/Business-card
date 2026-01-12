import { useState } from "react";
import { useAppDispatch } from "../../../../../../app/store";
import {
  renameBoardThunk,
  getAllBoardThunk,
  deleteBoardThunk,
} from "../../../../model/dashboard/thunks/dashboardThunk";
import { useNavigate } from "react-router-dom";

import styles from "./boardCard.module.scss";
import ui from "../../styles/ui.module.scss";

interface BoardCardProps {
  board: { id: string; title: string };
}

export const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const [renameModal, setRenameModal] = useState(false);
  const [renameModalTitle, setRenameModalTitle] = useState(board.title);
  const [deleteModal, setDeleteModal] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div
      id={board.id}
      className={styles.boardCard}
      onClick={() => {
        if (!renameModal && !deleteModal) {
          navigate(`/kanban/board?id=${board.id}`);
        }
      }}
    >
      {renameModal && !deleteModal && (
        <div className={styles.renameSection}>
          <div className={styles.boardTitle}>Rename This Board?</div>

          <input
            className={styles.input}
            value={renameModalTitle}
            onChange={(e) => setRenameModalTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                dispatch(
                  renameBoardThunk({
                    board_id: board.id,
                    new_name: renameModalTitle,
                  }),
                ).then(() => dispatch(getAllBoardThunk()));
                setRenameModal(false);
              }
              if (e.key === "Escape") setRenameModal(false);
            }}
            autoFocus
          />

          <div className={ui.actions}>
            <button
              className={`${ui.btn} ${ui.secondary}`}
              onClick={() => setRenameModal(false)}
            >
              Отмена
            </button>

            <button
              className={`${ui.btn} ${ui.primary}`}
              onClick={() => {
                dispatch(
                  renameBoardThunk({
                    board_id: board.id,
                    new_name: renameModalTitle,
                  }),
                ).then(() => dispatch(getAllBoardThunk()));
                setRenameModal(false);
              }}
            >
              Rename
            </button>
          </div>
        </div>
      )}

      {deleteModal && !renameModal && (
        <div className={styles.deleteSection}>
          <div className={styles.boardTitle}>Delete This Board?</div>

          <div
            className={ui.actions}
            style={{
              margin: "15px 0 15px 0",
            }}
          >
            <button
              className={`${ui.btn} ${ui.secondary}`}
              onClick={() => setDeleteModal(false)}
            >
              Отмена
            </button>

            <button
              className={`${ui.btn} ${ui.primary}`}
              onClick={() => {
                dispatch(deleteBoardThunk({ board_id: board.id })).then(() =>
                  dispatch(getAllBoardThunk()),
                );
                setDeleteModal(false);
              }}
            >
              Удалить
            </button>
          </div>
        </div>
      )}

      {!renameModal && !deleteModal && (
        <>
          <div className={styles.boardTitle}>{board.title}</div>

          <div className={styles.buttonContainer}>
            <button
              className={`${styles.iconButton} ${styles.rename}`}
              onClick={(e) => {
                e.stopPropagation();
                setRenameModal(true);
              }}
            >
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 122.88 102.06"
                width="15px"
                height="15px"
                enableBackground="new 0 0 122.88 102.06"
                xmlSpace="preserve"
              >
                <g>
                  <path d="M8.18,23.12h67.09v5.39H8.18c-0.77,0-1.47,0.31-1.98,0.82c-0.5,0.51-0.82,1.21-0.82,1.98v39.46c0,0.77,0.31,1.47,0.82,1.98 c0.51,0.5,1.21,0.82,1.98,0.82h67.09v5.39H8.18c-2.24,0-4.29-0.92-5.77-2.4L2.4,76.53C0.92,75.05,0,73.01,0,70.76V31.3 c0-2.24,0.92-4.29,2.4-5.77l0.01-0.01C3.89,24.04,5.94,23.12,8.18,23.12L8.18,23.12z M71.77,53.85c-1.52,0-2.75-1.23-2.75-2.75 c0-1.52,1.23-2.75,2.75-2.75h12.78V18.04c-0.39-3.8-1.56-6.62-3.34-8.6c-1.93-2.16-4.67-3.43-7.99-3.98 c-1.49-0.24-2.51-1.65-2.26-3.15c0.24-1.49,1.65-2.51,3.15-2.26c4.54,0.75,8.37,2.57,11.19,5.74c0.72,0.8,1.37,1.69,1.94,2.66 c0.72-1.25,1.58-2.35,2.56-3.32c2.94-2.92,6.88-4.51,11.59-5.1c1.51-0.18,2.88,0.89,3.06,2.4c0.18,1.51-0.89,2.88-2.4,3.06 c-3.52,0.44-6.38,1.54-8.39,3.53c-1.99,1.97-3.25,4.91-3.61,9.04v5.07h24.65c2.24,0,4.29,0.92,5.77,2.4l0.01,0.01 c1.48,1.48,2.4,3.53,2.4,5.77v39.46c0,2.24-0.92,4.29-2.4,5.77l-0.01,0.01c-1.48,1.48-3.53,2.4-5.77,2.4H90.05v5.07 c0.36,4.13,1.62,7.08,3.61,9.04c2,1.98,4.86,3.09,8.39,3.53c1.51,0.18,2.58,1.56,2.4,3.06c-0.18,1.51-1.55,2.58-3.06,2.4 c-4.7-0.59-8.65-2.18-11.59-5.1c-0.98-0.97-1.84-2.07-2.56-3.32c-0.57,0.97-1.22,1.85-1.94,2.66c-2.83,3.16-6.66,4.99-11.19,5.74 c-1.49,0.24-2.9-0.77-3.15-2.26c-0.24-1.49,0.77-2.9,2.26-3.15c3.32-0.55,6.06-1.81,7.99-3.98c1.78-1.99,2.94-4.81,3.34-8.6 l0-30.17H71.77L71.77,53.85L71.77,53.85z M90.05,28.5v19.84h12.98c1.52,0,2.75,1.23,2.75,2.75c0,1.52-1.23,2.75-2.75,2.75H90.05 v19.71h24.65c0.77,0,1.47-0.31,1.98-0.82c0.5-0.51,0.82-1.21,0.82-1.98V31.3c0-0.77-0.31-1.47-0.82-1.98 c-0.51-0.5-1.21-0.82-1.98-0.82H90.05L90.05,28.5z" />
                </g>
              </svg>
            </button>

            <button
              className={`${styles.iconButton} ${styles.delete}`}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModal(true);
              }}
            >
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="15px"
                height="15px"
                viewBox="0 0 108.294 122.88"
                enableBackground="new 0 0 108.294 122.88"
                xmlSpace="preserve"
              >
                <g>
                  <path d="M4.873,9.058h33.35V6.2V6.187c0-0.095,0.002-0.186,0.014-0.279c0.075-1.592,0.762-3.037,1.816-4.086l-0.007-0.007 c1.104-1.104,2.637-1.79,4.325-1.806l0.023,0.002V0h0.031h19.884h0.016c0.106,0,0.207,0.009,0.309,0.022 c1.583,0.084,3.019,0.76,4.064,1.81c1.102,1.104,1.786,2.635,1.803,4.315l-0.003,0.021h0.014V6.2v2.857h32.909h0.017 c0.138,0,0.268,0.014,0.401,0.034c1.182,0.106,2.254,0.625,3.034,1.41l0.004,0.007l0.005-0.007 c0.851,0.857,1.386,2.048,1.401,3.368l-0.002,0.032h0.014v0.032v10.829c0,1.472-1.195,2.665-2.667,2.665h-0.07H2.667 C1.195,27.426,0,26.233,0,24.762v-0.063V13.933v-0.014c0-0.106,0.004-0.211,0.018-0.315v-0.021 c0.089-1.207,0.624-2.304,1.422-3.098l-0.007-0.002C2.295,9.622,3.49,9.087,4.81,9.069l0.032,0.002V9.058H4.873L4.873,9.058z M77.79,49.097h-5.945v56.093h5.945V49.097L77.79,49.097z M58.46,49.097h-5.948v56.093h5.948V49.097L58.46,49.097z M39.13,49.097 h-5.946v56.093h5.946V49.097L39.13,49.097z M10.837,31.569h87.385l0.279,0.018l0.127,0.007l0.134,0.011h0.009l0.163,0.023 c1.363,0.163,2.638,0.789,3.572,1.708c1.04,1.025,1.705,2.415,1.705,3.964c0,0.098-0.009,0.193-0.019,0.286l-0.002,0.068 l-0.014,0.154l-7.393,79.335l-0.007,0.043h0.007l-0.016,0.139l-0.051,0.283l-0.002,0.005l-0.002,0.018 c-0.055,0.331-0.12,0.646-0.209,0.928l-0.007,0.022l-0.002,0.005l-0.009,0.018l-0.023,0.062l-0.004,0.021 c-0.118,0.354-0.264,0.698-0.432,1.009c-1.009,1.88-2.879,3.187-5.204,3.187H18.13l-0.247-0.014v0.003l-0.011-0.003l-0.032-0.004 c-0.46-0.023-0.889-0.091-1.288-0.202c-0.415-0.116-0.818-0.286-1.197-0.495l-0.009-0.002l-0.002,0.002 c-1.785-0.977-2.975-2.882-3.17-5.022L4.88,37.79l-0.011-0.125l-0.011-0.247l-0.004-0.116H4.849c0-1.553,0.664-2.946,1.707-3.971 c0.976-0.955,2.32-1.599,3.756-1.726l0.122-0.004v-0.007l0.3-0.013l0.104,0.002V31.569L10.837,31.569z M98.223,36.903H10.837 v-0.007l-0.116,0.004c-0.163,0.022-0.322,0.106-0.438,0.222c-0.063,0.063-0.104,0.132-0.104,0.179h-0.007l0.007,0.118l7.282,79.244 h-0.002l0.002,0.012c0.032,0.376,0.202,0.691,0.447,0.825l-0.002,0.004l0.084,0.032l0.063,0.012h0.077h72.695 c0.207,0,0.399-0.157,0.518-0.377l0.084-0.197l0.054-0.216l0.014-0.138h0.005l7.384-79.21L98.881,37.3 c0-0.045-0.041-0.111-0.103-0.172c-0.12-0.118-0.286-0.202-0.451-0.227L98.223,36.903L98.223,36.903z M98.334,36.901h-0.016H98.334 L98.334,36.901z M98.883,37.413v-0.004V37.413L98.883,37.413z M104.18,37.79l-0.002,0.018L104.18,37.79L104.18,37.79z M40.887,14.389H5.332v7.706h97.63v-7.706H67.907h-0.063c-1.472,0-2.664-1.192-2.664-2.664V6.2V6.168h0.007 c-0.007-0.22-0.106-0.433-0.259-0.585c-0.137-0.141-0.324-0.229-0.521-0.252h-0.082h-0.016H44.425h-0.031V5.325 c-0.213,0.007-0.422,0.104-0.576,0.259l-0.004-0.004l-0.007,0.004c-0.131,0.134-0.231,0.313-0.259,0.501l0.007,0.102V6.2v5.524 C43.554,13.196,42.359,14.389,40.887,14.389L40.887,14.389z" />
                </g>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
