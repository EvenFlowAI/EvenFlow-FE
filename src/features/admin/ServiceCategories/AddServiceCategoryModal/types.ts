export interface IIconState {
    file: File | null;
    dataUrl?: string;
}

export type TOption = {
    value: number;
    name: string;
}

export enum EOrderError {
    MissingNumber,
    SameNumber,
}