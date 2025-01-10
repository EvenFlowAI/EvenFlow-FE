import { IPageRequest, IPagingResponse } from "../../types/types";

export type TChangePagingGeneric<T> = {
  type: T;
  payload: IPagingResponse;
};
export type TChangePageDataGeneric<T> = {
  type: T;
  payload: Partial<IPageRequest>;
};
export type TEnumMap<U> = {
  label: string;
  id: U;
};
export type TEnumKeyLabel<U extends string | number> = {
  [k in U]: string;
};
export type TEnumValueMap<U extends string | number | symbol, V> = {
  [k in U]: V;
};
