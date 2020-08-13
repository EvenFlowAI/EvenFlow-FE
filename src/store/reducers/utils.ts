import {IPagingResponse} from "../../types/types";

export type TChangePagingGeneric<T> = {
    type: T,
    payload: IPagingResponse
}
export const changePagingGeneric = <T>(t: string) => (payload: IPagingResponse): TChangePagingGeneric<typeof t> => ({
    type: t,
    payload
});