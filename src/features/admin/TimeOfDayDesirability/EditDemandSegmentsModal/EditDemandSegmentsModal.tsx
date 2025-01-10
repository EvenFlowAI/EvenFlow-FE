import React, { useEffect, useState } from 'react';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button } from '@mui/material';
import { SC_UNDEFINED } from '../../../../utils/constants';
import { useDispatch } from 'react-redux';
import {
  IOptimizationSetting,
  IOptimizationSettingsCreateForm,
  IOptimizationSettingsItem,
} from '../../../../store/reducers/slotScoring/types';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { setOptimizationSettings } from '../../../../store/reducers/slotScoring/actions';
import { useStyles } from './styles';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';

import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useSelectedPod } from '../../../../hooks/useSelectedPod/useSelectedPod';

type TForm = IOptimizationSettingsItem[];

const initialForm: TForm = [
  { from: 1, to: 1 },
  { from: 2, to: 2 },
  { from: 3, to: 3 },
];

export const EditDemandSegmentsModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps<IOptimizationSetting[]>>>
> = ({ onAction, payload, ...props }) => {
  const [form, setForm] = useState<TForm>(initialForm);
  const [isSaving, setSaving] = useState<boolean>(false);
  const { selectedSC } = useSCs();
  const { selectedPod } = useSelectedPod();
  const showMessage = useMessage();
  const showError = useException();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  useEffect(() => {
    if (props.open) {
      if (payload?.length) {
        setForm(payload.map(({ from, to, id }) => ({ from, to, id })));
      } else {
        setForm(initialForm);
      }
    }
  }, [props.open, payload]);

  const handleChange =
    (name: keyof IOptimizationSettingsItem, idx: number) =>
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      const f = [...form];
      const row: IOptimizationSettingsItem = { ...form[idx] };
      row[name] = Number(value);
      f[idx] = row;
      setForm(f);
    };

  const checkIsValid = (): boolean => {
    const notValidItem = form.find(item => item.from > item.to);
    if (notValidItem) showError('"From" must be less than or equal to "To"');
    return !Boolean(notValidItem);
  };

  const handleSave = async () => {
    if (!selectedSC) {
      showError(SC_UNDEFINED);
    } else {
      if (checkIsValid()) {
        setSaving(true);
        try {
          const data: IOptimizationSettingsCreateForm = {
            serviceCenterId: selectedSC.id,
            podId: selectedPod?.id,
            items: [...form],
          };
          await dispatch(setOptimizationSettings(data));

          setSaving(false);
          showMessage('Saved');
          props.onClose();
        } catch (e) {
          setSaving(false);
          showError(e);
        }
      }
    }
  };

  return (
    <BaseModal {...props} width={500}>
      <DialogTitle onClose={props.onClose}>Edit Demand Segment</DialogTitle>
      <DialogContent>
        {form.map((formRow, idx) => {
          return (
            <div className={classes.row} key={idx}>
              <span className={classes.divider}>From</span>
              <span className={classes.inputContainer}>
                <TextField
                  fullWidth
                  label="Segment Start"
                  type="number"
                  name="some-undefined-value-2"
                  inputProps={{ min: 1 }}
                  onChange={handleChange('from', idx)}
                  value={formRow.from}
                />
              </span>
              <span className={classes.divider}>To</span>
              <span className={classes.inputContainer}>
                <TextField
                  fullWidth
                  label="Segment End"
                  type="number"
                  name="some-undefined-value"
                  inputProps={{ min: 1 }}
                  onChange={handleChange('to', idx)}
                  value={formRow.to}
                />
              </span>
            </div>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="info">
          Cancel
        </Button>
        <LoadingButton loading={isSaving} onClick={handleSave}>
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};
