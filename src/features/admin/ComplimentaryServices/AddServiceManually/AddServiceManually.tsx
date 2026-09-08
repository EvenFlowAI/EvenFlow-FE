import React, { useCallback, useEffect, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { Button, Grid, InputAdornment } from '@mui/material';
import { useDispatch } from 'react-redux';
import { TComplimentary } from '../../../../store/reducers/complimentary/types';
import {
  addComplimentaryManually,
  editComplimentary,
} from '../../../../store/reducers/complimentary/actions';
import { IComplimentaryServiceByQuery } from '../../../../store/reducers/packages/types';
import { useStyles } from './styles';

import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';

type TAddServiceProps = DialogProps & {
  title: string;
  editedItem: IComplimentaryServiceByQuery | undefined;
};

const AddServiceManually: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddServiceProps>>
> = ({ title, onClose, editedItem, ...props }) => {
  const [description, setDescription] = useState<string>('');
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const [duration, setDuration] = useState<number | string>('');
  const [total, setTotal] = useState<number | string>('');
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();
  const { selectedSC } = useSCs();
  const { classes } = useStyles();

  useEffect(() => {
    if (editedItem) {
      setDuration(+editedItem.durationInHours);
      setDescription(editedItem.name);
      setTotal(editedItem.price.toFixed(2));
    } else {
      setDuration(+'');
      setDescription('');
      setTotal('');
    }
  }, [editedItem]);

  const onDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormIsChecked(false);
    setDescription(e.target.value);
  }, []);

  const onTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotal(e.target.value);
    setFormIsChecked(false);
  };

  const onDurationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(+e.target.value);
    setFormIsChecked(false);
  }, []);

  const onCancel = useCallback((): void => {
    setFormIsChecked(false);
    setDescription('');
    setTotal('');
    setDuration('');
    onClose();
  }, []);

  const onSuccess = () => {
    showMessage(editedItem ? 'Op Code updated' : '1 Op Code added');
    onCancel();
  };

  const onSave = useCallback((): void => {
    setFormIsChecked(true);
    if (description.length && selectedSC) {
      const data: TComplimentary = {
        serviceCenterId: selectedSC.id,
        name: description,
        price: +total,
        durationInHours: +duration,
      };
      editedItem
        ? dispatch(editComplimentary(editedItem.id, data, onSuccess, showError))
        : dispatch(addComplimentaryManually(data, onSuccess, showError));
    }
  }, [description, selectedSC, duration, total, editedItem]);

  return (
    <BaseModal {...props} width={460} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Description"
              placeholder="Type Description"
              error={!description && formIsChecked}
              onChange={onDescriptionChange}
              fullWidth
              rows={2}
              multiline
              style={{ marginBottom: 10 }}
              value={description}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Labor Hours"
              placeholder="Labor Hours"
              fullWidth
              value={duration}
              inputProps={{ min: 0 }}
              onChange={onDurationChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Market Rate"
              placeholder="Market Rate"
              inputProps={{ min: 1, step: 0.01 }}
              value={total}
              fullWidth
              onChange={onTotalChange}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <div className={classes.wrapper}>
          <div className={classes.buttonsWrapper}>
            <Button onClick={onCancel} color="info" className={classes.cancelButton}>
              Cancel
            </Button>
            <Button onClick={onSave} className={classes.saveButton}>
              Save
            </Button>
          </div>
        </div>
      </DialogActions>
    </BaseModal>
  );
};

export default AddServiceManually;
