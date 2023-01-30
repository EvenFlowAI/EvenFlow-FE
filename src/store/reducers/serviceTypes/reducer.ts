import {IFirstScreenOption} from "./types";
import {createReducer} from "@reduxjs/toolkit";
import {getFirstScreenOptionsByQuery, setFirstScreenOptionsLoading} from "./actions";
import {EServiceType} from "../appointmentFrameReducer/types";

const mockServiceTypes = [
    {
        id: 1,
        name: 'Visit Center',
        type: EServiceType.VisitCenter,
        orderIndex: 1,
        description: 'Description',
        iconPath: 'fgsdfhfgj',
    },
    {
        id: 2,
        name: 'Mobile Service',
        type: EServiceType.MobileService,
        orderIndex: 2,
        description: 'Description',
    }
]

type TState = {
    firstScreenOptions: IFirstScreenOption[];
    isLoading: boolean;
}

const initialState: TState = {
    firstScreenOptions: mockServiceTypes,
    isLoading: false,
}

export const firstScreenOptionsReducer = createReducer(initialState, builder => builder
    .addCase(setFirstScreenOptionsLoading, (state, { payload }) => {
        return {...state, isLoading: payload};
    })
    .addCase(getFirstScreenOptionsByQuery, (state, {payload}) => {
        return {...state, firstScreenOptions: payload};
    })
)