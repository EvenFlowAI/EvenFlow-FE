import React, { useEffect, useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  BaseModal,
  DialogActions,
} from '../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { ITimeRangeAndCapacity } from '../../../../store/reducers/capacityServiceValet/types';
import { Button, Divider, Grid } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { useStyles } from '../../MakesModels/AddMakeModelModal/styles';
import { useDispatch } from 'react-redux';
import {
  createTimeRange,
  updateTimeRange,
} from '../../../../store/reducers/capacityServiceValet/actions';
import { timeWithSecond } from '../constants';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { time24HourFormat } from '../../../../utils/constants';
import { TParsableDate } from '../../../../types/types';
import dayjs from 'dayjs';
import ClockTimePicker from '../../../../components/pickers/ClockTimePicker/ClockTimePicker';

type TProps = DialogProps & {
  editingElement: ITimeRangeAndCapacity;
};

const EditTimeRangeAndCapacityModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ onClose, open, editingElement }) => {
  const [pickUpMin, setPickUpMin] = useState<TParsableDate>(null);
  const [pickUpMax, setPickUpMax] = useState<TParsableDate>(null);
  const [dropOffMin, setDropOffMin] = useState<TParsableDate>(null);
  const [dropOffMax, setDropOffMax] = useState<TParsableDate>(null);
  const [dailyCapacity, setDailyCapacity] = useState<number | null>(null);
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { selectedSC } = useSCs();
  const showError = useException();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (open && editingElement) {
      if (editingElement.pickUpMin !== '-')
        setPickUpMin(dayjs(editingElement.pickUpMin, time24HourFormat));
      if (editingElement.pickUpMax !== '-')
        setPickUpMax(dayjs(editingElement.pickUpMax, time24HourFormat));
      if (editingElement.dropOffMin !== '-')
        setDropOffMin(dayjs(editingElement.dropOffMin, time24HourFormat));
      if (editingElement.dropOffMax !== '-')
        setDropOffMax(dayjs(editingElement.dropOffMax, time24HourFormat));
      if (editingElement.capacity) setDailyCapacity(editingElement.capacity);
    }
  }, [editingElement, open]);

  const onError = (e: any) => {
    showError(e);
    if (e.response?.data?.errors) {
      const data = [...e.response.data.errors];
      setErrors(() => data.map((err: any): string => err.message).filter(el => el !== null));
    }
    if (e.response?.data?.message) {
      setErrors(prevState => [...prevState, e.response.data.message]);
    }
  };

  const onCancel = () => {
    setFormIsChecked(false);
    setPickUpMin(null);
    setPickUpMax(null);
    setDropOffMax(null);
    setDropOffMin(null);
    setDailyCapacity(null);
    setErrors([]);
    onClose();
  };

  const handleChangePickUpMin = (date: TParsableDate) => {
    setFormIsChecked(false);
    setErrors([]);
    setPickUpMin(date ? dayjs(date) : null);
  };

  const handleChangePickUpMax = (date: TParsableDate) => {
    setFormIsChecked(false);
    setErrors([]);
    setPickUpMax(date ? dayjs(date) : null);
  };

  const handleChangeDropOffMin = (date: TParsableDate) => {
    setFormIsChecked(false);
    setErrors([]);
    setDropOffMin(date ? dayjs(date) : null);
  };

  const handleChangeDropOffMax = (date: TParsableDate) => {
    setFormIsChecked(false);
    setErrors([]);
    setDropOffMax(date ? dayjs(date) : null);
  };

  const handleChangeDailyCapacity = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setFormIsChecked(false);
    setErrors([]);
    setDailyCapacity(value ? +value : null);
  };

  const onSave = () => {
    setFormIsChecked(true);
    if (selectedSC) {
      const tryFormat = (d: TParsableDate) => (d ? dayjs(d).format(timeWithSecond) : null);
      const data: ITimeRangeAndCapacity = {
        serviceCenterId: selectedSC.id,
        pickUpMin: tryFormat(pickUpMin),
        pickUpMax: tryFormat(pickUpMax),
        dropOffMin: tryFormat(dropOffMin),
        dropOffMax: tryFormat(dropOffMax),
        capacity: dailyCapacity !== null ? +dailyCapacity : null,
      };
      if (editingElement.id) {
        dispatch(updateTimeRange(selectedSC.id, editingElement.id, data, onError, onCancel));
      } else {
        data.dayOfWeek = editingElement.dayOfWeek;
        dispatch(createTimeRange(selectedSC.id, data, onError, onCancel));
      }
    }
  };

  return (
    <BaseModal onClose={onCancel} open={open} width={575}>
      <DialogTitle onClose={onCancel}>
        Edit Time Ranges & Capacity Of
        <span>
          {' '}
          {editingElement.dayOfWeek !== undefined
            ? dayjs().set('day', editingElement.dayOfWeek).format('dddd').toUpperCase()
            : ''}
        </span>
      </DialogTitle>
      <DialogContent style={{ padding: '16px 120px' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <ClockTimePicker
              key="pickUpMin"
              value={pickUpMin}
              withClear
              fullWidth
              InputProps={{
                endAdornment: <AccessTime color="primary" cursor="pointer" />,
              }}
              onError={(reason, value) => {
                if (reason === 'invalidDate' || value === null) {
                  setPickUpMin(null);
                }
              }}
              name="pickUpMin"
              label="Pick Up Min"
              onChange={handleChangePickUpMin}
              error={
                errors.some(
                  e =>
                    e.toLowerCase().includes('pick up min') ||
                    e.toLowerCase().includes('pick up and drop off')
                ) && formIsChecked
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ClockTimePicker
              key="pickUpMax"
              value={pickUpMax}
              withClear
              fullWidth
              InputProps={{
                endAdornment: <AccessTime color="primary" cursor="pointer" />,
              }}
              onError={(reason, value) => {
                if (reason === 'invalidDate' || value === null) {
                  setPickUpMax(null);
                }
              }}
              name="pickUpMax"
              label="Pick Up Max"
              onChange={handleChangePickUpMax}
              error={
                errors.some(
                  e =>
                    e.toLowerCase().includes('pick up max') ||
                    e.toLowerCase().includes('pick up and drop off')
                ) && formIsChecked
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ClockTimePicker
              key="dropOffMin"
              value={dropOffMin}
              withClear
              fullWidth
              InputProps={{
                endAdornment: <AccessTime color="primary" cursor="pointer" />,
              }}
              onError={(reason, value) => {
                if (reason === 'invalidDate' || value === null) {
                  setDropOffMin(null);
                }
              }}
              name="dropOffMin"
              label="Drop Off Min"
              onChange={handleChangeDropOffMin}
              error={
                errors.some(
                  e =>
                    e.toLowerCase().includes('drop off min') ||
                    e.toLowerCase().includes('pick up and drop off')
                ) && formIsChecked
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ClockTimePicker
              key="dropOffMax"
              value={dropOffMax}
              withClear
              fullWidth
              InputProps={{
                endAdornment: <AccessTime color="primary" cursor="pointer" />,
              }}
              onError={(reason, value) => {
                if (reason === 'invalidDate' || value === null) {
                  setDropOffMax(null);
                }
              }}
              name="dropOffMax"
              label="Drop Off Max"
              onChange={handleChangeDropOffMax}
              error={
                errors.some(
                  e =>
                    e.toLowerCase().includes('drop off max') ||
                    e.toLowerCase().includes('pick up and drop off')
                ) && formIsChecked
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={'Daily Capacity'}
              name="dailyCapacity"
              type="number"
              error={formIsChecked && errors.some(e => e.toLowerCase().includes('capacity'))}
              inputProps={{
                min: 0,
              }}
              value={dailyCapacity ?? ''}
              onChange={handleChangeDailyCapacity}
              fullWidth
              id="dailyCapacity"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider style={{ marginBottom: 0 }} />
      <DialogActions>
        <div className={classes.wrapper}>
          <div className={classes.buttonsWrapper}>
            <Button onClick={onCancel} className={classes.cancelButton}>
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

export default EditTimeRangeAndCapacityModal;
