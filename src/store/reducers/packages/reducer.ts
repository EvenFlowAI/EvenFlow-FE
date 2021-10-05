import {IPackageById, IPackageByQuery} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {getPackageById, getPackagesByQuery, setPackageLoading} from "./actions";

type TState = {
    currentPackage: IPackageById | null;
    isPackageLoading: boolean;
    packages: IPackageByQuery[] | [];
}

const initialState: TState = {
    currentPackage: null,
    isPackageLoading: false,
    packages: [],
}

export const packagesReducer = createReducer(initialState, builder => builder
    .addCase(getPackageById, (state, { payload }) => {
        return { ...state, currentPackage: payload}
    })
    .addCase(setPackageLoading, (state, { payload }) => {
        return { ...state, isPackageLoading: payload}
    })
    .addCase(getPackagesByQuery, (state, { payload }) => {
        return { ...state, packages: payload}
    })
);