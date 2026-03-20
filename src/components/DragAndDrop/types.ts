import { Dispatch, SetStateAction } from 'react';
import { TArgCallback } from '../../types/types';

export type TContainerStyle = {
  width?: number | string;
  padding?: number;
  height?: number | string;
  backgroundColor?: string;
  border?: string;
};

export type IData = {
  id: number;
  text: string;
  code?: string;
};

export type IDataCodes = {
  id: number;
  text: string;
  code: string;
};

export type TDnDProps = {
  data: IData[];
  setData: Dispatch<SetStateAction<IData[]>>;
  style?: TContainerStyle;
  isEditing: boolean;
  currentMakeName?: string;
};

export interface CardProps {
  id: number;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  backGroundColor?: string;
  onDelete?: TArgCallback<number>;
}

export interface DragItem {
  index: number;
  id: string;
  type: string;
}
