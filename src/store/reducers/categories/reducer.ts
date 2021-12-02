import {ICategory} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getCategoriesByPage, setCategoriesLoading} from "./actions";

type TState = {
    categories: ICategory[];
    isLoading: boolean;
    page: number;
}

const initialState: TState = {
    categories: [],
    isLoading: false,
    page: 0,
}

export const categoriesReducer = createReducer(initialState, builder => builder
    .addCase(getCategoriesByPage, (state, {payload}) => {
        return {...state, categories: payload};
    })
    .addCase(setCategoriesLoading, (state, { payload }) => {
        return {...state, isLoading: payload};
    })
)