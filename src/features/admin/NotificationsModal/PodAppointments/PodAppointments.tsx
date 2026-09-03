import React from 'react';
import { Autocomplete, Button, Divider, IconButton } from '@mui/material';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { DialogActions } from '../../../../components/modals/BaseModal/BaseModal';
import { ReactComponent as PlusIcon } from '../../../../assets/img/plus.svg';
import { ReactComponent as DeleteIcon } from '../../../../assets/img/close.svg';
import { TNotificatonsProps } from '../types';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import { useNotificationStyles } from '../../../../hooks/styling/useNotificationStyles';
import { usePodAppointments } from './usePodAppointments';

const PodAppointments: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TNotificatonsProps>>
> = ({ setChangesState, changesState, onClose }) => {
  const { classes } = useNotificationStyles();
  const state = usePodAppointments({ setChangesState, changesState });
  const isBusy = state.loading || state.isLoading || state.podsLoading;

  return (
    <div>
      <div className={classes.tabWrapper}>
        {isBusy ? (
          <Loading />
        ) : (
          <>
            <div className={classes.tabTitle}>Service Book Appointments</div>
            <Autocomplete
              options={state.shortPodsList}
              fullWidth
              disabled={isBusy}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={item => item.name}
              value={state.selectedPod}
              onChange={state.onPodChange}
              style={{ marginBottom: 24 }}
              renderInput={autocompleteRender({
                label: '',
                placeholder: 'Select Service Book',
              })}
            />
            <div className={classes.selectWrapper}>
              <Autocomplete
                className={classes.autocomplete}
                options={state.usersShort}
                disabled={isBusy}
                fullWidth
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={item => item.fullName}
                value={state.currentEmployee}
                onChange={state.onEmployeeChange}
                renderInput={autocompleteRender({
                  label: 'Assign Employee',
                  placeholder: 'Select',
                  error: Boolean(
                    state.currentEmployee &&
                    !state.currentPodData?.usersList?.includes(state.currentEmployee.id) &&
                    state.formChecked
                  ),
                })}
              />
              <Button
                variant="text"
                startIcon={<PlusIcon />}
                onClick={state.onAddEmployee}
                color="primary"
                disabled={isBusy}
                className={classes.addButton}
              >
                Add
              </Button>
            </div>
            <div>
              {state.selectedEmployees
                .sort((a, b) => a.fullName.localeCompare(b.fullName))
                .map(item => (
                  <div className={classes.employeeWrapper} key={item.id}>
                    <div>{item.fullName}</div>
                    <div>{item.email}</div>
                    <IconButton
                      onClick={() => state.deleteEmployee(item.id)}
                      disabled={isBusy}
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
      <Divider style={{ margin: '24px 0' }} />
      <DialogActions style={{ padding: '0 24px 0 0' }}>
        <Button onClick={onClose} variant="text" color="info" disabled={isBusy}>
          Close
        </Button>
        <Button onClick={state.onCancel} variant="outlined" color="primary" disabled={isBusy}>
          Cancel
        </Button>
        <Button onClick={state.onSave} variant="contained" color="primary" disabled={isBusy}>
          Save
        </Button>
      </DialogActions>
    </div>
  );
};

export default PodAppointments;
