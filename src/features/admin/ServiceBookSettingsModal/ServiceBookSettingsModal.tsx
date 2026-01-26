import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../components/modals/BaseModal/BaseModal';
import { LoadingButton } from '../../../components/buttons/LoadingButton/LoadingButton';
import { useActionButtonsStyles } from '../../../hooks/styling/useActionButtonsStyles';
import { Grid } from '@mui/material';
import { TOption } from '../ServiceBookModal/types';
import ClockTimePicker from '../../../components/pickers/ClockTimePicker/ClockTimePicker';
import { TParsableDate } from '../../../types/types';
import dayjs from 'dayjs';
import { timeSpanString } from '../../../utils/constants';
import { TDayTime, TForm, TProps } from './types';
import { daysList, initialForm } from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import {
  loadCapacitySettingById,
  updateCapacitySettingById,
} from '../../../store/reducers/capacityManagement/actions';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { ReactComponent as Time } from '../../../assets/img/time.svg';
import { ReactComponent as TimeDisabled } from '../../../assets/img/time_disabled.svg';
import { useException } from '../../../hooks/useException/useException';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useMessage } from '../../../hooks/useMessage/useMessage';
import {
  buildCapacityData,
  getGapSlotOptions,
  validateCutOffTime,
  validateGapSlotsType,
  validateNumbers,
  validateServiceBookName,
  validateTechnicianEfficiency,
} from './utils';
import InputGroup from './InputGroup';
import EmployeeSettingsForm from './EmployeeSettingsForm';

const ServiceBookSettingsModal: React.FC<TProps> = ({ open, onClose, editingItem }) => {
  const { currentSetting, isLoading } = useSelector((state: RootState) => state.capacityManagement);
  const { workingDays } = useSelector(({ serviceCenters }: RootState) => serviceCenters);
  const { hoursOfOperations } = useSelector(({ appointmentFrame }: RootState) => appointmentFrame);
  const [form, setForm] = useState<TForm>(initialForm);
  const [formIsChecked, setFormChecked] = useState<boolean>(false);
  const { classes } = useActionButtonsStyles();
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();
  const { selectedSC } = useSCs();
  const gapSlotTypeOptions: TOption[] = useMemo(() => getGapSlotOptions(), []);

  useEffect(() => {
    if (editingItem && open && selectedSC) {
      dispatch(loadCapacitySettingById(selectedSC.id, editingItem.serviceBookId));
    }
  }, [editingItem, open, selectedSC]);

  const setInitialData = useCallback(() => {
    if (currentSetting)
      setForm(() => {
        const {
          serviceBookName,
          isAdvisorStaffingFactor,
          appointmentLeadTime,
          appointmentsPerSlot,
          technicianEfficiency,
          averageBillHoursPerRO,
        } = currentSetting;
        return {
          serviceBookName,
          appointmentLeadTime,
          appointmentsPerSlot,
          technicianEfficiency,
          averageBillHoursPerRO,
          isAdvisorStaffingFactor: isAdvisorStaffingFactor,
          cutOffTime: currentSetting.cutOffTime.map(el => ({ day: el.day, time: el.value })),
          gapSlotsType:
            gapSlotTypeOptions.find(el => el.value === currentSetting.gapSlotsType) ?? null,
        };
      });
  }, [currentSetting, gapSlotTypeOptions]);

  useEffect(() => {
    setInitialData();
  }, [currentSetting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormChecked(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (day: number) => (date: TParsableDate) => {
    setFormChecked(false);
    setForm(prev => {
      const itemToUpdate = prev.cutOffTime.find(el => el.day === day);
      if (itemToUpdate) {
        const updated = { ...itemToUpdate, time: dayjs(date).format(timeSpanString) };
        const filtered = prev.cutOffTime.filter(el => el.day !== day);
        return {
          ...prev,
          cutOffTime: [...filtered, updated].sort((a, b) => a.day - b.day),
        };
      } else {
        const newItem: TDayTime = { day, time: dayjs(date).format(timeSpanString) };
        return {
          ...prev,
          cutOffTime: [...prev.cutOffTime, newItem].sort((a, b) => a.day - b.day),
        };
      }
    });
  };

  const onTimeError = (day: number) => () => {
    setForm(prev => ({
      ...prev,
      cutOffTime: prev.cutOffTime.filter(el => el.day !== day),
    }));
  };

  const onCancel = () => {
    setFormChecked(false);
    setInitialData();
    onClose();
  };

  const onSuccess = () => {
    if (
      typeof currentSetting?.gapSlotsType !== 'undefined' &&
      typeof form.gapSlotsType !== 'undefined' &&
      form.gapSlotsType?.value !== currentSetting.gapSlotsType
    ) {
      showMessage('The Unplanned Demand Settings were reset', 'warning');
      showMessage('Capacity data allocations were reset', 'warning');
    }
    setFormChecked(false);
    onClose();
    showMessage('Service Book updated');
  };

  const checkTimeItemIsValid = (el: TDayTime | undefined) => {
    if (el?.time) {
      const day = hoursOfOperations.find(item => item.dayOfWeek === el.day);
      const startTime = day?.from;
      const endTime = day?.to;
      const isAfterStart = dayjs(el.time, timeSpanString)
        .set('second', 0)
        .isSameOrAfter(dayjs(startTime, timeSpanString));
      const isBeforeEnd = dayjs(el.time, timeSpanString)
        .set('second', 0)
        .isSameOrBefore(dayjs(endTime, timeSpanString));
      return isAfterStart && isBeforeEnd;
    } else return true;
  };

  const checkIsValid = () => {
    setFormChecked(true);
    let isValid = true;
    isValid = validateGapSlotsType(form, showError) && isValid;
    isValid = validateServiceBookName(form, editingItem, showError) && isValid;
    isValid = validateNumbers(form, showError) && isValid;
    isValid = validateTechnicianEfficiency(form, showError) && isValid;
    isValid = validateCutOffTime(form.cutOffTime, checkTimeItemIsValid, showError) && isValid;
    return isValid;
  };

  const onSave = () => {
    if (checkIsValid() && selectedSC) {
      const data = buildCapacityData(form, selectedSC.id, editingItem);
      dispatch(updateCapacitySettingById(data, showError, onSuccess));
    }
  };

  const getDayLabel = (existingTime: TDayTime | undefined, day: number) => {
    return existingTime?.day
      ? dayjs().set('day', existingTime?.day).format('dddd')
      : dayjs().set('day', day).format('dddd');
  };

  return (
    <BaseModal open={open} onClose={onCancel} width={550}>
      <DialogTitle onClose={onCancel}>Edit Service Book</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Loading />
        ) : (
          <Grid container spacing={3}>
            <InputGroup
              form={form}
              handleChange={handleChange}
              setForm={setForm}
              formIsChecked={formIsChecked}
              setFormChecked={setFormChecked}
            />
            {daysList.map(day => {
              const existingTime = form.cutOffTime.find(el => el.day === day);
              return (
                <Grid key={day} item xs={6} md={3}>
                  <ClockTimePicker
                    fullWidth
                    withClear
                    onError={onTimeError(existingTime?.day ?? day)}
                    value={existingTime ? dayjs(existingTime.time, timeSpanString) : null}
                    label={getDayLabel(existingTime, day)}
                    InputProps={{
                      placeholder: '',
                      id: getDayLabel(existingTime, day),
                      disabled: !workingDays.includes(day),
                      endAdornment: workingDays.includes(day) ? (
                        <Time width={27} />
                      ) : (
                        <TimeDisabled width={27} />
                      ),
                      error: formIsChecked && !checkTimeItemIsValid(existingTime),
                    }}
                    onChange={handleTimeChange(existingTime?.day ?? day)}
                  />
                </Grid>
              );
            })}
            <EmployeeSettingsForm
              form={form}
              handleChange={handleChange}
              setForm={setForm}
              formIsChecked={formIsChecked}
              setFormChecked={setFormChecked}
            />
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <div className={classes.wrapper}>
          <div className={classes.buttonsWrapper}>
            <LoadingButton
              loading={isLoading}
              onClick={onCancel}
              variant="text"
              style={{ marginRight: 20 }}
              color="info"
            >
              Cancel
            </LoadingButton>
            <LoadingButton loading={isLoading} onClick={onSave} className={classes.saveButton}>
              Save
            </LoadingButton>
          </div>
        </div>
      </DialogActions>
    </BaseModal>
  );
};

export default ServiceBookSettingsModal;
