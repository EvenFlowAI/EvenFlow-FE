import React from 'react';
import { IEmployeeAssignmentSetting } from '../../../../../store/reducers/employees/types';
import { ServiceBook } from '../styles';
import { IconButton } from '@mui/material';
import { ReactComponent as ArrowDown } from '../../../../../assets/img/dropdown_closed.svg';
import { TEmployeeAssignmentMobileProps } from '../../types';
import { ServiceBookRowMobileDetails } from './ServiceBookRowMobileDetails';

type TProps = TEmployeeAssignmentMobileProps & {
  item: IEmployeeAssignmentSetting;
  idx: number;
};

const isSameServiceBook = (
  target: IEmployeeAssignmentSetting,
  compared: IEmployeeAssignmentSetting
): boolean => {
  if (target.serviceBookId) {
    return target.serviceBookId === compared.serviceBookId;
  }

  return target.serviceBookName === compared.serviceBookName;
};

const getNextExpandedItem = (
  target: IEmployeeAssignmentSetting,
  expandedItem: IEmployeeAssignmentSetting | null
): IEmployeeAssignmentSetting | null => {
  if (!expandedItem) {
    return target;
  }

  return isSameServiceBook(target, expandedItem) ? null : target;
};

const getServiceBookRowStyle = (isLastRow: boolean, isOpened: boolean) => {
  return isLastRow && !isOpened ? { borderBottomWidth: 1 } : {};
};

const getArrowStyle = (isOpened: boolean) => {
  return isOpened
    ? { transform: 'rotate(180deg)', transition: '0.6s ease' }
    : { transform: 'rotate(360deg)', transition: '0.6s ease' };
};

const ServiceBookRowMobile: React.FC<TProps> = ({
  item,
  idx,
  data,
  expandedItem,
  setExpandedItem,
  onMethodChange,
}) => {
  const isOpened = expandedItem ? isSameServiceBook(item, expandedItem) : false;
  const isLastRow = idx === data.length - 1;

  const onOpenRow = (target: IEmployeeAssignmentSetting) => () => {
    setExpandedItem(getNextExpandedItem(target, expandedItem));
  };

  return (
    <>
      <ServiceBook item xs={12} mdl={4} style={getServiceBookRowStyle(isLastRow, isOpened)}>
        <div>{item.serviceBookName}</div>
        <div>
          <IconButton style={{ padding: 0 }} onClick={onOpenRow(item)}>
            <ArrowDown style={getArrowStyle(isOpened)} />
          </IconButton>
        </div>
      </ServiceBook>
      {isOpened ? (
        <ServiceBookRowMobileDetails
          item={item}
          idx={idx}
          data={data}
          onMethodChange={onMethodChange}
        />
      ) : null}
    </>
  );
};

export default ServiceBookRowMobile;
