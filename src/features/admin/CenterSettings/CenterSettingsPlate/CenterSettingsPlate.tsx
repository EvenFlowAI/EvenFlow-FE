import React, { useEffect } from 'react';
import { Button, Grid, Paper, Switch } from '@mui/material';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import { useCenterSettingsStyles } from '../../../../hooks/styling/useCenterSettingsStyles';
import {
  SwitcherLabelWithoutPadding,
  SwitcherWrapperServiceValet,
} from '../../EmployeeTimeScheduleSetUp/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { updateServiceValetSettings } from '../../../../store/reducers/capacityServiceValet/actions';

type TCenterSettingsPlateProps = {
  onEdit: () => void;
  title: string;
  count: number | string;
  prefix?: string;
  suffix?: string;
  label: string;
  helperText: string;
  isLoading: boolean;
};

export const CenterSettingsPlate: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TCenterSettingsPlateProps>>
> = ({ onEdit, title, count, prefix, suffix, label, helperText, isLoading }) => {
  const { classes } = useCenterSettingsStyles();
  const [checked, setChecked] = React.useState(false);
  const { centerSettings } = useSelector((state: RootState) => state.capacityServiceValet);
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();

  useEffect(() => {
    if (centerSettings?.syncAppointmentNativeTime) {
      setChecked(centerSettings?.syncAppointmentNativeTime);
    }
  }, [centerSettings?.syncAppointmentNativeTime]);

  const handleSwitch = (e: React.SyntheticEvent, value: boolean) => {
    if (!selectedSC) return;

    setChecked(value);
    dispatch(updateServiceValetSettings(selectedSC?.id, { syncAppointmentNativeTime: value }));
  };

  return (
    <Grid item xs={6} md={4}>
      <Paper className={classes.paper} variant={'outlined'}>
        <h3 className={classes.title}>{title}</h3>
        <Button className={classes.edit} color="primary" onClick={() => onEdit()}>
          Edit
        </Button>
        {isLoading ? (
          <Loading />
        ) : (
          <div className={classes.value}>
            {prefix}
            {count}
            {suffix}
          </div>
        )}
        {label && <div className={classes.label}>{label}</div>}
        {helperText && <div className={classes.helperText}>{helperText}</div>}
        {title === 'Dms Appointment Time' && (
          <div className={classes.appointmentTime}>
            <span>Appointment time to the DMS</span>
            <SwitcherWrapperServiceValet>
              <SwitcherLabelWithoutPadding>DMS</SwitcherLabelWithoutPadding>
              <Switch onChange={handleSwitch} checked={checked} color="primary" />
              <SwitcherLabelWithoutPadding>EVENFLOW</SwitcherLabelWithoutPadding>
            </SwitcherWrapperServiceValet>
          </div>
        )}
      </Paper>
    </Grid>
  );
};
