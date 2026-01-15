import React, { Dispatch, SetStateAction } from 'react';
import { Roles } from '../../../../../types/types';
import { FormControlLabel, Grid, Switch } from '@mui/material';
import { EDisplayOnBookingType, TEmployeeForm } from '../types';
import { useStyles } from './styles';

interface AdvisorEmployeeProps {
  form: TEmployeeForm;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  setEmployeeForm: Dispatch<SetStateAction<TEmployeeForm>>;
}

const AdvisorEmployee = ({ form, setFormIsChecked, setEmployeeForm }: AdvisorEmployeeProps) => {
  const { classes } = useStyles();

  const handleSelfServiceChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      displayOnBookingTypes: checked
        ? prev.displayOnBookingTypes
          ? [...prev.displayOnBookingTypes, EDisplayOnBookingType.SelfService]
          : [EDisplayOnBookingType.SelfService]
        : prev.displayOnBookingTypes?.filter(el => el !== EDisplayOnBookingType.SelfService),
    }));
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      displayOnBookingTypes: checked
        ? prev.displayOnBookingTypes
          ? [...prev.displayOnBookingTypes, EDisplayOnBookingType.Employee]
          : [EDisplayOnBookingType.Employee]
        : prev.displayOnBookingTypes?.filter(el => el !== EDisplayOnBookingType.Employee),
    }));
  };

  return (
    <>
      {form.role === Roles.Advisor ? (
        <>
          <Grid item xs={12} sm={6} container>
            <Grid item xs={12}>
              <div className={classes.switchersTitle}>Display On Booking Flow</div>
            </Grid>

            <Grid item xs={6}>
              <FormControlLabel
                className={classes.switcher}
                labelPlacement="start"
                control={
                  <Switch
                    disabled={!form.dmsId}
                    name="selfService"
                    onChange={handleSelfServiceChange}
                    checked={form.displayOnBookingTypes?.includes(
                      EDisplayOnBookingType.SelfService
                    )}
                    color="primary"
                  />
                }
                label={<span>Self Service</span>}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                labelPlacement="start"
                className={classes.switcher}
                control={
                  <Switch
                    disabled={!form.dmsId}
                    name="employee"
                    onChange={handleEmployeeChange}
                    checked={form.displayOnBookingTypes?.includes(EDisplayOnBookingType.Employee)}
                    color="primary"
                  />
                }
                label={<span>Employee</span>}
              />
            </Grid>
          </Grid>
        </>
      ) : null}
    </>
  );
};

export default AdvisorEmployee;
