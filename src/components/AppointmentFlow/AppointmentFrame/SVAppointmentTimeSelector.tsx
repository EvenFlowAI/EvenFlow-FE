import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import moment from "moment";
import {IRemappedAppointmentSlot, IServiceValetAppointment} from "../../../store/reducers/appointment/types";
import {TimeSlotCard} from "./TimeSlotCard";
import {styled} from "@material-ui/core";
import {Loading} from "../../UI/Loading";
import {TGroupedAppointment} from "../../../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {selectAppointment, selectServiceValetAppointment} from "../../../store/reducers/appointment/actions";
//import ReactGA from "react-ga4";
import ReactGA from "react-ga";
import {makeStyles} from "@material-ui/core/styles";
import {loadSlotsGap} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useTranslation} from "react-i18next";
import {
    loadHoursOfOperations,
    setSideBarSteps,
    setTransportation
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {PickUpSlotCard} from "./PickUpSlotCard";

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

const PickUpSlotsWrapper = styled('div')(() => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px 12px",
    alignItems: "center",
    justifyContent: "stretch",
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

export type TPickUpSlot = {
    date: moment.Moment;
    label: string;
    pickUpStart: string;
    pickUpEnd: string;
    dropOffStart: string;
    dropOffEnd: string;
    available: number;
}

const mockPickUpSlots = [
    {
        date: moment(),
        label: '',
        pickUpStart: '8:00',
        pickUpEnd: '11.00',
        dropOffStart: '14.00',
        dropOffEnd: '17.00',
        available: 4
    },
    {
        date: moment(),
        label: '',
        pickUpStart: '8:00',
        pickUpEnd: '11.00',
        dropOffStart: '14.00',
        dropOffEnd: '17.00',
        available: 0
    },
    {
        date: moment(),
        label: '',
        pickUpStart: '8:00',
        pickUpEnd: '11.00',
        dropOffStart: '14.00',
        dropOffEnd: '17.00',
        available: 6
    }
]

type TProps = {
    date: moment.Moment;
    loading: boolean;
}

export const SVAppointmentTimeSelector: React.FC<TProps> =
    ({date, loading}) => {
        const {serviceValetAppointment: selectedAppointment, serviceValetSlots} = useSelector((state: RootState) => state.appointment);
        const {selectedTiming, sideBarSteps} = useSelector((state : RootState) => state.appointmentFrame);
        const dispatch = useDispatch();
        const firstCardRef = useRef<HTMLDivElement|null>(null);
        const classes = useStyles();
        const {t} = useTranslation();

        useEffect(() => {
            if (firstCardRef?.current && date) firstCardRef.current?.scrollIntoView();
        }, [date, firstCardRef])

        const handleGA = useCallback((a: IServiceValetAppointment|null) => {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Clicked on Service Valet Appointment Slot',
                label: a?.price?.value ? `With Price $${a.price.value}` : '',
            });
        }, [])

        const handleSideBar = () => {
            const index = sideBarSteps.indexOf("appointmentSelection");
            if (index > -1) {
                const slicedSteps = sideBarSteps.slice(0, index);
                dispatch(setSideBarSteps(slicedSteps))
            }
        }

        const handleSelect = useCallback((a: IServiceValetAppointment|null) => {
            const data = a && selectedTiming ? {...a, timingType: selectedTiming} : a;
            handleGA(a);
            dispatch(selectServiceValetAppointment(data));
            dispatch(setTransportation(null));
            handleSideBar();
        }, [selectedTiming])

        return (
            <div className={classes.wrapper}>
                <h4 ref={firstCardRef}>{t("Select Time")}</h4>
                {!loading
                        ? <PickUpSlotsWrapper>
                            {serviceValetSlots.map(timeSlot => {
                                    return <PickUpSlotCard
                                        date={date}
                                        onSelect={handleSelect}
                                        selected={Boolean(
                                            selectedAppointment && timeSlot?.date === selectedAppointment.date
                                        )}
                                        timeSlot={timeSlot}
                                        key={moment(timeSlot.date).toISOString()}
                                    />
                                })
                            }
                        </PickUpSlotsWrapper>
                        : <Loading/>}
            </div>
        );
    };