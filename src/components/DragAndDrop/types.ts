import { Dispatch, SetStateAction } from 'react';
import { TArgCallback } from '../../types/types';
import { IGlobalMake } from '../../store/reducers/globalVehicles/types';

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
};

export type TDnDProps = {
  data: IData[];
  setData: Dispatch<SetStateAction<IData[]>>;
  style?: TContainerStyle;
  isEditing: boolean;
  currentMakeName?: string;
};

export interface CardProps {
  id: any;
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
