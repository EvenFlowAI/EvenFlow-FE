import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {IEmployeeRoleHours, TDaySchedule, TSetScheduleData} from "../../../store/reducers/employees/types";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {loadBaseEmployeeSchedule, updateBaseEmployeeSchedule} from "../../../store/reducers/employees/actions";
import {DayName, RowWrapper, SwitcherLabel, SwitcherWrapper, UserWrapper} from "./styles";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import dayjs from "dayjs";
import {Switch} from "@mui/material";
import TimeSelect from "../../../components/pickers/TimeSelect/TimeSelect";
import {useActionButtonsStyles} from "../../../hooks/styling/useActionButtonsStyles";
import {LoadingButton} from "../../../components/buttons/LoadingButton/LoadingButton";
import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {timeSpanString} from "../../../utils/constants";
import {PickersWrapper} from "../../../components/styled/PickersWrapper";

type TProps = DialogProps & {
    editingItem: IEmployeeRoleHours | null;
    getData: () => void;
}

const daysList = [1, 2, 3, 4, 5, 6, 0]

const EmployeeTimeScheduleSetUp: React.FC<TProps> = ({open, onClose, editingItem, getData}) => {
    const {employeeSchedule, loading} = useSelector((state: RootState) => state.employees);
    const {hoursOfOperations} = useSelector((state: RootState) => state.appointmentFrame);
    const {employeesLoading} = useSelector((state: RootState) => state.employeesSchedule);
    const [currentSchedule, setCurrentSchedule] = useState<TDaySchedule[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {classes} = useActionButtonsStyles();
    const workingDays = useMemo(() => {
        return hoursOfOperations.map(el => el.dayOfWeek)
    }, [hoursOfOperations])

    useEffect(() => {
        if (editingItem && selectedSC && open) {
            dispatch(loadBaseEmployeeSchedule(selectedSC.id, editingItem.employeeId, editingItem.serviceBookId ?? undefined))
        }
    }, [selectedSC, editingItem, open])

    const setInitialData = useCallback(() => {
        if (employeeSchedule) {
            setCurrentSchedule(daysList.map(dayNumber => {
                const existingSchedule = employeeSchedule.dayOfWeekSchedules
                    .find(el => el.dayOfWeek === dayNumber)
                const schedule = hoursOfOperations.find(el => el.dayOfWeek === dayNumber);
                return existingSchedule ? existingSchedule : {
                    dayOfWeek: dayNumber,
                    from: schedule?.from ?? "09:00:00",
                    to: schedule?.to ?? "17:00:00",
                    isOnSchedule: false,
                }
            }))
        }
    }, [employeeSchedule, hoursOfOperations])

    useEffect(() => {
        setInitialData()
    }, [setInitialData])

    const handleSwitch = (day: number) => (e: any, value: boolean) => {
        setFormIsChecked(false)
        setCurrentSchedule(prev => {
            const data = [...prev];
            let element = data.find(el => el.dayOfWeek === day);
            if (element) {
                element = {...element, isOnSchedule: value}
                const filtered = data.filter(item => item.dayOfWeek !== day)
                return [...filtered, element].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            }
            return prev;
        })
    }

    const onTimeChange = (day: number, field: "from" | "to", value: string) => {
        setFormIsChecked(false)
        setCurrentSchedule(prev => {
            const data = [...prev];
            let element = data.find(el => el.dayOfWeek === day);
            if (element) {
                element = {...element, [field]: value}
                const filtered = data.filter(item => item.dayOfWeek !== day)
                return [...filtered, element].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            }
            return prev
        })
    }

    const onCancel = () => {
        setFormIsChecked(false)
        setInitialData()
        onClose()
    }

    const onSuccess = () => {
        showMessage("Employee schedule updated")
        getData()
    }

    const checkIsValid = (): boolean => {
        return currentSchedule
            .filter(item => item.isOnSchedule)
            .every(item => {
                const schedule = hoursOfOperations.find(el => el.dayOfWeek === item.dayOfWeek);
                return dayjs(item.to, timeSpanString).isAfter(dayjs(item.from, timeSpanString), 'minute')
                    && dayjs(item.to, timeSpanString).isSameOrBefore(dayjs(schedule?.to, timeSpanString), 'minute')
                    && dayjs(item.from, timeSpanString).isSameOrAfter(dayjs(schedule?.from, timeSpanString), 'minute')
            })
    }

    const onSave = () => {
        if (selectedSC && editingItem) {
            setFormIsChecked(true)
            if (checkIsValid()) {
                const data: TSetScheduleData = {
                    serviceCenterId: selectedSC.id,
                    employeeId: editingItem?.employeeId,
                    dayOfWeekSchedules: currentSchedule.filter(item => item.isOnSchedule),
                }
                if (editingItem.serviceBookId) data.serviceBookId = employeeSchedule?.serviceBookId
                dispatch(updateBaseEmployeeSchedule(data, onSuccess, showError))
            } else {
                showError('"To" must be later then "From" and inside of the Hours Of Operations')
            }
        }
    }

    return (
        <BaseModal open={open} onClose={onCancel} width={780}>
            <DialogTitle onClose={onCancel}>Employee Time Schedule Set Up</DialogTitle>
            <DialogContent>
                {loading || employeesLoading ?
                    <Loading/>
                    : <>
                        <UserWrapper>
                            <div>{employeeSchedule?.employeeName ?? null}</div>
                            <div>{employeeSchedule?.role ?? null}</div>
                            <div>{employeeSchedule?.serviceBook ?? null}</div>
                        </UserWrapper>
                        {daysList.map(day => {
                            const scheduleItem = currentSchedule.find(el => el.dayOfWeek === day)
                            const schedule = hoursOfOperations.find(el => el.dayOfWeek === day);
                            const checked = scheduleItem?.isOnSchedule
                            return <RowWrapper key={day}>
                                <DayName>{dayjs().set('day', day).format("dddd")}</DayName>
                                <SwitcherWrapper>
                                    <SwitcherLabel>OFF</SwitcherLabel>
                                    <Switch
                                        onChange={handleSwitch(day)}
                                        checked={checked}
                                        disabled={!workingDays.includes(day)}
                                        color="primary"
                                    />
                                    <SwitcherLabel>ON</SwitcherLabel>
                                </SwitcherWrapper>
                                <PickersWrapper>
                                    <TimeSelect
                                        disableClearable
                                        error={
                                            formIsChecked && scheduleItem?.isOnSchedule
                                            && (dayjs(scheduleItem.to, timeSpanString).isSameOrBefore(dayjs(scheduleItem.from, timeSpanString), 'minute')
                                                || dayjs(scheduleItem.from, timeSpanString).isBefore(dayjs(schedule?.from, timeSpanString), 'minute')
                                                || dayjs(scheduleItem.from, timeSpanString).isAfter(dayjs(schedule?.to, timeSpanString), 'minute'))
                                        }
                                        disabled={!checked || !workingDays.includes(day)}
                                        start={schedule?.from ?? ""}
                                        end={schedule?.to ?? ""}
                                        value={scheduleItem?.from}
                                        onChange={(value) => onTimeChange(day, 'from', value)}/>
                                    <div>TO</div>
                                    <TimeSelect
                                        disableClearable
                                        error={
                                            formIsChecked && scheduleItem?.isOnSchedule
                                            && (dayjs(scheduleItem.to, timeSpanString).isSameOrBefore(dayjs(scheduleItem.from, timeSpanString), 'minute')
                                                || dayjs(scheduleItem.to, timeSpanString).isAfter(dayjs(schedule?.to, timeSpanString), 'minute')
                                                || dayjs(scheduleItem.to, timeSpanString).isBefore(dayjs(schedule?.from, timeSpanString), 'minute'))
                                        }
                                        disabled={!checked || !workingDays.includes(day)}
                                        start={schedule?.from ?? ""}
                                        end={schedule?.to ?? ""}
                                        value={scheduleItem?.to}
                                        onChange={(value) => onTimeChange(day, 'to', value)}/>
                                </PickersWrapper>
                            </RowWrapper>
                        })}
                    </>
                }
            </DialogContent>
            <DialogActions>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <LoadingButton
                            loading={loading || employeesLoading}
                            onClick={onCancel}
                            variant="text"
                            style={{marginRight: 20}}
                            color="info">
                            Close
                        </LoadingButton>
                        <LoadingButton
                            loading={loading || employeesLoading}
                            onClick={onSave}
                            className={classes.saveButton}>
                            Save
                        </LoadingButton>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default EmployeeTimeScheduleSetUp;