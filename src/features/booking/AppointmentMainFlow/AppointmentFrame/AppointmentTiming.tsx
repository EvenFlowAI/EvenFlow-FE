import React, {useCallback, useMemo, useState} from 'react';
import {TCard} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from '../../Actions/Actions';
import {styled, Theme} from '@material-ui/core';
import {ReactComponent as SelectDateIcon} from "../../../../assets/img/selectDateIcon.svg";
import {ReactComponent as FirstAvailableIcon} from "../../../../assets/img/firstAvailableIcon.svg";
import {ReactComponent as OffersIcon} from "../../../../assets/img/offersIcon.svg";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    setServiceTypeOption,
    setSideBarSteps,
    setTime,
    setTiming,
    setWelcomeScreenView
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import moment from "moment";
import {
    EAppointmentTimingType,
} from "../../../../store/reducers/appointment/types";
import {
    selectAppointment,
    selectServiceValetAppointment,
} from "../../../../store/reducers/appointment/actions";
//import ReactGA from "react-ga";
import ReactGA from "react-ga4";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import AppointmentTimingCard from "./AppointmentTimingCard";
import {useTranslation} from "react-i18next";
import {TArgCallback, TScreen} from "../../../../types/types";
import {useHistory, useParams} from "react-router-dom";
import {Routes} from "../../../../config/routes";

const TimingWrapper = styled('div')<Theme, {columns: number}>(({theme, columns}) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    width: "100%",
    alignItems: "stretch",
    gap: "20px",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));

const cards: TCard[] = [
    {
        description: "See appointments with special offer and shorter wait times",
        icon: <OffersIcon />,
        name: EAppointmentTimingType.SpecialOffers
    },
    {
        description: "Choose a preferred date",
        icon: <SelectDateIcon />,
        name: EAppointmentTimingType.PreferredDate
    },
    {
        description: "Choose first available date",
        icon: <FirstAvailableIcon />,
        name: EAppointmentTimingType.FirstAvailable
    }
];

const timingTypes = ['Special Offers', 'Preferred Date', 'First Available Date'];

export const AppointmentTiming: React.FC<{handleSetScreen: TArgCallback<TScreen>}> = ({handleSetScreen}) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [
        selectedType,
        selectedTime,
        appointment,
        serviceTypeOption,
        sideBarSteps,
        isAdvisorAvailable,
        consultants,
        appointmentByKey,
        editingPosition,
        customerLoadedData,
    ] = useSelector(
        (state: RootState) => [
            state.appointmentFrame.selectedTiming,
            state.appointmentFrame.selectedTime,
            state.appointment.appointment,
            state.appointmentFrame.serviceTypeOption,
            state.appointmentFrame.sideBarSteps,
            state.bookingFlowConfig.isAdvisorAvailable,
            state.appointmentFrame.consultants,
            state.appointmentFrame.appointmentByKey,
            state.appointmentFrame.editingPosition,
            state.appointment.customerLoadedData,
        ]);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {id} = useParams();
    const history = useHistory();

    const fromServiceValetToVisitCenter = useMemo(() => {
        return serviceTypeOption?.type === EServiceType.VisitCenter
            && appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff
    }, [serviceTypeOption, appointmentByKey])

    const redirectToServiceTypeOptions = () => {
        dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
        dispatch(setWelcomeScreenView('serviceSelect'));
        history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
    }

    const onBack = () => {
        if (fromServiceValetToVisitCenter) {
            redirectToServiceTypeOptions()
        } else {
            const fromSlotEditing = editingPosition === 'slot' && customerLoadedData?.isUpdating
            if (fromSlotEditing) {
                handleSetScreen("manageAppointment")
            } else {
                handleSetScreen(isAdvisorAvailable && consultants.length ? 'consultantSelection' : 'serviceNeeds')
            }
        }
    }

    const onNext = () => {
        handleSetScreen("appointmentSelection")
    }

    const handleSelectTiming = useCallback((t: EAppointmentTimingType) => () => {
        dispatch(setTiming(t));
    }, [])

    const clearAppointmentSlots = () => {
        dispatch(selectAppointment(null));
        //dispatch(setWaitListSettings(null));
        dispatch(selectServiceValetAppointment(null));
    }

    const handleChangeTime = useCallback((t: moment.Moment|null) => {
        dispatch(setTime(t));
        if (!moment(selectedTime).isSame(t, 'date')) clearAppointmentSlots()
    }, [selectedTime])

    const isTimingValid = Boolean(
        selectedType !== null
        && (selectedType !== EAppointmentTimingType.PreferredDate || selectedTime)
    );

    const handleSideBar = () => {
        const index = sideBarSteps.indexOf("appointmentSelection");
        if (index > -1) {
            const slicedSteps = sideBarSteps.slice(0, index + 1);
            dispatch(setSideBarSteps(slicedSteps))
        }
    }

    const onSubmit = useCallback((): void => {
        if (selectedType) {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Timing Type',
                label: `Selected ${timingTypes[selectedType]}`,
            });
        }
        if (appointment?.timingType !== selectedType) clearAppointmentSlots()
        handleSideBar();
        onNext();
    }, [appointment, dispatch, onNext, selectedType])

    return (
        <StepWrapper>
            <TimingWrapper columns={2}>
                {cards.map((card, idx) => {
                    if (!idx) {
                        return null;
                    }
                    if (serviceTypeOption?.type === EServiceType.PickUpDropOff && idx === 1) {
                        // todo delete this when Preferred Date Search will be implemented
                        return null;
                    }
                    return <AppointmentTimingCard
                        onClick={handleSelectTiming(card.name)}
                        card={card}
                        isLoading={isLoading}
                        onChangeTime={handleChangeTime}
                        selectedTime={selectedTime}
                        active={selectedType === card.name}
                        key={card.name}/>
                })}
            </TimingWrapper>
            <Actions onBack={onBack} onNext={onSubmit} nextDisabled={!isTimingValid} nextLabel={t("Next")}/>
        </StepWrapper>
    );
};