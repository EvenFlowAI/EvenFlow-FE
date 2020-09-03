import {ThunkAction} from "redux-thunk";
import {RootState} from "../store/rootReducer";
import {Action} from "redux";

export type LinkType = {
    to: string;
    name: string;
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
    refreshToken = 'rt'
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

export type TTechnicianLevel = 1 | 2 | 3;

export type AppThunk<ReturnType=void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
