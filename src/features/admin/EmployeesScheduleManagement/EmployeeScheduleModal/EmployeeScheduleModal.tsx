import React, {useEffect, useMemo, useState} from 'react';
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {TableRowDataType, TParsableDate} from "../../../../types/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import dayjs from "dayjs";
import {FormControlLabel, Switch} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {IScheduleByDate, IUpdateByDateRequest} from "../../../../store/reducers/schedules/types";
import {SwitcherLabel, SwitcherWrapper} from "./styles";
import TimeSelect from "../../../../components/pickers/TimeSelect/TimeSelect";
import {timeSpanString} from "../../../../utils/constants";
import {PickersWrapper} from "../../EmployeeTimeScheduleSetUp/styles";
import {loadHoursOfOperations} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {Table} from "../../../../components/tables/Table/Table";
import {useActionButtonsStyles} from "../../../../hooks/styling/useActionButtonsStyles";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";
import {updateScheduleByDate} from "../../../../store/reducers/schedules/actions";
import {useException} from "../../../../hooks/useException/useException";

type TProps = DialogProps & {date: TParsableDate}

const compareName = (a: IScheduleByDate, b: IScheduleByDate) => a.employeeName.localeCompare(b.employeeName)

const EmployeeScheduleModal: React.FC<TProps> = ({date, open, onClose}) => {
    const {hoursOfOperations} = useSelector((state: RootState) => state.appointmentFrame);
    const {scheduleByDate, employeesLoading} = useSelector((state: RootState) => state.employeesSchedule);
    const [isForWeek, setForWeek] = useState<boolean>(false);
    const [formIsChecked, setFormChecked] = useState<boolean>(false);
    const [currentSchedule, setCurrentSchedule] = useState<IScheduleByDate[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException()
    const schedule = useMemo(() => {
        return hoursOfOperations.find(el => el.dayOfWeek === dayjs(date).day());
    }, [hoursOfOperations, date])
    const {classes} = useActionButtonsStyles();

    useEffect(() => {
        if (selectedSC) dispatch(loadHoursOfOperations(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        if (open) setCurrentSchedule([...scheduleByDate].sort(compareName))
    }, [scheduleByDate, open])

    const handleShowOnBookingChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setForWeek(checked)
    }

    const onCancel = () => {
        setFormChecked(false)
        setCurrentSchedule([...scheduleByDate].sort(compareName))
        onClose()
    }

    const handleSwitch = (el: IScheduleByDate) => (e: any, value: boolean) => {
        setFormChecked(false)
        setCurrentSchedule(prev => {
            const itemToUpdate = prev
                .find(item => item.employeeId === el.employeeId && item.serviceBookId === el.serviceBookId);
            if (itemToUpdate) {
                const updated = {...itemToUpdate, isOnSchedule: value};
                const filtered = prev
                    .filter(item => item.employeeId !== el.employeeId)
                return [...filtered, updated].sort(compareName)
            }
            return prev;
        })
    }

    const onTimeChange = (el: IScheduleByDate, field: "startAt" | "finishAt", value: string) => {
        setFormChecked(false)
        setCurrentSchedule(prev => {
            let element = prev
                .find(item => el.employeeId === item.employeeId && el.serviceBookId === item.serviceBookId);
            if (element) {
                element = {...element, [field]: value}
                const filtered = prev
                    .filter(item => item.employeeId !== el.employeeId)
                return [...filtered, element].sort(compareName)
            }
            return prev
        })
    }

    const rowData: TableRowDataType<IScheduleByDate>[] = [
        {
            header: "Employee",
            val: el => el.employeeName
        },
        {
            header: "Role",
            val: el => el.role
        },
        {
            header: "Service Book",
            val: el => el.serviceBook
        },
        {
            header: "On Schedule",
            val: el => {
                return <SwitcherWrapper>
                    <SwitcherLabel>NO</SwitcherLabel>
                    <Switch
                        onChange={handleSwitch(el)}
                        checked={el.isOnSchedule}
                        color="primary"
                    />
                    <SwitcherLabel>YES</SwitcherLabel>
                </SwitcherWrapper>
            }
        },
        {
            header: "Scheduled Hours",
            val: el => (
                <PickersWrapper>
                    <TimeSelect
                        error={formIsChecked && el.isOnSchedule
                            && (!el.startAt
                                || dayjs(el.finishAt, timeSpanString).isSameOrBefore(dayjs(el.startAt, timeSpanString)))}
                        disabled={!el.isOnSchedule}
                        start={schedule?.from ?? "09:00:00"}
                        end={schedule?.to ?? "17:00:00"}
                        value={el.startAt}
                        onChange={(value) => onTimeChange(el, 'startAt', value)}/>
                    <div>TO</div>
                    <TimeSelect
                        error={formIsChecked && el.isOnSchedule
                            && (!el.finishAt
                                || dayjs(el.finishAt, timeSpanString).isSameOrBefore(dayjs(el.startAt, timeSpanString)))}
                        disabled={!el.isOnSchedule}
                        start={schedule?.from ?? "09:00:00"}
                        end={schedule?.to ?? "17:00:00"}
                        value={el.finishAt}
                        onChange={(value) => onTimeChange(el, 'finishAt', value)}/>
                </PickersWrapper>
            )
        },
    ]

    const checkIsValid = (): boolean => {
        let valid = true;
        const filtered = currentSchedule
            .filter(item => item.isOnSchedule)
        if (!filtered.every(item => item.finishAt && item.startAt)) {
            valid = false;
            showError('Schedule for Employee that is "On Schedule" must not be empty')
        }
        if (!filtered.every(item => dayjs(item.finishAt, timeSpanString).isAfter(dayjs(item.startAt, timeSpanString)))) {
            valid = false;
            showError('"End" value must be later than "Start"')
        }
        return valid
    }

    const onSave = () => {
        setFormChecked(true)
        if (selectedSC && checkIsValid()) {
            const utcOffset = dayjs().utcOffset()
            const data: IUpdateByDateRequest = {
                date: dayjs(date).startOf('day').add(utcOffset, 'minute').toISOString(),
                serviceCenterId: selectedSC.id,
                isSetForWeek: isForWeek,
                employeeScheduledHours: currentSchedule.map(
                    ({isOnSchedule, employeeId, serviceBookId, startAt, finishAt}) => ({
                        isOnSchedule,
                        employeeId,
                        serviceBookId,
                        startAt,
                        finishAt
                    }))
            }
            dispatch(updateScheduleByDate(data, onCancel, showError))
        }
    }

    return (
        <BaseModal open={open} onClose={onCancel} width={1050}>
            <DialogTitle onClose={onCancel}>Employee Schedule: {dayjs(date).format("dddd, MMMM D, YYYY")}</DialogTitle>
            <DialogContent style={{padding: "12px 32px"}}>
                <FormControlLabel
                    style={{width: '35%', display: 'flex', justifyContent: 'space-between', marginBottom: 20}}
                    labelPlacement="start"
                    control={
                        <Switch
                            name="name"
                            onChange={handleShowOnBookingChange}
                            checked={isForWeek}
                            color="primary"/>
                    }
                    label={<span style={{fontWeight: 'bold', textTransform: 'uppercase', fontSize: 14}}>Apply changes to entire week</span>}/>
                <Table<IScheduleByDate>
                    data={currentSchedule}
                    index={"employeeId"}
                    isLoading={employeesLoading}
                    hidePagination
                    rowData={rowData}/>
            </DialogContent>
            <DialogActions>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <LoadingButton
                            loading={employeesLoading}
                            onClick={onCancel}
                            variant="text"
                            style={{marginRight: 20}}
                            color="info">
                            Close
                        </LoadingButton>
                        <LoadingButton
                            loading={employeesLoading}
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

export default EmployeeScheduleModal;