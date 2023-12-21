import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import moment from "moment";
import {IServiceValetAppointment,} from "../../../../../store/reducers/appointment/types";
import {Loading} from "../../../../../components/Loading/Loading";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {selectServiceValetAppointment} from "../../../../../store/reducers/appointment/actions";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";
import {setSideBarSteps, setTransportation} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {PickUpSlotCard} from "../PickUpSlotCard/PickUpSlotCard";
import {PickUpSlotsWrapper, useStyles} from "./styles";

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
        const currentSlots = useMemo(() => {
            return serviceValetSlots.filter(slot => moment(slot.date).isSame(date, 'date'))
        }, [serviceValetSlots, date])

        useEffect(() => {
           // if (firstCardRef?.current && date) firstCardRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
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
                const slicedSteps = sideBarSteps.slice(0, index + 1);
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
                            {currentSlots?.length ? currentSlots.map(timeSlot => {
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
                                : <PickUpSlotCard
                                    date={date}
                                    onSelect={handleSelect}
                                    selected={false}
                                    timeSlot={null}
                                    key={moment().toISOString()}
                                />
                            }
                        </PickUpSlotsWrapper>
                        : <Loading/>}
            </div>
        );
    };