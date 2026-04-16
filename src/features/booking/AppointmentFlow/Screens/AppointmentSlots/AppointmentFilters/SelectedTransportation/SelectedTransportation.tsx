import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { setTransportation } from '../../../../../../../store/reducers/appointmentFrameReducer/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import clsx from 'clsx';
import { useStyles } from '../ServiceOption/styles';
import { ETransportationType } from '../../../../../../../store/reducers/transportationNeeds/types';
import { EServiceType } from '../../../../../../../store/reducers/appointmentFrameReducer/types';
import { IFirstScreenOption } from '../../../../../../../store/reducers/serviceTypes/types';
import { TCallback } from '../../../../../../../types/types';
import { ITransportation } from '../../../../../../../api/types';

type TProps = {
  isVisible: boolean;
  setSelectedOption: Dispatch<SetStateAction<IFirstScreenOption | null>>;
  onSwitchFlowOpen: TCallback;
};

const SelectedTransportation: React.FC<TProps> = ({
  isVisible,
  setSelectedOption,
  onSwitchFlowOpen,
}) => {
  const { transportation, transportations, isTransportationsLoading, serviceTypeOption } =
    useSelector((state: RootState) => state.appointmentFrame);
  const { isTransportationAvailable, config } = useSelector(
    (state: RootState) => state.bookingFlowConfig
  );
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
  const { isAppointmentSlotsLoading } = useSelector((state: RootState) => state.appointment);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('mdl'));
  const value = useMemo(() => {
    // Prioritize transportation from serviceTypeOption (as default transportation) if available
    if (serviceTypeOption?.transportationOption) {
      return serviceTypeOption.transportationOption.id;
    }

    // Otherwise, use transportation from appointmentFrame (if available)
    if (transportation?.id) {
      return transportation.id;
    }

    return '';
  }, [transportation, serviceTypeOption]);

  const switchToServiceValet = (selected: ITransportation) => {
    const serviceValetOption = firstScreenOptions.find(
      el => el.type === EServiceType.PickUpDropOff
    );
    if (serviceValetOption) {
      setSelectedOption(serviceValetOption);
      onSwitchFlowOpen();
    } else {
      dispatch(setTransportation(selected ?? null));
    }
  };

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const selected = transportations.find(item => item.id === e.target.value);
    if (selected?.type === ETransportationType.PickUpDelivery) {
      switchToServiceValet(selected);
    } else {
      dispatch(setTransportation(selected ?? null));
    }
  };

  const filteredTransportation = transportations.filter(item => {
    if (item.type === ETransportationType.PickUpDelivery) {
      return config.find(c => c.serviceType === EServiceType.PickUpDropOff)?.available;
    }
    return true;
  });

  return isVisible ? (
    <div style={isSm ? { marginBottom: 4 } : {}}>
      <div>
        <div className={clsx('uppercase', classes.label)}>{t('Transportation')}</div>
        <Select
          value={value}
          className={classes.select}
          variant="standard"
          disableUnderline
          fullWidth={isSm}
          disabled={
            !isTransportationAvailable || isTransportationsLoading || isAppointmentSlotsLoading
          }
          onChange={handleChange}
        >
          `
          {filteredTransportation.map(item => (
            <MenuItem value={item.id} key={item.name}>
              {item.description}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  ) : null;
};

export default SelectedTransportation;
