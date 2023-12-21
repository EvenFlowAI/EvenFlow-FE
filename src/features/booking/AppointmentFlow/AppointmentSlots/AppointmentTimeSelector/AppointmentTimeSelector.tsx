import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import moment from "moment";
import {IRemappedAppointmentSlot} from "../../../../../store/reducers/appointment/types";
import {TimeSlotCard} from "../TimeSlotCard/TimeSlotCard";
import {Loading} from "../../../../../components/Loading/Loading";
import {TGroupedAppointment} from "../../../../../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {selectAppointment} from "../../../../../store/reducers/appointment/actions";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";
import {
    loadHoursOfOperations,
    setSideBarSteps,
    setTransportation
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {TSlot} from "../types";
import {TimeSlotsWrapper, useStyles} from "./styles";

type TProps = {
    date: moment.Moment;
    loading: boolean;
    appointments?: TGroupedAppointment;
}

export const AppointmentTimeSelector: React.FC<TProps> =
    ({date, loading, appointments}) => {
        const {
            appointment: selectedAppointment,
            scProfile,
            customerLoadedData,
        } = useSelector((state: RootState) => state.appointment);
        const {selectedTiming, gap, hoursOfOperations, sideBarSteps, appointmentByKey} = useSelector((state : RootState) => state.appointmentFrame);
        const dispatch = useDispatch();
        const titleRef = useRef<HTMLDivElement|null>(null);
        const classes = useStyles();
        const {t} = useTranslation();

        useEffect(() => {
            if (scProfile) {
                dispatch(loadHoursOfOperations(scProfile.id))
            }
        }, [scProfile])

        const generateSlots = (startHours: number|string, startMinutes: number|string, endHours: number|string, endMinutes: number|string): TSlot[] => {
            const slots: TSlot[] = [];
            let start = moment.utc(date).hour(+startHours).minutes(+startMinutes).second(0).millisecond(0);
            const end  = moment.utc(date).hour(+endHours).minutes(+endMinutes).second(0).millisecond(0);
            let cDate = moment.utc(start);
            while (cDate.isSameOrBefore(end, 'minute')) {
                slots.push({date: moment.utc(cDate), label: cDate.format("h:mm a")});
                cDate = moment.utc(cDate).add(gap, 'minutes');
            }
            return slots;
        }

        const slots: TSlot[] = useMemo(() => {
            let slots: TSlot[] = [];
            const currentSCSchedule = hoursOfOperations.find(item => item.dayOfWeek === moment(date).day())
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
                                a => a.date.isSame(timeSlot.date, 'minute')
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