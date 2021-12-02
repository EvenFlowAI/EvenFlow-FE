import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {ICategory, TNewCategory, TUpdateCategoryData} from "./types";

export const setCategoriesPage = createAction<number>("Categories/SetPage");
export const setCategoriesLoading = createAction<boolean>("Categories/SetLoading");
export const getCategoriesByPage = createAction<ICategory[]>("Categories/GetCategoriesByPage");

export const loadCategoriesByPage = (): AppThunk => (dispatch, getState) => {
    dispatch(setCategoriesLoading(true));
    const { page } = getState().categories;
    const { selectedSC } = getState().serviceCenters;

    if (selectedSC) {
        Api.call(Api.endpoints.ServiceCategories.GetByPage, {data: {serviceCenterId:  selectedSC.id, page}})
            .then(result => {
                if (result) {
                    console.log(result);
                    dispatch(getCategoriesByPage(result.data))
                }
            })
            .catch(err => {
                console.log('get categories by page error', err)
            })
            .finally(() => {
                dispatch(setCategoriesLoading(false));
            })
    }
}

export const deleteCategoryById = (id: number): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceCategories.Remove, {urlParams: {id}})
        .then(result => {
            if (result) {
                dispatch(loadCategoriesByPage())
            }
        })
        .catch(err => {
            console.log('delete category error', err)
        })
}

export const updateCategory = (id: number, data: TUpdateCategoryData): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceCategories.Update, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadCategoriesByPage())
            }
        })
        .catch(err => {
            console.log('update category error', err)
        })
}

export const createCategory = (data: TNewCategory): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceCategories.Create, {data})
        .then(result => {
            if (result) {
                dispatch(loadCategoriesByPage())
            }
        })
        .catch(err => {
            console.log('create category error', err)
        })
}

export const updateCategoryIcon = (id: number, file: File): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceCategories.UpdateIcon, {urlParams: {id}, data: file})
        .then(result => {
            if (result) {
                dispatch(loadCategoriesByPage())
            }
        })
        .catch(err => {
            console.log('update category icon error', err)
        })
}