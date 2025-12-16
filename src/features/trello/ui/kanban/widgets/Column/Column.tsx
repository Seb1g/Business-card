import type {Columns} from "../../../../model/kanban/slices/kanbanSlice.ts";
import React, {useState} from "react";
import {useAppDispatch} from "../../../../../../app/store.ts";
import {
  createCardThunk,
  deleteColumnThunk,
  getOneBoardThunk,
  renameColumnThunk
} from "../../../../model/kanban/thunks/kanbanThunk.ts";
import styles from "./column.module.scss";
import {Droppable} from "@hello-pangea/dnd";
import {DeleteColumnModal} from "../DeleteColumnModal/DeleteColumnModal.tsx";
import {CreateCardModal} from "../CreateCardModal/CreateCardModal.tsx";
import {Card} from "../Card/Card.tsx";

interface ColumnProps {
  column: Columns;
  index: number;
  board_id: string;
}

export const Column: React.FC<ColumnProps> = ({column, board_id}) => {
  const [renameTitle, setRenameTitle] = useState<boolean>(false);
  const [newTitleColumn, setNewTitleColumn] = useState<string>(column.title);
  const dispatch = useAppDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);

  const handleDeleteColumn = async () => {
    await dispatch(deleteColumnThunk({board_id, column_id: column.id}))
    await dispatch(getOneBoardThunk({board_id}));
    setIsDeleteModalOpen(false);
  };

  const handleCreateCard = async (content: string) => {
    await dispatch(createCardThunk({column_id: column.id, card_title: content}))
    await dispatch(getOneBoardThunk({board_id}));
    setIsCreateCardModalOpen(false);
  };

  const handleRenameSave = async () => {
    if (newTitleColumn.trim() !== column.title) {
      await dispatch(renameColumnThunk({
        board_id: board_id,
        column_id: column.id,
        new_name: newTitleColumn.trim()
      }));
      await dispatch(getOneBoardThunk({board_id}));
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
                  handleRenameSave().then(r => console.log(r));
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
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                   xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 114.314 122.881" height="15px" width="15px"
                   enableBackground="new 0 0 114.314 122.881" xmlSpace="preserve">
                <g>
                  <path fillRule="evenodd" clipRule="evenodd" d="M69.879,71.653h35.781c4.762,0,8.654,3.897,8.654,8.653v33.92 c0,4.761-3.898,8.654-8.654,8.654H69.879c-4.76,0-8.652-3.894-8.652-8.654v-33.92C61.227,75.551,65.119,71.653,69.879,71.653 L69.879,71.653L69.879,71.653z M26.264,78.121c-1.728,0-3.167-1.564-3.167-3.455c0-1.934,1.397-3.456,3.167-3.456h16.635 c1.728,0,3.168,1.564,3.168,3.456c0,1.933-1.399,3.455-3.168,3.455H26.264L26.264,78.121L26.264,78.121z M101.449,59.661h-6.951 V8.105c0-0.329-0.125-0.617-0.33-0.823c-0.205-0.205-0.494-0.329-0.822-0.329H8.064c-0.329,0-0.618,0.124-0.822,0.329 C7.034,7.488,6.911,7.775,6.911,8.105v96.35c0,0.329,0.124,0.616,0.329,0.822c0.206,0.205,0.494,0.329,0.822,0.329h37.108v6.951 c-44.6,0-7.982,0-37.067,0c-2.222,0-4.278-0.906-5.717-2.386C0.905,108.69,0,106.675,0,104.453V8.105 c0-2.222,0.905-4.278,2.387-5.719C3.867,0.905,5.883,0,8.104,0h85.283c2.221,0,4.279,0.905,5.719,2.386 c1.48,1.481,2.385,3.497,2.385,5.719C101.49,47.892,101.449-1.153,101.449,59.661L101.449,59.661z M26.223,33.117 c-1.728,0-3.167-1.564-3.167-3.457c0-1.933,1.399-3.456,3.167-3.456h48.922c1.729,0,3.166,1.564,3.166,3.455 c0,1.934-1.396,3.457-3.166,3.457L26.223,33.117L26.223,33.117L26.223,33.117z M26.223,55.619c-1.728,0-3.167-1.564-3.167-3.455 c0-1.934,1.399-3.456,3.167-3.456l48.922,0c1.729,0,3.166,1.563,3.166,3.456c0,1.933-1.396,3.455-3.166,3.455L26.223,55.619 L26.223,55.619L26.223,55.619z M77.186,100.626c-1.854,0-3.357-1.503-3.357-3.356s1.504-3.356,3.357-3.356h7.225v-7.231 c0-1.854,1.504-3.356,3.357-3.356c1.852,0,3.355,1.503,3.355,3.356v7.231h7.232c1.852,0,3.355,1.503,3.355,3.356 s-1.504,3.356-3.355,3.356h-7.227v7.231c0,1.854-1.504,3.356-3.355,3.356c-1.854,0-3.357-1.503-3.357-3.356v-7.231H77.186 L77.186,100.626L77.186,100.626z"/>
                </g>
              </svg>
            </button>
            <button
              className={styles.columnHeaderButton}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                   xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15px" height="15px"
                   viewBox="0 0 108.294 122.88" enableBackground="new 0 0 108.294 122.88" xmlSpace="preserve">
                <g>
                  <path
                    d="M4.873,9.058h33.35V6.2V6.187c0-0.095,0.002-0.186,0.014-0.279c0.075-1.592,0.762-3.037,1.816-4.086l-0.007-0.007 c1.104-1.104,2.637-1.79,4.325-1.806l0.023,0.002V0h0.031h19.884h0.016c0.106,0,0.207,0.009,0.309,0.022 c1.583,0.084,3.019,0.76,4.064,1.81c1.102,1.104,1.786,2.635,1.803,4.315l-0.003,0.021h0.014V6.2v2.857h32.909h0.017 c0.138,0,0.268,0.014,0.401,0.034c1.182,0.106,2.254,0.625,3.034,1.41l0.004,0.007l0.005-0.007 c0.851,0.857,1.386,2.048,1.401,3.368l-0.002,0.032h0.014v0.032v10.829c0,1.472-1.195,2.665-2.667,2.665h-0.07H2.667 C1.195,27.426,0,26.233,0,24.762v-0.063V13.933v-0.014c0-0.106,0.004-0.211,0.018-0.315v-0.021 c0.089-1.207,0.624-2.304,1.422-3.098l-0.007-0.002C2.295,9.622,3.49,9.087,4.81,9.069l0.032,0.002V9.058H4.873L4.873,9.058z M77.79,49.097h-5.945v56.093h5.945V49.097L77.79,49.097z M58.46,49.097h-5.948v56.093h5.948V49.097L58.46,49.097z M39.13,49.097 h-5.946v56.093h5.946V49.097L39.13,49.097z M10.837,31.569h87.385l0.279,0.018l0.127,0.007l0.134,0.011h0.009l0.163,0.023 c1.363,0.163,2.638,0.789,3.572,1.708c1.04,1.025,1.705,2.415,1.705,3.964c0,0.098-0.009,0.193-0.019,0.286l-0.002,0.068 l-0.014,0.154l-7.393,79.335l-0.007,0.043h0.007l-0.016,0.139l-0.051,0.283l-0.002,0.005l-0.002,0.018 c-0.055,0.331-0.12,0.646-0.209,0.928l-0.007,0.022l-0.002,0.005l-0.009,0.018l-0.023,0.062l-0.004,0.021 c-0.118,0.354-0.264,0.698-0.432,1.009c-1.009,1.88-2.879,3.187-5.204,3.187H18.13l-0.247-0.014v0.003l-0.011-0.003l-0.032-0.004 c-0.46-0.023-0.889-0.091-1.288-0.202c-0.415-0.116-0.818-0.286-1.197-0.495l-0.009-0.002l-0.002,0.002 c-1.785-0.977-2.975-2.882-3.17-5.022L4.88,37.79l-0.011-0.125l-0.011-0.247l-0.004-0.116H4.849c0-1.553,0.664-2.946,1.707-3.971 c0.976-0.955,2.32-1.599,3.756-1.726l0.122-0.004v-0.007l0.3-0.013l0.104,0.002V31.569L10.837,31.569z M98.223,36.903H10.837 v-0.007l-0.116,0.004c-0.163,0.022-0.322,0.106-0.438,0.222c-0.063,0.063-0.104,0.132-0.104,0.179h-0.007l0.007,0.118l7.282,79.244 h-0.002l0.002,0.012c0.032,0.376,0.202,0.691,0.447,0.825l-0.002,0.004l0.084,0.032l0.063,0.012h0.077h72.695 c0.207,0,0.399-0.157,0.518-0.377l0.084-0.197l0.054-0.216l0.014-0.138h0.005l7.384-79.21L98.881,37.3 c0-0.045-0.041-0.111-0.103-0.172c-0.12-0.118-0.286-0.202-0.451-0.227L98.223,36.903L98.223,36.903z M98.334,36.901h-0.016H98.334 L98.334,36.901z M98.883,37.413v-0.004V37.413L98.883,37.413z M104.18,37.79l-0.002,0.018L104.18,37.79L104.18,37.79z M40.887,14.389H5.332v7.706h97.63v-7.706H67.907h-0.063c-1.472,0-2.664-1.192-2.664-2.664V6.2V6.168h0.007 c-0.007-0.22-0.106-0.433-0.259-0.585c-0.137-0.141-0.324-0.229-0.521-0.252h-0.082h-0.016H44.425h-0.031V5.325 c-0.213,0.007-0.422,0.104-0.576,0.259l-0.004-0.004l-0.007,0.004c-0.131,0.134-0.231,0.313-0.259,0.501l0.007,0.102V6.2v5.524 C43.554,13.196,42.359,14.389,40.887,14.389L40.887,14.389z"/>
                </g>
              </svg>
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
                <Card key={card.id} card={card} index={idx} board_id={board_id} column_id={column.id}/>
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