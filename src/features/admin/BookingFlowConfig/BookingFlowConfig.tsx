import React, { useEffect, useMemo, useState } from 'react';
import { SquarePaper } from '../../../components/styled/Paper';
import { TableContainer } from '../../../pages/admin/ServicePricingSettings/UI';
import { Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { TServiceTypeSettings } from '../../../store/reducers/bookingFlowConfig/types';
import { RootState } from '../../../store/rootReducer';
import {
  loadBookingFlowConfig,
  updateBookingFlowConfig,
} from '../../../store/reducers/bookingFlowConfig/actions';
import { EServiceType } from '../../../store/reducers/appointmentFrameReducer/types';
import { useStyles } from './styles';
import { LoadingButton } from '../../../components/buttons/LoadingButton/LoadingButton';

import { useMessage } from '../../../hooks/useMessage/useMessage';
import { useException } from '../../../hooks/useException/useException';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { loadTransportationOptions } from '../../../store/reducers/transportationNeeds/actions';
import { BookingFlowConfigTable } from './BookingFlowConfigTable';

export const BookingFlowConfig = () => {
  const { config, isLoading } = useSelector((state: RootState) => state.bookingFlowConfig);
  const [configuration, setConfiguration] = useState<TServiceTypeSettings[]>([]);
  const { selectedSC } = useSCs();
  const showError = useException();
  const showMessage = useMessage();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const visitCenterConfig = useMemo(
    () => configuration.find(item => item.serviceType === EServiceType.VisitCenter),
    [configuration]
  );
  const mobileServiceConfig = useMemo(
    () => configuration.find(item => item.serviceType === EServiceType.MobileService),
    [configuration]
  );
  const pickUpDropOffConfig = useMemo(
    () => configuration.find(item => item.serviceType === EServiceType.PickUpDropOff),
    [configuration]
  );

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadBookingFlowConfig(selectedSC.id));
      dispatch(loadTransportationOptions(selectedSC.id));
    }
  }, [dispatch, selectedSC]);

  useEffect(() => {
    setConfiguration(config);
  }, [config]);

  const isValid = (optionType: keyof TServiceTypeSettings): boolean => {
    if (
      (optionType === 'checkRecallsExisting' || optionType === 'checkRecallsNew') &&
      !selectedSC?.recallServiceRequestId
    ) {
      showError('To enable Checking Recalls you need to select Default Recall Op Code');
      return false;
    }

    return true;
  };

  const onCheck =
    (serviceType: EServiceType, optionType: keyof TServiceTypeSettings) =>
    (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (isValid(optionType)) {
        let analogServiceType: TServiceTypeSettings | undefined = undefined;
        const currentServiceType = configuration.find(item => item.serviceType === serviceType);

        if (currentServiceType) {
          const updated = { ...currentServiceType, [optionType]: checked };
          if (optionType === 'valueService' && !checked) {
            updated.productPageForValueService = false;
          }
          setConfiguration(prev => {
            const filtered = prev.filter(el => el.serviceType !== serviceType);
            return [...filtered, updated];
          });
          if (optionType === 'valueService' || optionType === 'productPageForValueService') {
            if (currentServiceType?.serviceType === EServiceType.VisitCenter) {
              analogServiceType = configuration.find(
                item => item.serviceType === EServiceType.PickUpDropOff
              );
            } else if (currentServiceType.serviceType === EServiceType.PickUpDropOff) {
              analogServiceType = configuration.find(
                item => item.serviceType === EServiceType.VisitCenter
              );
            }
            if (analogServiceType) {
              const updatedAnalog = { ...analogServiceType, [optionType]: checked };
              setConfiguration(prev => {
                const filtered = prev.filter(
                  el => el.serviceType !== analogServiceType?.serviceType
                );
                return [...filtered, updatedAnalog];
              });
            }
          }
        }
      }
    };

  const onCancel = () => {
    setConfiguration(config);
  };

  const onSuccess = () => showMessage('Booking Flow Configuration updated');

  const onError = (err: string) => showError(err);

  const onSave = () => {
    if (selectedSC) {
      dispatch(updateBookingFlowConfig(selectedSC.id, configuration, onSuccess, onError));
    }
  };

  return (
    <SquarePaper variant="outlined">
      <TableContainer>
        <BookingFlowConfigTable
          isLoading={isLoading}
          tableWrapperClassName={classes.tableWrapper}
          headerCellClassName={classes.headerCell}
          serviceTypeCellClassName={classes.serviceTypeCell}
          visitCenterConfig={visitCenterConfig}
          mobileServiceConfig={mobileServiceConfig}
          pickUpDropOffConfig={pickUpDropOffConfig}
          onCheck={onCheck}
        />
        <Box mt={2}>
          <div className={classes.wrapper}>
            <div className={classes.buttonsWrapper}>
              <Button onClick={onCancel} className={classes.cancelButton}>
                Cancel
              </Button>
              <LoadingButton loading={isLoading} onClick={onSave} className={classes.saveButton}>
                Save
              </LoadingButton>
            </div>
          </div>
        </Box>
      </TableContainer>
    </SquarePaper>
  );
};
