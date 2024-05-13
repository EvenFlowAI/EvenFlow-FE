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
    setTransportation
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TSlot} from "../../../features/booking/AppointmentFlow/AppointmentSlots/types";
import {TimeSlotsWrapper, useStyles} from "./styles";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";

type TProps = {
    date: TParsableDate;
    loading: boolean;
    appointments?: TGroupedAppointment;
}

export const AppointmentTimeSelector: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> =
    ({date, loading, appointments}) => {
        const {
            appointment: selectedAppointment,
            scProfile,
            customerLoadedData,
        } = useSelector((state: RootState) => state.appointment);
        const {selectedTiming, gap, hoursOfOperations, sideBarSteps, appointmentByKey} = useSelector((state : RootState) => state.appointmentFrame);
        const dispatch = useDispatch();
        const titleRef = useRef<HTMLDivElement|null>(null);
        const { classes  } = useStyles();
        const {t} = useTranslation();

        useEffect(() => {
            if (scProfile) {
                dispatch(loadHoursOfOperations(scProfile.id))
            }
        }, [scProfile])

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
            });
        }, [])

        const handleSideBar = () => {
            const index = sideBarSteps.indexOf("appointmentSelection");
            if (index > -1) {
                const slicedSteps = sideBarSteps.slice(0, index + 1);
                dispatch(setSideBarSteps(slicedSteps))
            }
        }

        const handleSelect = useCallback((a: IRemappedAppointmentSlot|null) => {
            const data = a && selectedTiming ? {...a, timingType: selectedTiming} : a;
            handleGA(a);
            dispatch(selectAppointment(data));
            if (!customerLoadedData?.isUpdating && !appointmentByKey) {
                // todo change logic
                dispatch(setTransportation(null));
                handleSideBar();
            }
        }, [selectedTiming])

        return (
            <div className={classes.wrapper}>
                <h4 ref={titleRef}>{t("Select Time")}</h4>
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