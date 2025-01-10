import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../../../components/modals/BaseModal/BaseModal";
import { LoadingButton } from "../../../components/buttons/LoadingButton/LoadingButton";
import { useActionButtonsStyles } from "../../../hooks/styling/useActionButtonsStyles";
import { Autocomplete, Grid, InputAdornment, Switch } from "@mui/material";
import { TextField } from "../../../components/formControls/TextFieldStyled/TextField";
import { TOption } from "../ServiceBookModal/types";
import { autocompleteRender } from "../../../utils/autocompleteRenders";
import { Label, SubTitle } from "./styles";
import ClockTimePicker from "../../../components/pickers/ClockTimePicker/ClockTimePicker";
import { TParsableDate } from "../../../types/types";
import dayjs from "dayjs";
import { timeSpanString } from "../../../utils/constants";
import { TDayTime, TForm, TProps } from "./types";
import { daysList, initialForm } from "./constants";
import {
  SwitcherLabel,
  SwitcherWrapper,
} from "../EmployeesScheduleManagement/EmployeeScheduleModal/styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import {
  loadCapacitySettingById,
  updateCapacitySettingById,
} from "../../../store/reducers/capacityManagement/actions";
import { Loading } from "../../../components/wrappers/Loading/Loading";
import { ReactComponent as Time } from "../../../assets/img/time.svg";
import { ReactComponent as TimeDisabled } from "../../../assets/img/time_disabled.svg";
import { useException } from "../../../hooks/useException/useException";
import { useSCs } from "../../../hooks/useSCs/useSCs";
import { ICapacitySettingRequestData } from "../../../store/reducers/capacityManagement/types";
import { useMessage } from "../../../hooks/useMessage/useMessage";
import { getGapSlotOptions } from "./utils";

const ServiceBookSettingsModal: React.FC<TProps> = ({
  open,
  onClose,
  editingItem,
}) => {
  const { currentSetting, isLoading } = useSelector(
    (state: RootState) => state.capacityManagement,
  );
  const { workingDays } = useSelector(
    ({ serviceCenters }: RootState) => serviceCenters,
  );
  const { hoursOfOperations } = useSelector(
    ({ appointmentFrame }: RootState) => appointmentFrame,
  );
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
      dispatch(
        loadCapacitySettingById(selectedSC.id, editingItem.serviceBookId),
      );
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
          avarageBillHoursPerRO,
        } = currentSetting;
        return {
          serviceBookName,
          appointmentLeadTime,
          appointmentsPerSlot,
          technicianEfficiency,
          avarageBillHoursPerRO,
          isAdvisorStaffingFactor: isAdvisorStaffingFactor,
          cutOffTime: currentSetting.cutOffTime.map((el) => ({
            day: el.day,
            time: el.value,
          })),
          gapSlotsType:
            gapSlotTypeOptions.find(
              (el) => el.value === currentSetting.gapSlotsType,
            ) ?? null,
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

  const handleSelectGap = (e: React.ChangeEvent<{}>, val: TOption | null) => {
    setFormChecked(false);
    setForm({ ...form, gapSlotsType: val });
  };

  const handleTimeChange = (day: number) => (date: TParsableDate) => {
    setFormChecked(false);
    setForm((prev) => {
      const itemToUpdate = prev.cutOffTime.find((el) => el.day === day);
      if (itemToUpdate) {
        const updated = {
          ...itemToUpdate,
          time: dayjs(date).format(timeSpanString),
        };
        const filtered = prev.cutOffTime.filter((el) => el.day !== day);
        return {
          ...prev,
          cutOffTime: [...filtered, updated].sort((a, b) => a.day - b.day),
        };
      } else {
        const newItem: TDayTime = {
          day,
          time: dayjs(date).format(timeSpanString),
        };
        return {
          ...prev,
          cutOffTime: [...prev.cutOffTime, newItem].sort(
            (a, b) => a.day - b.day,
          ),
        };
      }
    });
  };

  const onTimeError = (day: number) => () => {
    setForm((prev) => ({
      ...prev,
      cutOffTime: prev.cutOffTime.filter((el) => el.day !== day),
    }));
  };

  const handleSwitch = (e: any, value: boolean) => {
    setFormChecked(false);
    setForm((prev) => ({ ...prev, isAdvisorStaffingFactor: value }));
  };

  const onCancel = () => {
    setFormChecked(false);
    setInitialData();
    onClose();
  };

  const onSuccess = () => {
    if (
      typeof currentSetting?.gapSlotsType !== "undefined" &&
      typeof form.gapSlotsType !== "undefined" &&
      form.gapSlotsType?.value !== currentSetting.gapSlotsType
    ) {
      showMessage("The Unplanned Demand Settings were reset", "warning");
      showMessage("Capacity data allocations were reset", "warning");
    }
    setFormChecked(false);
    onClose();
    showMessage("Service Book updated");
  };

  const checkTimeItemIsValid = (el: TDayTime | undefined) => {
    if (el?.time) {
      const day = hoursOfOperations.find((item) => item.dayOfWeek === el.day);
      const startTime = day?.from;
      const endTime = day?.to;
      const isAfterStart = dayjs(el.time, timeSpanString)
        .set("second", 0)
        .isSameOrAfter(dayjs(startTime, timeSpanString));
      const isBeforeEnd = dayjs(el.time, timeSpanString)
        .set("second", 0)
        .isSameOrBefore(dayjs(endTime, timeSpanString));
      return isAfterStart && isBeforeEnd;
    } else return true;
  };

  const checkIsValid = () => {
    setFormChecked(true);
    let isValid = true;

    if (!form.gapSlotsType) {
      isValid = false;
      showError('"Appointment Gap Slots" must not be empty');
    }
    if (!form.serviceBookName && editingItem?.serviceBookId) {
      isValid = false;
      showError('"Service Book Name" must not be empty');
    }
    if (form.avarageBillHoursPerRO && form.avarageBillHoursPerRO < 0) {
      isValid = false;
      showError('"Average Bill Per RO" must be equal or more than 0');
    }
    if (form.appointmentLeadTime && form.appointmentLeadTime < 0) {
      isValid = false;
      showError('"Appointment Lead Time" must be equal or more than 0');
    }
    if (form.appointmentsPerSlot && form.appointmentsPerSlot < 0) {
      isValid = false;
      showError('"Appointments Per Slots" must be equal or more than 0');
    }
    if (form.technicianEfficiency) {
      if (form.technicianEfficiency < 25) {
        isValid = false;
        showError('"Technician Efficiency" must be equal or more than 25');
      }
      if (form.technicianEfficiency > 999) {
        isValid = false;
        showError('"Technician Efficiency" must be  more than 999');
      }
      if (!Number.isInteger(+form.technicianEfficiency)) {
        showError('"Technician Efficiency" must be a whole number');
        isValid = false;
      }
    }
    if (
      form.cutOffTime.length &&
      !form.cutOffTime
        .filter((el) => el.time)
        .find((el) => checkTimeItemIsValid(el))
    ) {
      isValid = false;
      showError('"Appointment Cut Off" should bi inside of the working hours');
    }
    return isValid;
  };

  const onSave = () => {
    if (checkIsValid() && selectedSC) {
      const data: ICapacitySettingRequestData = {
        serviceCenterId: selectedSC.id,
        gapSlotsType: form.gapSlotsType?.value ?? null,
        cutOffTime: form.cutOffTime.map((el) => ({
          day: el.day,
          value: el.time,
        })),
        serviceBookName: form.serviceBookName,
      };
      if (typeof form.isAdvisorStaffingFactor !== "undefined")
        data.isAdvisorStaffingFactor = form.isAdvisorStaffingFactor;
      if (editingItem?.serviceBookId)
        data.serviceBookId = editingItem.serviceBookId;
      if (editingItem?.serviceBookId && form.serviceBookName)
        data.serviceBookName = form.serviceBookName;
      if (form.technicianEfficiency !== null && form.technicianEfficiency >= 0)
        data.technicianEfficiency = form.technicianEfficiency;
      if (
        form.avarageBillHoursPerRO !== null &&
        form.avarageBillHoursPerRO >= 0
      )
        data.avarageBillHoursPerRO = form.avarageBillHoursPerRO;
      if (form.appointmentLeadTime !== null && form.appointmentLeadTime >= 0)
        data.appointmentLeadTime = form.appointmentLeadTime;
      if (form.appointmentsPerSlot !== null && form.appointmentsPerSlot >= 0)
        data.appointmentsPerSlot = form.appointmentsPerSlot;
      dispatch(updateCapacitySettingById(data, showError, onSuccess));
    }
  };

  const getDayLabel = (existingTime: TDayTime | undefined, day: number) => {
    return existingTime?.day
      ? dayjs().set("day", existingTime?.day).format("dddd")
      : dayjs().set("day", day).format("dddd");
  };

  return (
    <BaseModal open={open} onClose={onCancel} width={550}>
      <DialogTitle onClose={onCancel}>Edit Service Book</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Loading />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="serviceBookName"
                name="serviceBookName"
                label="Service Book Name"
                placeholder="Type Name"
                fullWidth
                required
                disabled
                error={formIsChecked && !form.serviceBookName}
                onChange={handleChange}
                value={form.serviceBookName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                id="gapSlotsType"
                fullWidth
                getOptionLabel={(o) => o.name}
                onChange={handleSelectGap}
                value={form.gapSlotsType}
                isOptionEqualToValue={(o, v) => o === v}
                options={gapSlotTypeOptions}
                renderInput={autocompleteRender({
                  label: "Appointment Gap Slots",
                  placeholder: "Appointment Gap Slots",
                  error: formIsChecked && !form.gapSlotsType,
                  required: true,
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="appointmentsPerSlot"
                name="appointmentsPerSlot"
                label="Appointments Per Slot"
                placeholder="Type Amount"
                fullWidth
                type="number"
                error={
                  formIsChecked &&
                  form.appointmentsPerSlot !== null &&
                  form.appointmentsPerSlot < 0
                }
                inputProps={{ min: 0 }}
                onChange={handleChange}
                value={form.appointmentsPerSlot}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="appointmentLeadTime"
                name="appointmentLeadTime"
                label="Appointment Lead Time"
                placeholder="Type Time"
                error={
                  formIsChecked &&
                  form.appointmentLeadTime !== null &&
                  form.appointmentLeadTime < 0
                }
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                onChange={handleChange}
                value={form.appointmentLeadTime}
              />
            </Grid>
            <Grid xs={12} item>
              <SubTitle>Appointment Cut Off</SubTitle>
            </Grid>
            {daysList.map((day) => {
              const existingTime = form.cutOffTime.find((el) => el.day === day);
              return (
                <Grid item xs={6} md={3}>
                  <ClockTimePicker
                    fullWidth
                    withClear
                    onError={onTimeError(existingTime?.day ?? day)}
                    value={
                      existingTime
                        ? dayjs(existingTime.time, timeSpanString)
                        : null
                    }
                    label={getDayLabel(existingTime, day)}
                    InputProps={{
                      placeholder: "",
                      id: getDayLabel(existingTime, day),
                      disabled: !workingDays.includes(day),
                      endAdornment: workingDays.includes(day) ? (
                        <Time width={27} />
                      ) : (
                        <TimeDisabled width={27} />
                      ),
                      error:
                        formIsChecked && !checkTimeItemIsValid(existingTime),
                    }}
                    onChange={handleTimeChange(existingTime?.day ?? day)}
                  />
                </Grid>
              );
            })}
            <Grid item xs={12} md={6}>
              <TextField
                id="technicianEfficiency"
                name="technicianEfficiency"
                label="Technician Efficiency"
                placeholder="Type Efficiency, %"
                fullWidth
                type="number"
                startAdornment={
                  <InputAdornment position="start">%</InputAdornment>
                }
                error={
                  formIsChecked &&
                  form.technicianEfficiency !== null &&
                  (form.technicianEfficiency < 25 ||
                    form.technicianEfficiency > 999 ||
                    !Number.isInteger(+form.technicianEfficiency))
                }
                inputProps={{ min: 0, step: 1 }}
                onChange={handleChange}
                value={form.technicianEfficiency}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="avarageBillHoursPerRO"
                name="avarageBillHoursPerRO"
                label="Average RO Hours"
                placeholder="Type RO Hours"
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                onChange={handleChange}
                error={
                  formIsChecked &&
                  form.avarageBillHoursPerRO !== null &&
                  form.avarageBillHoursPerRO < 0
                }
                value={form.avarageBillHoursPerRO}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Label>Advisor Staffing Factor</Label>
              <SwitcherWrapper>
                <SwitcherLabel>OFF</SwitcherLabel>
                <Switch
                  disabled={
                    typeof currentSetting?.isAdvisorStaffingFactor ===
                    "undefined"
                  }
                  onChange={handleSwitch}
                  checked={form.isAdvisorStaffingFactor}
                  color="primary"
                />
                <SwitcherLabel>ON</SwitcherLabel>
              </SwitcherWrapper>
            </Grid>
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
            <LoadingButton
              loading={isLoading}
              onClick={onSave}
              className={classes.saveButton}
            >
              Save
            </LoadingButton>
          </div>
        </div>
      </DialogActions>
    </BaseModal>
  );
};

export default ServiceBookSettingsModal;
