import React, { Dispatch, SetStateAction } from 'react';
import { FormControlLabel, Grid, Switch } from '@mui/material';
import { TUserAccountForm } from '../types';
import { EDisplayOnBookingType } from '../../CreateEmployee/types';
import { Roles, TOptionForUserAccountServiceCenters } from '../../../../../types/types';
import { useStyles } from '../../CreateEmployee/CreateEmployeeForm/styles';

interface AdvisorEmployeeProps {
  sc: TOptionForUserAccountServiceCenters;
  form: TUserAccountForm;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  setEmployeeForm: Dispatch<SetStateAction<TUserAccountForm>>;
}

const AdvisorEmployee = ({ sc, form, setFormIsChecked, setEmployeeForm }: AdvisorEmployeeProps) => {
  const { classes } = useStyles();

  const handleSelfServiceChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      serviceCenters: prev.serviceCenters.map(el =>
        el.value === sc.value
          ? {
              ...el,
              displayOnBookingTypes: checked
                ? el.displayOnBookingTypes
                  ? [...el.displayOnBookingTypes, EDisplayOnBookingType.SelfService]
                  : [EDisplayOnBookingType.SelfService]
                : el.displayOnBookingTypes?.filter(
                    value => value !== EDisplayOnBookingType.SelfService
                  ),
            }
          : el
      ),
    }));
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      serviceCenters: prev.serviceCenters.map(el =>
        el.value === sc.value
          ? {
              ...el,
              displayOnBookingTypes: checked
                ? el.displayOnBookingTypes
                  ? [...el.displayOnBookingTypes, EDisplayOnBookingType.Employee]
                  : [EDisplayOnBookingType.Employee]
                : el.displayOnBookingTypes?.filter(
                    value => value !== EDisplayOnBookingType.Employee
                  ),
            }
          : el
      ),
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
                    disabled={!sc.dmsId}
                    name="selfService"
                    onChange={handleSelfServiceChange}
                    checked={sc.displayOnBookingTypes?.includes(EDisplayOnBookingType.SelfService)}
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
                    disabled={!sc.dmsId}
                    name="employee"
                    onChange={handleEmployeeChange}
                    checked={sc.displayOnBookingTypes?.includes(EDisplayOnBookingType.Employee)}
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
