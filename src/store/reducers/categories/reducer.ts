import {ICategory} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {
    getCategoriesByPage,
    getCategoriesByQuery,
    setCategoriesLoading,
    setCategoriesPage
} from "./actions";

type TState = {
    categories: ICategory[];
    allCategories: ICategory[];
    isLoading: boolean;
    page: number;
}

const initialState: TState = {
    categories: [],
    allCategories: [],
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
    .addCase(setCategoriesPage, (state, {payload}) => {
        return {...state, page: payload};
    })
    .addCase(getCategoriesByQuery, (state, {payload}) => {
        return {...state, allCategories: payload};
    })
)