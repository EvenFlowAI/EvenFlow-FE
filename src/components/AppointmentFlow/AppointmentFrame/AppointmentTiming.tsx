import React, {useCallback, useEffect, useState} from 'react';
import {TActionProps, TCard} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from './Actions';
import {styled, Theme} from '@material-ui/core';
import {ReactComponent as SelectDateIcon} from "../../../assets/img/selectDateIcon.svg";
import {ReactComponent as FirstAvailableIcon} from "../../../assets/img/firstAvailableIcon.svg";
import {ReactComponent as OffersIcon} from "../../../assets/img/offersIcon.svg";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setTime, setTiming} from "../../../store/reducers/appointmentFrameReducer/actions";
import moment from "moment";
import {EAppointmentTimingType, IAppointmentSlotsRequest} from "../../../store/reducers/appointment/types";
import {loadAppointmentSlots, selectAppointment} from "../../../store/reducers/appointment/actions";
import ReactGA from "react-ga";
//import ReactGA from "react-ga4";
import {decodeSCID} from "../../../utils/utils";
import {collectServiceRequestIds} from "./utils";
import {EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import {useParams} from "react-router-dom";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import AppointmentTimingCard from "./AppointmentTimingCard";

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

export const AppointmentTiming: React.FC<TActionProps> = ({onNext, onBack}) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const {id} = useParams();
    const [
        selectedType,
        selectedTime,
        appointment,
        consultant,
        selectedPackage,
        customerData,
        selectedVehicle,
        service,
        subService,
        valueService,
        customerEnteredEmail,
        userType,
        vehicle,
        selectedOpsCodes,
        categoriesIds,
        allCategories,
        serviceTypeOption,
        selectedRecalls
    ] = useSelector(
        (state: RootState) => [
            state.appointmentFrame.selectedTiming,
            state.appointmentFrame.selectedTime,
            state.appointment.appointment,
            state.appointmentFrame.advisor,
            state.appointmentFrame.selectedPackage,
            state.appointment.customerLoadedData,
            state.appointment.customerSelectedVehicle,
            state.appointmentFrame.service,
            state.appointmentFrame.subService,
            state.appointmentFrame.valueService,
            state.appointment.customerEnteredEmail,
            state.appointmentFrame.userType,
            state.appointmentFrame.selectedVehicle,
            state.appointment.selectedSR,
            state.appointmentFrame.categoriesIds,
            state.categories.allCategories,
            state.appointmentFrame.serviceTypeOption,
            state.appointmentFrame.selectedRecalls,
        ]);

    useEffect(() => {
        setLoading(true);
        const date = moment();
        const dd: IAppointmentSlotsRequest = {
            appointmentTimingType: EAppointmentTimingType.PreferredDate,
            serviceCenterId: decodeSCID(id),
            consultantId: consultant?.id ?? null,
            fromDate: date.toISOString(),
            maintenancePackageOptionId: selectedPackage?.id ?? null,
            serviceRequestIds: collectServiceRequestIds(
                service, subService, selectedRecalls, selectedPackage, selectedOpsCodes
            ),
            serviceCategoryIds: getCategories(),
            customerId: customerData?.id,
            warrantyExpiration: selectedVehicle?.warrantyExpiration,
            serviceTypeOptionId: serviceTypeOption?.id ?? null,
        }
        if (valueService?.selectedService) {
            dd.valueServiceOfferIds = [valueService.selectedService.id];
        }
        if (vehicle) {
            dd.vehicle = {
                vin: vehicle.vin,
                year: vehicle.year,
                make: vehicle.make,
                model: vehicle.model,
                mileage: vehicle.mileage,
                engineTypeId: vehicle.engineTypeId,
            }
        }
        if (userType === EUserType.Existing && customerEnteredEmail) dd.searchTerm = customerEnteredEmail;
        dispatch(loadAppointmentSlots(dd, () => {}, () => setLoading(false)));
    }, [consultant, service, subService, selectedPackage, selectedOpsCodes, customerData, selectedVehicle, valueService, vehicle, userType, customerEnteredEmail])

    const getCategories = useCallback((): number[] => {
        return allCategories
            .filter(category => {
                return category.type === EServiceCategoryType.GeneralCategory && categoriesIds.includes(category.id)
            })
            .map(item => item.id)
    }, [allCategories, EServiceCategoryType, categoriesIds])

    const handleSelectTiming = useCallback((t: EAppointmentTimingType) => () => {
        dispatch(setTiming(t));
    }, [])

    const handleChangeTime = useCallback((t: moment.Moment|null) => {
        dispatch(setTime(t));
        if (!moment(selectedTime).isSame(t, 'date')) {
            dispatch(selectAppointment(null));
        }
    }, [selectedTime])

    const isValid = Boolean(
        selectedType !== null
        && (selectedType !== EAppointmentTimingType.PreferredDate || selectedTime)
    );

    const onSubmit = useCallback((): void => {
        if (selectedType) {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Timing Type',
                label: `Selected ${timingTypes[selectedType]}`,
            });
        }
        if (appointment?.timingType !== selectedType) dispatch(selectAppointment(null))
        onNext();
    }, [appointment, dispatch, onNext, selectedType])

    return (
        <StepWrapper>
            <TimingWrapper columns={2}>
                {cards.map((card, idx) => {
                    if (!idx) {
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
            <Actions onBack={onBack} onNext={onSubmit} nextDisabled={!isValid} />
        </StepWrapper>
    );
};