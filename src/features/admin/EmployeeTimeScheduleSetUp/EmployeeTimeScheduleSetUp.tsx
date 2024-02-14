import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {IEmployeeRoleHours, TDaySchedule} from "../../../store/reducers/employees/types";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {loadBaseEmployeeSchedule} from "../../../store/reducers/employees/actions";
import {loadWorkingDays} from "../../../store/reducers/serviceCenters/actions";
import {loadHoursOfOperations} from "../../../store/reducers/slotScoring/actions";
import {DayName, PickersWrapper, RowWrapper, SwitcherLabel, UserWrapper} from "./styles";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import dayjs from "dayjs";
import {Switch} from "@mui/material";
import TimeSelect from "../../../components/pickers/TimeSelect/TimeSelect";

type TProps = DialogProps & {
    payload: IEmployeeRoleHours|null;
}

const daysList = [1, 2, 3, 4, 5, 6, 7]

const EmployeeTimeScheduleSetUp: React.FC<TProps> = ({open, onClose, payload}) => {
    const {employeeSchedule, loading} = useSelector((state: RootState) => state.employees)
    const [currentSchedule, setCurrentSchedule] = useState<TDaySchedule[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (payload && selectedSC) {
            dispatch(loadBaseEmployeeSchedule(selectedSC.id, payload.employeeId, payload.serviceBookId ?? undefined))
            dispatch(loadWorkingDays(selectedSC.id))
            dispatch(loadHoursOfOperations(selectedSC.id))
        }
    }, [selectedSC, payload])

    useEffect(() => {
        if (employeeSchedule) {
            setCurrentSchedule(daysList.map(dayNumber => {
                const existingSchedule = employeeSchedule.dayOfWeekSchedules
                    .find(el => el.dayOfWeek === dayNumber)
                return existingSchedule ? {...existingSchedule, isEnabled: true} : {
                    dayOfWeek: dayNumber,
                    from: "08:00:00",
                    to: "18:00:00",
                    isEnabled: false,
                }
            }))
        }
    }, [employeeSchedule])

    const handleSwitch = (day: number) => (e: any, value: boolean) => {
        setCurrentSchedule(prev => {
            const data = [...prev];
            let element = data.find(el => el.dayOfWeek === day);
            if (element) {
                element = {...element, isEnabled: value}
                const filtered = data.filter(item => item.dayOfWeek === day)
                return [...filtered, element].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            }
            return prev;
        })
    }

    const onTimeChange = () => {

    }

    const onPeriodChange = () => {

    }

    return (
        <BaseModal open={open} onClose={onClose}>
            <DialogTitle onClose={onClose}>Employee Time Schedule Set Up</DialogTitle>
            <DialogContent>
                {loading ?
                    <Loading/>
                    : <>
                    <UserWrapper>
                    <div>{employeeSchedule?.employeeName}</div>
                    <div>{employeeSchedule?.role}</div>
                    <div>{employeeSchedule?.serviceBook ?? null}</div>
                </UserWrapper>
                {daysList.map(day => {
                    const scheduleItem = currentSchedule.find(el => el.dayOfWeek === day)
                    const checked = scheduleItem?.isEnabled
                    return <RowWrapper>
                        <DayName>{dayjs().set('day', day).format("ddd")}</DayName>
                        <div>
                            <SwitcherLabel>OFF</SwitcherLabel>
                            <Switch
                                onChange={handleSwitch(day)}
                                checked={checked}
                                color="primary"
                            />
                            <SwitcherLabel>ON</SwitcherLabel>
                        </div>
                        <PickersWrapper>
                            <TimeSelect
                                start={"08:00"}
                                end={"18:00"}
                                value={scheduleItem?.from}
                                onChange={onTimeChange}
                                period={"am"}
                                onPeriodChange={onPeriodChange}/>
                            <div>TO</div>
                            <TimeSelect
                                start={"08:00"}
                                end={"18:00"}
                                value={scheduleItem?.to}
                                onChange={onTimeChange}
                                period={"pm"}
                                onPeriodChange={onPeriodChange}/>
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