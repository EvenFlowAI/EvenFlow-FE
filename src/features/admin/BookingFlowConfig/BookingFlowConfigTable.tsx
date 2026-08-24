import React from 'react';
import { Switch, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { EServiceType } from '../../../store/reducers/appointmentFrameReducer/types';
import { DenseTable } from '../../../components/styled/DemandTable';
import { TServiceTypeSettings } from '../../../store/reducers/bookingFlowConfig/types';

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
          <TableBody>
            <TableRow>
              <TableCell className={serviceTypeCellClassName}>Available</TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.VisitCenter, 'available')}
                  disabled={true}
                  checked
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.MobileService, 'available')}
                  checked={Boolean(mobileServiceConfig?.available)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.PickUpDropOff, 'available')}
                  checked={Boolean(pickUpDropOffConfig?.available)}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={serviceTypeCellClassName}>Value Service</TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.VisitCenter, 'valueService')}
                  checked={Boolean(visitCenterConfig?.valueService)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.MobileService, 'valueService')}
                  disabled={!mobileServiceConfig?.available}
                  checked={Boolean(mobileServiceConfig?.valueService)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.PickUpDropOff, 'valueService')}
                  disabled={!pickUpDropOffConfig?.available}
                  checked={Boolean(pickUpDropOffConfig?.valueService)}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={serviceTypeCellClassName}>
                Product Page for Value Service
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.VisitCenter, 'productPageForValueService')}
                  disabled={!visitCenterConfig?.valueService}
                  checked={Boolean(visitCenterConfig?.productPageForValueService)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.MobileService, 'productPageForValueService')}
                  disabled={!mobileServiceConfig?.valueService || !mobileServiceConfig?.available}
                  checked={Boolean(mobileServiceConfig?.productPageForValueService)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.PickUpDropOff, 'productPageForValueService')}
                  disabled={!pickUpDropOffConfig?.valueService || !pickUpDropOffConfig?.available}
                  checked={Boolean(pickUpDropOffConfig?.productPageForValueService)}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={serviceTypeCellClassName}>Advisor Selection</TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.VisitCenter, 'advisorSelection')}
                  checked={Boolean(visitCenterConfig?.advisorSelection)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.MobileService, 'advisorSelection')}
                  checked={Boolean(mobileServiceConfig?.advisorSelection)}
                  disabled={true}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.PickUpDropOff, 'advisorSelection')}
                  disabled={!pickUpDropOffConfig?.available}
                  checked={Boolean(pickUpDropOffConfig?.advisorSelection)}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={serviceTypeCellClassName}>Engine Type</TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.VisitCenter, 'engineType')}
                  checked={Boolean(visitCenterConfig?.engineType)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  disabled={!mobileServiceConfig?.available}
                  onChange={onCheck(EServiceType.MobileService, 'engineType')}
                  checked={Boolean(mobileServiceConfig?.engineType)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.PickUpDropOff, 'engineType')}
                  disabled={!pickUpDropOffConfig?.available}
                  checked={Boolean(pickUpDropOffConfig?.engineType)}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={serviceTypeCellClassName}>Appointment Selection</TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.VisitCenter, 'appointmentSelection')}
                  checked={Boolean(visitCenterConfig?.appointmentSelection)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  disabled={!mobileServiceConfig?.available}
                  onChange={onCheck(EServiceType.MobileService, 'appointmentSelection')}
                  checked={Boolean(mobileServiceConfig?.appointmentSelection)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.PickUpDropOff, 'appointmentSelection')}
                  checked={Boolean(pickUpDropOffConfig?.appointmentSelection)}
                  disabled={!pickUpDropOffConfig?.available}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={serviceTypeCellClassName}>Transportation Needs</TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.VisitCenter, 'transportationNeeds')}
                  checked={Boolean(visitCenterConfig?.transportationNeeds)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  disabled
                  onChange={onCheck(EServiceType.MobileService, 'transportationNeeds')}
                  checked={Boolean(mobileServiceConfig?.transportationNeeds)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  onChange={onCheck(EServiceType.PickUpDropOff, 'transportationNeeds')}
                  checked={Boolean(pickUpDropOffConfig?.transportationNeeds)}
                  disabled
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={serviceTypeCellClassName}>
                Check Open Recalls Existing Customers
              </TableCell>
              <TableCell align="center">
                <Switch
                  disabled={!visitCenterConfig?.available}
                  onChange={onCheck(EServiceType.VisitCenter, 'checkRecallsExisting')}
                  checked={Boolean(visitCenterConfig?.checkRecallsExisting)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  disabled={!mobileServiceConfig?.available}
                  onChange={onCheck(EServiceType.MobileService, 'checkRecallsExisting')}
                  checked={Boolean(mobileServiceConfig?.checkRecallsExisting)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  disabled={!pickUpDropOffConfig?.available}
                  onChange={onCheck(EServiceType.PickUpDropOff, 'checkRecallsExisting')}
                  checked={Boolean(pickUpDropOffConfig?.checkRecallsExisting)}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={serviceTypeCellClassName}>
                Check Open Recalls New Customers
              </TableCell>
              <TableCell align="center">
                <Switch
                  disabled={!visitCenterConfig?.available}
                  onChange={onCheck(EServiceType.VisitCenter, 'checkRecallsNew')}
                  checked={Boolean(visitCenterConfig?.checkRecallsNew)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  disabled={!mobileServiceConfig?.available}
                  onChange={onCheck(EServiceType.MobileService, 'checkRecallsNew')}
                  checked={Boolean(mobileServiceConfig?.checkRecallsNew)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <Switch
                  disabled={!pickUpDropOffConfig?.available}
                  onChange={onCheck(EServiceType.PickUpDropOff, 'checkRecallsNew')}
                  checked={Boolean(pickUpDropOffConfig?.checkRecallsNew)}
                  color="primary"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </DenseTable>
      )}
    </div>
  );
};
