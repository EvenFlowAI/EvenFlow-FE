import {IMake, IPackageById, IPackageByQuery} from "../../../api/types";
import {createReducer} from "@reduxjs/toolkit";
import {getMakes, getPackageById, getPackagesByQuery, setPackageLoading} from "./actions";

type TState = {
    currentPackage: IPackageById | null;
    isPackageLoading: boolean;
    packages: IPackageByQuery[] | [];
    makes: IMake[];
}

const initialState: TState = {
    currentPackage: null,
    isPackageLoading: false,
    packages: [],
    makes: [],
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
    .addCase(getMakes, (state, { payload }) => {
        return { ...state, makes: payload}
    })
);