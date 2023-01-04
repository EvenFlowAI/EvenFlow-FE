import {createReducer} from "@reduxjs/toolkit";
import {IRecall} from "./types";
import {getRecalls, getRecallsByVin, setLoading, setRecallPageData, setRecallsCount} from "./actions";
import {IPageRequest} from "../../../types/types";
import {IRecallByVin} from "../../../components/AppointmentFlow/AppointmentFrame/types";

type TState = {
    recalls: IRecall[];
    isLoading: boolean;
    recallPageData: IPageRequest;
    recallsCount: number,
    recallsByVin: IRecallByVin[];
}
const initialState: TState = {
    recalls: [],
    isLoading: false,
    recallsCount: 0,
    recallPageData: {
        pageIndex: 0,
        pageSize: 10,
    },
    recallsByVin: [],
}

export const recallsReducer = createReducer(initialState, builder => builder
    .addCase(getRecalls, (state, {payload}) => {
        return {...state, recalls: payload};
    })
    .addCase(setRecallsCount, (state, {payload}) => {
        return {...state, recallsCount: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(setRecallPageData, (state, {payload}) => {
        return {...state, recallPageData: {...state.recallPageData, ...payload}};
    })
    .addCase(getRecallsByVin, (state, {payload}) => {
        return {...state, recallsByVin: payload};
    })
)