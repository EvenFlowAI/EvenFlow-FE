import React from 'react';
import Checkbox from '../../../../../components/formControls/Checkbox/Checkbox';
import { IAssignedServiceRequest } from '../../../../../store/reducers/serviceRequests/types';
import { DescriptionWithTooltip } from './DescriptionWithTooltip';

type TAvailableOpCodeRowProps = {
  item: IAssignedServiceRequest;
  description: string;
  price: number;
  disabled: boolean;
  checked: boolean;
  rowClassName: string;
  codeClassName: string;
  descriptionClassName: string;
  priceClassName: string;
  onToggle: (id: number) => void;
};

export const AvailableOpCodeRow: React.FC<TAvailableOpCodeRowProps> = ({
  item,
  description,
  price,
  disabled,
  checked,
  rowClassName,
  codeClassName,
  descriptionClassName,
  priceClassName,
  onToggle,
}) => (
  <div className={rowClassName}>
    <Checkbox
      color="primary"
      disabled={disabled}
      checked={checked}
      onChange={() => onToggle(item.id)}
    />
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={codeClassName}>{item.serviceRequest.code}</div>
      <DescriptionWithTooltip text={description} className={descriptionClassName} />
    </div>
    <div className={priceClassName}>${price.toFixed(2)}</div>
  </div>
);
