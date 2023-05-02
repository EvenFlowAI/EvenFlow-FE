import {ICategory} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {
    getCategoriesByPage,
    getCategoriesByQuery,
    setCategoriesFilter,
    setCategoriesLoading,
    setCategoriesPage
} from "./actions";
import {EServiceType} from "../appointmentFrameReducer/types";

type TState = {
    categories: ICategory[];
    allCategories: ICategory[];
    isLoading: boolean;
    page: number;
    filter: EServiceType;
}

const initialState: TState = {
    categories: [],
    allCategories: [],
    isLoading: false,
    page: 0,
    filter: EServiceType.VisitCenter,
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
    .addCase(setCategoriesFilter, (state, {payload}) => {
        return {...state, filter: payload};
    })
)