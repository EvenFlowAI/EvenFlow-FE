import {IPageRequest, IPagingResponse} from "../../types/types";

export type TChangePagingGeneric<T> = {
    type: T,
    payload: IPagingResponse
}
export const changePagingGeneric =
    <T>(t: string) => (payload: IPagingResponse): TChangePagingGeneric<typeof t> => ({
    type: t, payload
});

export type TChangePageDataGeneric<T> = {
    type: T,
    payload: Partial<IPageRequest>
};
export const changePageDataGeneric =
    <T>(t: string) => (payload: Partial<IPageRequest>): TChangePageDataGeneric<typeof t> => ({
    type: t, payload
});