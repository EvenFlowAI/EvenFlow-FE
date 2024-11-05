import React, {useEffect, useMemo, useState} from 'react';
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {TableRowDataType, TParsableDate} from "../../../../types/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import dayjs from "dayjs";
import {Switch} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {IScheduleByDate, IUpdateByDateRequest} from "../../../../store/reducers/schedules/types";
import {SwitcherLabel, SwitcherWrapper} from "./styles";
import {CALENDAR_FORMAT, timeSpanString} from "../../../../utils/constants";
import {loadHoursOfOperations} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {Table} from "../../../../components/tables/Table/Table";
import {useActionButtonsStyles} from "../../../../hooks/styling/useActionButtonsStyles";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";
import {updateScheduleByDate} from "../../../../store/reducers/schedules/actions";
import {useException} from "../../../../hooks/useException/useException";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import EmployeeScheduleFilters from "../EmployeeScheduleFilters/EmployeeScheduleFilters";
import {TFilters} from "../types";
import {compareName} from "./utils";
import {initialFilters} from "./constants";
import TimeBlock from "./TimeBlock/TimeBlock";

type TProps = DialogProps & {date: TParsableDate, disabledDate: boolean, startDate?: TParsableDate, endDate?: TParsableDate}

const EmployeeScheduleModal: React.FC<TProps> = ({
                                                     date,
                                                     open,
                                                     onClose,
                                                     disabledDate,
                                                     startDate,
                                                     endDate,
                                                 }) => {
    const {hoursOfOperations} = useSelector((state: RootState) => state.appointmentFrame);
    const {scheduleByDate, employeesLoading} = useSelector((state: RootState) => state.employeesSchedule);
    const {loading} = useSelector((state: RootState) => state.employees);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isForWeek, setForWeek] = useState<boolean>(false);
    const [formIsChecked, setFormChecked] = useState<boolean>(false);
    const [currentSchedule, setCurrentSchedule] = useState<IScheduleByDate[]>([]);
    const [filters, setFilters] = useState<TFilters>(initialFilters);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException()
    const {classes} = useActionButtonsStyles();

    const schedule = useMemo(() => {
        return hoursOfOperations.find(el => el.dayOfWeek === dayjs(date).day());
    }, [hoursOfOperations, date])

    const sorted = useMemo(() => scheduleByDate.map(el => ({...el, id: `${Math.random()}`})).sort(compareName),
        [scheduleByDate])

    useEffect(() => {
        if (selectedSC) dispatch(loadHoursOfOperations(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        setCurrentSchedule(sorted)
    }, [sorted])

    useEffect(() => {
        setLoading(true)
        setCurrentSchedule(() => {
            const filtered = sorted.filter(el => {
                return el.employeeName.toLowerCase().includes(filters.name.trim().toLowerCase())
                    && el.role.toLowerCase().startsWith(filters.role.trim().toLowerCase())
            })
            return filtered.filter(el => filters.serviceBook?.length
                ? el.serviceBooks.includes(filters.serviceBook.trim())
                : true)
        })
        setLoading(false)
    }, [filters, sorted])

    const handleShowOnBookingChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setForWeek(checked)
    }

    const onCancel = () => {
        onClose()
        setLoading(true)
        setFormChecked(false)
        setFilters(initialFilters);
        setLoading(false)
    }

    const handleSwitch = (el: IScheduleByDate) => (e: any, value: boolean) => {
        setFormChecked(false)
        setCurrentSchedule(prev => {
            const itemToUpdate = prev
                .find(item => item.id === el.id);
            if (itemToUpdate) {
                const updated = {...itemToUpdate, isOnSchedule: value};
                const filtered = prev
                    .filter(item => item.id !== el.id)
                return [...filtered, updated].sort(compareName)
            }
            return prev;
        })
    }

    const onTimeChange = (el: IScheduleByDate, field: "startAt" | "finishAt", value: string) => {
        setFormChecked(false)
        setCurrentSchedule(prev => {
            let element = prev
                .find(item => item.id === el.id);
            if (element) {
                element = {...element, [field]: value}
                const filtered = prev
                    .filter(item => item.id !== el.id)
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
            header: "Service Books",
            val: el => el.serviceBooks.join(', ')
        },
        {
            header: "On Schedule",
            val: el => {
                return <SwitcherWrapper>
                    <SwitcherLabel>NO</SwitcherLabel>
                    <Switch
                        disabled={disabledDate}
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
            val: el => <TimeBlock
                onTimeChange={onTimeChange}
                el={el}
                schedule={schedule}
                disabledDate={disabledDate}
                formIsChecked={formIsChecked}/>
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
        if (!filtered.every(item => dayjs(item.finishAt, timeSpanString).isAfter(dayjs(item.startAt, timeSpanString), 'minute'))) {
            valid = false;
            showError('"End" value must be later than "Start"')
        }
        if (!filtered.every(item => dayjs(item.finishAt, timeSpanString).isSameOrBefore(dayjs(schedule?.to, timeSpanString), 'minute'))
            || !filtered.every(item => dayjs(item.finishAt, timeSpanString).isSameOrAfter(dayjs(schedule?.from, timeSpanString), 'minute'))) {
            valid = false;
            showError('"End" value must be inside of the Hours Of Operations')
        }
        if (!filtered.every(item => dayjs(item.startAt, timeSpanString).isSameOrAfter(dayjs(schedule?.from, timeSpanString), 'minute'))
            || !filtered.every(item => dayjs(item.startAt, timeSpanString).isSameOrBefore(dayjs(schedule?.to, timeSpanString), 'minute'))) {
            valid = false;
            showError('"Start" value must be inside of the Hours Of Operations')
        }
        return valid
    }

    const onError = (err: any) => {
        setLoading(false)
        showError(err)
    }

    const onSave = () => {
        setFormChecked(true)
        setLoading(true)
        if (checkIsValid()) {
            if (selectedSC && startDate && endDate) {
                const utcOffset = dayjs().utcOffset()
                const start = dayjs(startDate).startOf("day").add(utcOffset, 'minute').format(CALENDAR_FORMAT)
                const end = dayjs(endDate).endOf("day").subtract(utcOffset, 'minute').format(CALENDAR_FORMAT)
                const ids = currentSchedule.map(el => el.id);
                const filtered = sorted.filter(el => !ids.includes(el.id))
                const filteredData = filtered.map(({isOnSchedule, employeeId, startAt, finishAt}) => ({
                    isOnSchedule,
                    employeeId,
                    startAt,
                    finishAt
                }))
                const currentData = currentSchedule.map(
                    ({isOnSchedule, employeeId, startAt, finishAt}) => ({
                        isOnSchedule,
                        employeeId,
                        startAt,
                        finishAt
                    }))
                const data: IUpdateByDateRequest = {
                    date: dayjs(date).format(CALENDAR_FORMAT),
                    serviceCenterId: selectedSC.id,
                    isSetForWeek: isForWeek,
                    employeeScheduledHours: [...filteredData, ...currentData],
                }
                dispatch(updateScheduleByDate(data, start, end, onCancel, onError))
            }
        } else {
            setLoading(false)
        }
    }

    return (
        <BaseModal open={open} onClose={onCancel} width={1050}>
            <DialogTitle onClose={onCancel}>Employee Schedule: {dayjs(date).format("dddd, MMMM D, YYYY")}</DialogTitle>
            <DialogContent style={{padding: "12px 32px"}}>
                {loading || isLoading || employeesLoading
                    ? <Loading/>
                    :  <>
                        <EmployeeScheduleFilters
                            isLoading={employeesLoading || loading || isLoading}
                            filters={filters}
                            setFilters={setFilters}/>
                        <Table<IScheduleByDate>
                            data={currentSchedule}
                            index={"id"}
                            isLoading={employeesLoading || loading || isLoading}
                            hidePagination
                            rowData={rowData}/>
                    </>}
                {/*<FormControlLabel*/}
                {/*    style={{width: '35%', display: 'flex', justifyContent: 'space-between', marginBottom: 20}}*/}
                {/*    labelPlacement="start"*/}
                {/*    control={*/}
                {/*        <Switch*/}
                {/*            name="name"*/}
                {/*            onChange={handleShowOnBookingChange}*/}
                {/*            checked={isForWeek}*/}
                {/*            color="primary"/>*/}
                {/*    }*/}
                {/*    label={<span style={{fontWeight: 'bold', textTransform: 'uppercase', fontSize: 14}}>Apply changes to entire week</span>}/>*/}

            </DialogContent>
            <DialogActions>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <LoadingButton
                            loading={employeesLoading || loading}
                            onClick={onCancel}
                            variant="text"
                            style={{marginRight: 20}}
                            color="info">
                            Close
                        </LoadingButton>
                        <LoadingButton
                            loading={employeesLoading || loading}
                            onClick={onSave}
                            disabled={disabledDate}
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