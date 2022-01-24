import { ActionType } from "../action-types";
import { CellTypes } from "../cell";

export type Directions = "up" | "down";

//interfaces for actions
export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Directions;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string; //just id needed
}

export interface InsertCellBeforeAction {
  type: ActionType.INSERT_CELL_BEFORE;
  payload: {
    id: string;
    type: CellTypes; //which type of cell to insert before
  };
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
}

//union of all actions
export type Action =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellBeforeAction
  | UpdateCellAction;
