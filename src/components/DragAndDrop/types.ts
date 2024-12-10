import {Dispatch, SetStateAction} from "react";
import {TArgCallback} from "../../types/types";

export type TItem = {
    id: number
    text: string
}

export type TContainerStyle = {
    width?: number|string;
    padding?: number;
    height?: number|string;
    backgroundColor?: string;
    border?: string;
}

export type TDnDProps = {
    data: TItem[];
    setData: Dispatch<SetStateAction<TItem[]>>;
    style?: TContainerStyle;
}

export interface CardProps {
    id: any
    text: string
    index: number
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    backGroundColor?: string;
    onDelete?: TArgCallback<number>;
}

export interface DragItem {
    index: number
    id: string
    type: string
}