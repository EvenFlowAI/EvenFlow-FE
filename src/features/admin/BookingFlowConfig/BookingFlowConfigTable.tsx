import React from 'react';
import { TableCell, TableHead, TableRow } from '@mui/material';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { EServiceType } from '../../../store/reducers/appointmentFrameReducer/types';
import { DenseTable } from '../../../components/styled/DemandTable';
import { TServiceTypeSettings } from '../../../store/reducers/bookingFlowConfig/types';
import { BookingFlowConfigTableBody } from './BookingFlowConfigTableBody';

type TProps = {
  isLoading: boolean;
  tableWrapperClassName: string;
  headerCellClassName: string;
  serviceTypeCellClassName: string;
  visitCenterConfig?: TServiceTypeSettings;
  mobileServiceConfig?: TServiceTypeSettings;
  pickUpDropOffConfig?: TServiceTypeSettings;
  onCheck: (
    serviceType: EServiceType,
    optionType: keyof TServiceTypeSettings
  ) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

export const BookingFlowConfigTable: React.FC<TProps> = ({
  isLoading,
  tableWrapperClassName,
  headerCellClassName,
  serviceTypeCellClassName,
  visitCenterConfig,
  mobileServiceConfig,
  pickUpDropOffConfig,
  onCheck,
}) => {
  return (
    <div className={tableWrapperClassName}>
      {isLoading ? (
        <Loading />
      ) : (
        <DenseTable>
          <TableHead>
            <TableRow>
              <TableCell className={headerCellClassName} width={200} key="1">
                Service Option
              </TableCell>
              <TableCell className={headerCellClassName} align="center" width={200} key="2">
                Visit Center
              </TableCell>
              <TableCell className={headerCellClassName} align="center" width={200} key="3">
                Mobile Service
              </TableCell>
              <TableCell className={headerCellClassName} align="center" width={200} key="4">
                Pick Up / Drop Off
              </TableCell>
            </TableRow>
          </TableHead>
          <BookingFlowConfigTableBody
            serviceTypeCellClassName={serviceTypeCellClassName}
            visitCenterConfig={visitCenterConfig}
            mobileServiceConfig={mobileServiceConfig}
            pickUpDropOffConfig={pickUpDropOffConfig}
            onCheck={onCheck}
          />
        </DenseTable>
      )}
    </div>
  );
};
