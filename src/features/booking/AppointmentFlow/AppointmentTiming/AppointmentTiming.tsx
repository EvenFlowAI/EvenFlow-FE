import React, {useCallback, useMemo, useState} from 'react';
import {StepWrapper} from "../../../../components/styled/StepWrapper";
import {ActionButtons} from '../../ActionButtons/ActionButtons';
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
import {EAppointmentTimingType,} from "../../../../store/reducers/appointment/types";
import {selectAppointment, selectServiceValetAppointment,} from "../../../../store/reducers/appointment/actions";
import ReactGA from "react-ga4";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import AppointmentTimingCard from "./AppointmentTimingCard/AppointmentTimingCard";
import {useTranslation} from "react-i18next";
import {TArgCallback, TParsableDate, TScreen} from "../../../../types/types";
import {useHistory, useParams} from "react-router-dom";
import {TimingWrapper} from "./styles";
import {TCard} from "./types";
import {Routes} from "../../../../routes/constants";
import dayjs from "dayjs";

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

export const AppointmentTiming: React.FC<React.PropsWithChildren<React.PropsWithChildren<{handleSetScreen: TArgCallback<TScreen>}>>> = ({handleSetScreen}) => {
    const {appointment, customerLoadedData} = useSelector((state: RootState) => state.appointment)
    const {
        selectedTiming,
        selectedTime,
        serviceTypeOption,
        sideBarSteps,
        consultants,
        appointmentByKey,
        editingPosition
    } = useSelector((state: RootState) => state.appointmentFrame)
    const {isAdvisorAvailable} = useSelector((state: RootState) => state.bookingFlowConfig)

    const [isLoading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {id} = useParams<{id: string}>();
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
        dispatch(selectServiceValetAppointment(null));
    }

    const handleChangeTime = useCallback((t: TParsableDate) => {
        dispatch(setTime(t));
        if (!dayjs.utc(selectedTime).isSame(t, 'date')) clearAppointmentSlots()
    }, [selectedTime])

    const isTimingValid = Boolean(
        selectedTiming !== null
        && (selectedTiming !== EAppointmentTimingType.PreferredDate || selectedTime)
    );

    const handleSideBar = () => {
        const index = sideBarSteps.indexOf("appointmentSelection");
        if (index > -1) {
            const slicedSteps = sideBarSteps.slice(0, index + 1);
            dispatch(setSideBarSteps(slicedSteps))
        }
    }

    const onSubmit = useCallback((): void => {
        if (selectedTiming) {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Timing Type',
                label: `Selected ${timingTypes[selectedTiming]}`,
            });
        }
        if (appointment?.timingType !== selectedTiming) clearAppointmentSlots()
        handleSideBar();
        onNext();
    }, [appointment, dispatch, onNext, selectedTiming])

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
                        active={selectedTiming === card.name}
                        key={card.name}/>
                })}
            </TimingWrapper>
            <ActionButtons onBack={onBack} onNext={onSubmit} nextDisabled={!isTimingValid} nextLabel={t("Next")}/>
        </StepWrapper>
    );
};