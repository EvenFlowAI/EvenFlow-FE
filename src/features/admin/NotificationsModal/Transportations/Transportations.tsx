import React from 'react';
import { Autocomplete, Button, Divider, Switch } from '@mui/material';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { DialogActions } from '../../../../components/modals/BaseModal/BaseModal';
import { ReactComponent as PlusIcon } from '../../../../assets/img/plus.svg';
import { TNotificatonsProps } from '../types';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import { getTransportationOptionString } from '../../../../utils/utils';
import EmployeeChip from '../EmployeeChip/EmployeeChip';
import { useTransportations } from './useTransportations';

const Transportations: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TNotificatonsProps>>
> = ({ setChangesState, changesState, onClose }) => {
  const state = useTransportations({ setChangesState, changesState });
  const isBusy = state.loading || state.isSaving || state.isLoading;

  return (
    <div>
      <div className={state.classes.tabWrapper}>
        {isBusy ? (
          <Loading />
        ) : (
          <>
            <div className={state.classes.tabTitle}>Transportation Requests</div>
            <div className={state.classes.switcherWrapper}>
              <p className={state.classes.notificationsLabel}>
                on/off Transportation notifications
              </p>
              <Switch
                onChange={state.handleSwitch}
                disabled={state.loading || state.isLoading}
                checked={state.allTransportationData?.isActive}
                color="primary"
              />
            </div>
            <Autocomplete
              options={state.options.filter(option => option.state === 1)}
              fullWidth
              isOptionEqualToValue={(option, value) => option.id === value.id}
              disabled={isBusy}
              getOptionLabel={item => getTransportationOptionString(item.type.toString())}
              value={state.selectedTransportation}
              onChange={state.onTransportationChange}
              style={{ marginBottom: 24 }}
              renderInput={autocompleteRender({
                label: '',
                placeholder: 'Select Transportation',
              })}
            />
            <div className={state.classes.selectWrapper}>
              <Autocomplete
                className={state.classes.autocomplete}
                options={state.usersShort}
                disabled={isBusy}
                fullWidth
                getOptionLabel={item => item.fullName}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={state.currentEmployee}
                onChange={state.onEmployeeChange}
                renderInput={autocompleteRender({
                  label: 'Assign Employee',
                  placeholder: 'Select',
                  error: Boolean(
                    state.currentEmployee &&
                    !state.currentTransportationData?.usersList?.includes(
                      state.currentEmployee.id
                    ) &&
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
                className={state.classes.addButton}
              >
                Add
              </Button>
            </div>
            <div>
              {state.selectedEmployees
                .sort((a, b) => a.fullName.localeCompare(b.fullName))
                .map(item => (
                  <EmployeeChip
                    item={item}
                    deleteEmployee={state.deleteEmployee}
                    isSaving={state.isSaving}
                    key={item.id}
                  />
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

export default Transportations;
