import {IPageRequest, IPagingResponse} from "../../types/types";
import {TChangePageDataGeneric, TChangePagingGeneric} from "./types";

export const changePagingGeneric =
    <T>(t: string) => (payload: IPagingResponse): TChangePagingGeneric<typeof t> => ({
    type: t, payload
});

export const changePageDataGeneric =
    <T>(t: string) => (payload: Partial<IPageRequest>): TChangePageDataGeneric<typeof t> => ({
    type: t, payload
});

