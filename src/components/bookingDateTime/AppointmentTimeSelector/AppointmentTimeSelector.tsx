import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {TimeSlotCard} from "../TimeSlotCard/TimeSlotCard";
import {Loading} from "../../wrappers/Loading/Loading";
import {TGroupedAppointment} from "../../../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";
import {
    loadHoursOfOperations,
    setSideBarSteps,
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TSlot} from "../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/types";
import {TimeSlotsWrapper} from "./styles";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";
import {useTimeSelectorStyles} from "../../../hooks/styling/useTmeSelectorStyles";

type TProps = {
    date: TParsableDate;
    loading: boolean;
    appointments?: TGroupedAppointment;
}

const sortAppointments = (a: IRemappedAppointmentSlot, b: IRemappedAppointmentSlot) => {
    return dayjs(a.date).isAfter(b.date) ? 1 : -1
}

export const AppointmentTimeSelector: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> =
    ({date, loading, appointments}) => {
        const {
            appointment: selectedAppointment,
            scProfile,
            customerLoadedData,
        } = useSelector((state: RootState) => state.appointment);
        const {
            selectedTiming,
            gap,
            hoursOfOperations,
            sideBarSteps,
            appointmentByKey,
            trackerData} = useSelector((state : RootState) => state.appointmentFrame);
        const dispatch = useDispatch();
        const titleRef = useRef<HTMLDivElement|null>(null);
        const { classes  } = useTimeSelectorStyles();
        const {t} = useTranslation();

        useEffect(() => {
            if (scProfile) {
                dispatch(loadHoursOfOperations(scProfile.id))
            }
        }, [scProfile])

        const handleSelect = useCallback((a: IRemappedAppointmentSlot|null) => {
            const data = a && selectedTiming ? {...a, timingType: selectedTiming} : a;
            handleGA(a);
            dispatch(selectAppointment(data));
            if (!customerLoadedData?.isUpdating && !appointmentByKey) {
                handleSideBar();
            }
        }, [selectedTiming])

        useEffect(() =>{
            const utcOffset = dayjs().utcOffset();
            const dateWithOffset = dayjs().add(utcOffset, 'minute')
            if (appointments?.appointments) {
                const sorted = appointments?.appointments.sort(sortAppointments);
                const firstAvailableSlot = sorted.find(slot => {
                    return dayjs(slot?.date).isSame(dayjs.utc(date), 'day')
                        && dayjs(slot?.date).isAfter(dayjs.utc(dateWithOffset))
                })
                firstAvailableSlot && handleSelect(firstAvailableSlot);
            }
        }, [date, appointments?.appointments])

        const generateSlots = (startHours: number|string, startMinutes: number|string, endHours: number|string, endMinutes: number|string): TSlot[] => {
            const slots: TSlot[] = [];
            let start = dayjs.utc(date).hour(+startHours).minute(+startMinutes).second(0).millisecond(0);
            const end  = dayjs.utc(date).hour(+endHours).minute(+endMinutes).second(0).millisecond(0);
            let cDate = dayjs.utc(start);
            while (dayjs(cDate).isSameOrBefore(end, 'minute')) {
                slots.push({date: dayjs.utc(cDate), label: dayjs.utc(cDate).format("h:mm a")});
                cDate = dayjs.utc(cDate).add(gap ?? 0, 'minute');
            }
            return slots;
        }

        const slots: TSlot[] = useMemo(() => {
            let slots: TSlot[] = [];
            const currentSCSchedule = hoursOfOperations.find(item => item.dayOfWeek === dayjs(date).day())
            if (gap) {
                if (currentSCSchedule) {
                    const [startHours, startMinutes] = currentSCSchedule.from.split(':');
                    const [endHours, endMinutes] = currentSCSchedule.to.split(':');
                    slots = generateSlots(startHours, startMinutes, endHours, endMinutes)
                } else if (hoursOfOperations.length) {
                    const [startHours, startMinutes] = hoursOfOperations[0].from.split(':');
                    const [endHours, endMinutes] = hoursOfOperations[0].to.split(':');
                    slots = generateSlots(startHours, startMinutes, endHours, endMinutes)
                } else {
                    slots = generateSlots(8, 0, 17, 0)
                }
            }
            return slots;
        }, [date, appointments, gap, hoursOfOperations]);

        const handleGA = useCallback((a: IRemappedAppointmentSlot|null) => {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Clicked on Appointment Slot',
                label: a?.price?.value ? `With Price $${a.price.value}` : '',
            }, trackerData.ids);
        }, [trackerData])

        const handleSideBar = () => {
            const index = sideBarSteps.indexOf("appointmentSelection");
            if (index > -1) {
                const slicedSteps = sideBarSteps.slice(0, index + 1);
                dispatch(setSideBarSteps(slicedSteps))
            }
        }

        return (
            <div className={classes.wrapper}>
                <div className={classes.titleWrapper}>
                    <h4 ref={titleRef} className={classes.title}>{t("Select Time")}</h4>
                    <div>{dayjs(date).format("ddd")}, <span className={classes.boldText}>{dayjs(date).format('MMM DD')}</span></div>
                </div>
                {!loading
                    ? <TimeSlotsWrapper>
                        {slots.map((timeSlot) => {
                            const appointment = appointments?.appointments.find(
                                a => dayjs.utc(a.date).isSame(timeSlot.date, 'minute')
                            );
                            return <TimeSlotCard
                                date={date}
                                slot={appointment}
                                onSelect={handleSelect}
                                selected={Boolean(
                                    selectedAppointment && appointment?.id === selectedAppointment.id
                                )}
                                timeSlot={timeSlot}
                                key={timeSlot.label}
                            />
                        })}
                    </TimeSlotsWrapper>
                    : <Loading/>}
            </div>
        );
    };