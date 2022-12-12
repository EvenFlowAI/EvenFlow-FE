import {createReducer} from "@reduxjs/toolkit";
import {IRecall} from "./types";
import {getRecalls, setLoading, setRecallPageData} from "./actions";
import {IPageRequest} from "../../../types/types";

type TState = {
    recalls: IRecall[];
    isLoading: boolean;
    recallPageData: IPageRequest;
    recallsCount: number,
}
const initialState: TState = {
    recalls: [],
    isLoading: false,
    recallsCount: 0,
    recallPageData: {
        pageIndex: 0,
        pageSize: 10,
    }
}

export const recallsReducer = createReducer(initialState, builder => builder
    .addCase(getRecalls, (state, {payload}) => {
        return {...state, recalls: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(setRecallPageData, (state, {payload}) => {
        return {...state, recallPageData: {...state.recallPageData, ...payload}};
    })
)