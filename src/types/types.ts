import {ThunkAction} from "redux-thunk";
import {RootState} from "../store/rootReducer";
import {Action} from "redux";
import {TRole} from "../store/reducers/users/types";
import React from "react";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@material-ui/lab";

import {TextInputProps} from "../components/FormControls/types";

export type LinkType = {
    to: string;
    name: string;
    roles: TRole[]|boolean;
    exact?: boolean;
    sub?: boolean;
}

export type LinkTypeWithSub = {
    to: string;
    name: string;
    roles: TRole[]|boolean;
    exact?: boolean;
    subLinks?: LinkType[];
    sub?: boolean;
}

export type ValidationKeyPairs<U> = {
    field: keyof U;
    message: string;
}

export interface ITokens {
    accessToken: string;
    refreshToken: string;
}

export interface IRefreshTokenData {
    token: string;
}

export interface ICredentials {
    email: string;
    password: string;
}

export enum LocalTokens {
    authToken = 'at',
    refreshToken = 'rt',
    suToken = 'st',
    sessionId = 'sessionId',
}

export interface ITimeSpan {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMinutes: number;
    totalSeconds: number;
}

export interface IPagingResponse {
    numberOfPages: number;
    numberOfRecords: number;
}

export interface IPageRequest {
    pageIndex: number;
    pageSize: number;
}

export interface PaginatedAPIResponse<T> {
    result: T[];
    paging: IPagingResponse;
}

export interface IAPIResponse<T> {
    result: T;
}

export type TTechnicianLevel = 1 | 2 | 3;

export type AppThunk<ReturnType=void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export interface IOrder<D={}> {
    orderBy?: keyof D | string,
    isAscending: boolean
}
export type TOption = {
    name: string;
    value: string;
}
export type TCallback = () => void;
export type TArgCallback<T> = (arg: T) => void;

export type TSelectChange = (
    e: React.ChangeEvent<{}>,
    value: string | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string> | undefined
) => void;

export type TView = "select" | "search" | "confirm" | "serviceSelect" | "serviceCenterSelect";

export type TSwitchButton<U> = { label: string; type: U };

export type TSwitchButtonsProps<U = string> = {
    onClick: (s: U) => () => void,
    active: U,
    buttons: TSwitchButton<U>[]
}

export type TTitle = {
    title: string;
    to: string;
    parent?: TTitle;
}

export type TSearchInputProps = TextInputProps & {
    onSearch: () => void;
    delay?: number;
    value?: string;
    placeholder?: string;
};