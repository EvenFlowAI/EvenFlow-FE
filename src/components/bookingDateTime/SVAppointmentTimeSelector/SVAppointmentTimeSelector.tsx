import React, {useCallback, useMemo} from 'react';
import {IServiceValetAppointment} from "../../../store/reducers/appointment/types";
import {Loading} from "../../wrappers/Loading/Loading";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {selectServiceValetAppointment} from "../../../store/reducers/appointment/actions";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";
import {setSideBarSteps} from "../../../store/reducers/appointmentFrameReducer/actions";
import {PickUpSlotCard} from "../PickUpSlotCard/PickUpSlotCard";
import {PickUpSlotsWrapper} from "./styles";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";
import {useTimeSelectorStyles} from "../../../hooks/styling/useTmeSelectorStyles";
import {getClearSVDate} from "../../../utils/utils";

type TProps = {
    date: TParsableDate;
    loading: boolean;
}

export const SVAppointmentTimeSelector: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> =
    ({date, loading}) => {
        const {serviceValetAppointment: selectedAppointment, serviceValetSlots, isAppointmentSlotsLoading} = useSelector((state: RootState) => state.appointment);
        const {selectedTiming, sideBarSteps, trackerData} = useSelector((state : RootState) => state.appointmentFrame);
        const dispatch = useDispatch();
        const { classes  } = useTimeSelectorStyles();
        const {t} = useTranslation();

        const currentSlots = useMemo(() => {
            const dateWithOffset = dayjs(date)
            return serviceValetSlots.filter(slot => dayjs.utc(slot.date).isSame(dateWithOffset, 'date'))
        }, [serviceValetSlots, date])

        const handleGA = useCallback((a: IServiceValetAppointment|null) => {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Clicked on Service Valet Appointment Slot',
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

        const handleSelect = useCallback((a: IServiceValetAppointment|null) => {
            const data = a && selectedTiming ? {...a, timingType: selectedTiming} : a;
            handleGA(a);
            dispatch(selectServiceValetAppointment(data));
            handleSideBar();
        }, [selectedTiming])

        return (
            <div className={classes.wrapper}>
                <div className={classes.titleWrapper}>
                    <h4 className={classes.title}>{t("Select Time")}</h4>
                    <div>{getClearSVDate(date).format("ddd")}, <span className={classes.boldText}>{getClearSVDate(date).format('MMM DD')}</span></div>
                </div>
                {!loading && !isAppointmentSlotsLoading
                        ? <PickUpSlotsWrapper>
                            {currentSlots?.length ? currentSlots.map(timeSlot => {
                                    return <PickUpSlotCard
                                        date={date}
                                        onSelect={handleSelect}
                                        selected={Boolean(
                                            selectedAppointment && dayjs(timeSlot?.date).isSame(selectedAppointment.date, 'minute')
                                        )}
                                        timeSlot={timeSlot}
                                        key={dayjs.utc(timeSlot.date).toISOString()}
                                    />
                                })
                                : <PickUpSlotCard
                                    date={date}
                                    onSelect={handleSelect}
                                    selected={false}
                                    timeSlot={null}
                                    key={dayjs().toISOString()}
                                />
                            }
                        </PickUpSlotsWrapper>
                        : <Loading/>}
            </div>
        );
    };