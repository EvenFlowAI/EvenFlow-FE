import React from 'react';
import { IconButton } from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { IAssignedServiceRequest } from '../../../../../store/reducers/serviceRequests/types';
import { DescriptionWithTooltip } from './DescriptionWithTooltip';
import { ReactComponent as TrashBlue } from '../../../../../assets/img/trash_blue.svg';

type TSelectedOpCodeContentProps = {
  item: IAssignedServiceRequest;
  description: string;
  price: number;
  disabled: boolean;
  codeStackClassName: string;
  codeClassName: string;
  descriptionClassName: string;
  priceClassName: string;
  orderIndexClassName: string;
  dragHandleClassName: string;
  showDragHandle?: boolean;
  orderIndex?: number;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  onDelete: (id: number) => void;
};

export const SelectedOpCodeContent: React.FC<TSelectedOpCodeContentProps> = ({
  item,
  description,
  price,
  disabled,
  codeStackClassName,
  codeClassName,
  descriptionClassName,
  priceClassName,
  orderIndexClassName,
  dragHandleClassName,
  showDragHandle = false,
  orderIndex,
  dragHandleProps,
  onDelete,
}) => (
  <>
    {showDragHandle && (
      <span style={{ display: 'flex' }} {...(dragHandleProps ?? undefined)}>
        <DragIndicator className={dragHandleClassName} />
      </span>
    )}
    {showDragHandle && <span className={orderIndexClassName}>{orderIndex}</span>}
    <div className={codeStackClassName}>
      <span className={codeClassName}>{item.serviceRequest.code}</span>
      <DescriptionWithTooltip text={description} className={descriptionClassName} />
    </div>
    <span className={priceClassName}>${price.toFixed(2)}</span>
    <IconButton size="small" color="error" disabled={disabled} onClick={() => onDelete(item.id)}>
      <TrashBlue width={16} height={20} />
    </IconButton>
  </>
);
