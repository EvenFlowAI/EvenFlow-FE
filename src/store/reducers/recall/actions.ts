import {createAction} from "@reduxjs/toolkit";
import {ICreateUpdateRecall, IRecall} from "./types";
import {AppThunk} from "../../../types/types";

export const getRecalls  = createAction<IRecall[]>('Recall/GetRecalls');

export const loadRecalls = (): AppThunk => dispatch => {
}

export const createRecall = (data: ICreateUpdateRecall, onError: (err: string) => void): AppThunk => dispatch => {
}

export const updateRecall = (data: ICreateUpdateRecall, onError: (err: string) => void): AppThunk => dispatch => {
}

export const deleteRecall = (id: number, onError: (err: string) => void): AppThunk => dispatch => {
}