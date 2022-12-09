import {createAction} from "@reduxjs/toolkit";
import {IRecall} from "./types";
import {AppThunk} from "../../../types/types";

export const getRecalls  = createAction<IRecall[]>('Recall/GetRecalls');

export const loadRecalls = (): AppThunk => dispatch => {
}