import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import moment from "moment";
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {TimeSlotCard} from "./TimeSlotCard";
import {styled} from "@material-ui/core";
import {Loading} from "../../UI/Loading";
import {TGroupedAppointment} from "../../../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import ReactGA from "react-ga4";
//import ReactGA from "react-ga";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {
    loadHoursOfOperations,
    setSideBarSteps,
    setTransportation
} from "../../../store/reducers/appointmentFrameReducer/actions";

const TimeSlotsWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "20px 12px",
    alignItems: "center",
    justifyContent: "center",
    "&>div": {
        flexGrow: 1
    },
    [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "repeat(5, 1fr)"
    },
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "repeat(4, 1fr)"
    },
    [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "repeat(2, 1fr)"
    }
}));

const useStyles = makeStyles(theme => ({
    wrapper: {
        maxHeight: '40vh',
        overflowY: "auto",
        [theme.breakpoints.down("xs")]: {
            maxHeight: '30vh',
        }
    }
}))

export type TSlot = {
    date: moment.Moment;
    label: string;
}

type TProps = {
    date: moment.Moment;
    loading: boolean;
    appointments?: TGroupedAppointment;
}

export const AppointmentTimeSelector: React.FC<TProps> =
    ({date, loading, appointments}) => {
        const {appointment: selectedAppointment, scProfile} = useSelector((state: RootState) => state.appointment);
        const {selectedTiming, gap, hoursOfOperations, sideBarSteps} = useSelector((state : RootState) => state.appointmentFrame);
        const dispatch = useDispatch();
        const firstCardRef = useRef<HTMLDivElement|null>(null);
        const classes = useStyles();
        const {t} = useTranslation();

        useEffect(() => {
            if (firstCardRef?.current && date) firstCardRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
        }, [date, firstCardRef])

        useEffect(() => {
            if (scProfile) {
                dispatch(loadHoursOfOperations(scProfile.id))
            }
        }, [scProfile])

        const slots: TSlot[] = useMemo(() => {
            const slots: TSlot[] = [];
            const currentSCSchedule = hoursOfOperations.find(item => item.dayOfWeek === moment(date).day())
            if (gap && currentSCSchedule) {
                const [startHours, startMinutes] = currentSCSchedule.from.split(':');
                const [endHours, endMinutes] = currentSCSchedule.to.split(':');
                let start = moment.utc(date).hour(+startHours).minutes(+startMinutes).second(0).millisecond(0);
                const end  = moment.utc(date).hour(+endHours).minutes(+endMinutes).second(0).millisecond(0);
                let cDate = moment.utc(start);
                while (cDate.isSameOrBefore(end, 'minute')) {
                    slots.push({date: moment.utc(cDate), label: cDate.format("h:mm a")});
                    cDate = moment.utc(cDate).add(gap, 'minutes');
                }
            }
            return slots;
        }, [date, appointments, gap]);

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
            dispatch(setTransportation(null));
            handleSideBar();
        }, [selectedTiming])

        return (
            <div className={classes.wrapper}>
                <h4 ref={firstCardRef}>{t("Select Time")}</h4>
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