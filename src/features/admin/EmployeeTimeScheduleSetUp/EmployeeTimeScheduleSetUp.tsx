import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {IEmployeeRoleHours, TDaySchedule} from "../../../store/reducers/employees/types";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {loadBaseEmployeeSchedule} from "../../../store/reducers/employees/actions";
import {loadWorkingDays} from "../../../store/reducers/serviceCenters/actions";
import {DayName, PickersWrapper, RowWrapper, SwitcherLabel, SwitcherWrapper, UserWrapper} from "./styles";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import dayjs from "dayjs";
import {Switch} from "@mui/material";
import TimeSelect from "../../../components/pickers/TimeSelect/TimeSelect";
import {loadHoursOfOperations} from "../../../store/reducers/appointmentFrameReducer/actions";

type TProps = DialogProps & {
    editingItem: IEmployeeRoleHours | null;
}

const daysList = [1, 2, 3, 4, 5, 6, 7]

const EmployeeTimeScheduleSetUp: React.FC<TProps> = ({open, onClose, editingItem}) => {
    const {employeeSchedule, loading} = useSelector((state: RootState) => state.employees);
    const {workingDays} = useSelector((state: RootState) => state.serviceCenters);
    const {hoursOfOperations} = useSelector((state: RootState) => state.appointmentFrame);
    const [currentSchedule, setCurrentSchedule] = useState<TDaySchedule[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (editingItem && selectedSC && open) {
            dispatch(loadBaseEmployeeSchedule(selectedSC.id, editingItem.employeeId, editingItem.serviceBookId ?? undefined))
            dispatch(loadWorkingDays(selectedSC.id))
            dispatch(loadHoursOfOperations(selectedSC.id))
        }
    }, [selectedSC, editingItem, open])

    useEffect(() => {
        if (employeeSchedule) {
            setCurrentSchedule(daysList.map(dayNumber => {
                const existingSchedule = employeeSchedule.dayOfWeekSchedules
                    .find(el => el.dayOfWeek === dayNumber)
                const schedule = hoursOfOperations.find(el => el.dayOfWeek === dayNumber);
                return existingSchedule ? {...existingSchedule, isEnabled: true} : {
                    dayOfWeek: dayNumber,
                    from: schedule?.from ?? "09:00:00",
                    to: schedule?.to ?? "17:00:00",
                    isEnabled: false,
                }
            }))
        } else {
            // todo delete mock
            setCurrentSchedule(daysList.map(dayNumber => {
                const schedule = hoursOfOperations.find(el => el.dayOfWeek === dayNumber);
                return {
                    dayOfWeek: dayNumber,
                    from: schedule?.from ?? "09:00:00",
                    to: schedule?.to ?? "17:00:00",
                    isEnabled: false,
                }
            }))
        }
    }, [employeeSchedule, hoursOfOperations])

    const handleSwitch = (day: number) => (e: any, value: boolean) => {
        setCurrentSchedule(prev => {
            const data = [...prev];
            let element = data.find(el => el.dayOfWeek === day);
            if (element) {
                element = {...element, isEnabled: value}
                const filtered = data.filter(item => item.dayOfWeek !== day)
                return [...filtered, element].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            }
            return prev;
        })
    }

    const onTimeChange = (day: number, field: "from" | "to", value: string) => {
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

    return (
        <BaseModal open={open} onClose={onClose} width={780}>
            <DialogTitle onClose={onClose}>Employee Time Schedule Set Up</DialogTitle>
            <DialogContent>
                {loading ?
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
                    const checked = scheduleItem?.isEnabled
                    return <RowWrapper>
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
                                disabled={!checked || !workingDays.includes(day)}
                                start={schedule?.from ?? "09:00:00"}
                                end={schedule?.to ?? "17:00:00"}
                                value={scheduleItem?.from}
                                onChange={(value) => onTimeChange(day, 'from', value)}/>
                            <div>TO</div>
                            <TimeSelect
                                disabled={!checked || !workingDays.includes(day)}
                                start={schedule?.from ?? "09:00:00"}
                                end={schedule?.to ?? "17:00:00"}
                                value={scheduleItem?.to}
                                onChange={(value) => onTimeChange(day, 'to', value)}/>
                        </PickersWrapper>
                    </RowWrapper>
                })}
                    </>
                }
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </BaseModal>
    );
};

export default EmployeeTimeScheduleSetUp;