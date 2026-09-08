import { DialogProps } from '../../../../components/modals/BaseModal/types';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  ICustomerLifetime,
  ICustomerLifetimeForm,
} from '../../../../store/reducers/valueSettings/types';
import { setCustomerLifetimes } from '../../../../store/reducers/valueSettings/actions';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { SC_UNDEFINED } from '../../../../utils/constants';
import { useStyles } from './styles';
import { TForm } from './types';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';

import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useSelectedPod } from '../../../../hooks/useSelectedPod/useSelectedPod';

const initialForm: TForm = {
  from: '',
  to: '',
};

export const CustomerLifetimesModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps<ICustomerLifetime>>>
> = ({ payload, onAction, ...props }) => {
  const [saving, setSaving] = useState<boolean>(false);
  const [form, setForm] = useState<TForm>(initialForm);
  const { selectedSC } = useSCs();
  const { selectedPod } = useSelectedPod();
  const showMessage = useMessage();
  const showError = useException();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  useEffect(() => {
    if (selectedSC && props.open) {
      if (payload) {
        setForm({ from: String(payload.from), to: String(payload.to) });
      } else {
        setForm(initialForm);
      }
    }
  }, [selectedSC, props.open, payload]);

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [name]: e.target.value });
  };

  const checkIsValid = () => {
    if (Number(form.from) > Number(form.to)) {
      showError('"From" must be less than or equal to "To"');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!selectedSC) {
      showError(SC_UNDEFINED);
    } else {
      if (checkIsValid()) {
        setSaving(true);
        const data: ICustomerLifetimeForm = {
          from: Number(form.from),
          to: Number(form.to),
          serviceCenterId: selectedSC.id,
          podId: selectedPod?.id,
        };
        try {
          await dispatch(setCustomerLifetimes(data));
          showMessage('Customer Lifetime Value Range updated');
          setSaving(false);
          props.onClose();
        } catch (e) {
          setSaving(false);
          showError(e);
        }
      }
    }
  };

  return (
    <BaseModal {...props} width={490}>
      <DialogTitle onClose={props.onClose}>Edit Medium Value</DialogTitle>
      <DialogContent>
        <div className={classes.group}>
          <div>
            <TextField
              type="number"
              autoComplete="low-value value"
              id="low-value"
              startAdornment="$"
              name="low-value-f"
              inputProps={{ min: 0 }}
              value={form.from}
              label="Value Definition From"
              onChange={handleChange('from')}
            />
          </div>
          <span style={{ fontSize: 24 }}> - </span>
          <div>
            <TextField
              type="number"
              startAdornment="$"
              autoComplete="high-value value"
              inputProps={{ min: Number(form.from) || 0 }}
              id="high-value"
              name="high-value-t"
              value={form.to}
              label="Value Definition To"
              onChange={handleChange('to')}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="info">
          Cancel
        </Button>
        <LoadingButton loading={saving} onClick={handleSave} variant="contained" color="primary">
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};
