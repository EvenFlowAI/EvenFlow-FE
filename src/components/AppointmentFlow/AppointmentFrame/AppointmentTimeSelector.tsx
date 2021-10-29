import React, {useMemo} from 'react';
import moment from "moment";
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {TimeSlotCard} from "./TimeSlotCard";
import {styled} from "@material-ui/core";
import {Loading} from "../../UI/Loading";
import {TGroupedAppointment} from "../../../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import ReactGA from "react-ga";
import {makeStyles} from "@material-ui/core/styles";


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

type TSlot = {
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
    const selectedAppointment = useSelector((state: RootState) => state.appointment.appointment);
    const selectedTiming = useSelector((state : RootState) => state.appointmentFrame.selectedTiming);
    const dispatch = useDispatch();
    const classes = useStyles();

    const slots: TSlot[] = useMemo(() => {
        // TODO: Start end dates?
        const start = moment.utc(date).hour(7).minute(0).second(0).millisecond(0);
        const end = moment.utc(start).hour(18);
        const slots: TSlot[] = [];
        let cDate = moment.utc(start);
        while (cDate.isSameOrBefore(end, 'minute')) {
            slots.push({date: moment.utc(cDate), label: cDate.format("h:mm a")});
            cDate = moment.utc(cDate).add(30, 'minutes');
        }
        return slots;
    }, [date]);

    const handleSelect = (a: IRemappedAppointmentSlot|null) => {
        const data = a && selectedTiming ? {...a, timingType: selectedTiming} : a;
        ReactGA.event({
            category: 'User',
            action: 'Clicked on Appointment Slot',
            label: a?.price?.value ? `With Price ${a?.price?.value}` : ''
        });
        dispatch(selectAppointment(data));
    }

    return (
        <div className={classes.wrapper}>
            <h4>Select Time</h4>
            {!loading
                ? <TimeSlotsWrapper>
                    {slots.map(timeSlot => {
                        const appointment = appointments?.appointments.find(
                            a => a.date.isSame(timeSlot.date, 'minute')
                        );
                        return <TimeSlotCard
                            slot={appointment}
                            onSelect={handleSelect}
                            selected={Boolean(
                                selectedAppointment && appointment?.id === selectedAppointment.id
                            )}
                            timeSlot={timeSlot.label}
                            key={timeSlot.label}
                        />
                    })}
                </TimeSlotsWrapper>
                : <Loading/>}
        </div>
    );
};