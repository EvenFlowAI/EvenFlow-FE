import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StepWrapper} from './StepWrapper';
import {Actions} from './Actions';
import {SelectedAppointment} from "./SelectedAppointment";
import {AppointmentDateSelector} from "./AppointmentDateSelector";
import {AppointmentTimeSelector} from "./AppointmentTimeSelector";
import {styled} from "@material-ui/core";
import moment from "moment";
import {useParams} from "react-router-dom";
import {decodeSCID, groupAppointments} from "../../../utils/utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EAppointmentTimingType, IAppointmentSlotsRequest} from "../../../store/reducers/appointment/types";
import {
    loadAppointmentSlots,
    loadServiceValetSlots,
    selectAppointment, selectServiceValetAppointment
} from "../../../store/reducers/appointment/actions";
import {TGroupedAppointments} from "../../../utils/types";
import {collectServiceRequestIds} from "./utils";
//import ReactGA from "react-ga4";
import ReactGA from "react-ga";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {EServiceType, EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import {TArgCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {TServiceTypeSettings} from "../../../store/reducers/bookingFlowConfig/types";
import {SVAppointmentDateSelector} from "./SVAppointmentDateSelector";
import {SVAppointmentTimeSelector} from "./SVAppointmentTimeSelector";

const Wrapper = styled('div')(({ theme }) => ({
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "stretch",
        justifyContent: "flex-start",
        gap: "20px",
        "&>div": {
            border: "1px solid #DADADA",
            padding: "18px 44px",
            [theme.breakpoints.down('xs')]: {
                padding: "18px 20px",
            },
            "&>h4": {
                fontSize: 16,
                margin: "0 0 16px",
                padding: 0,
                fontWeight: "bold",
                textTransform: "uppercase",
            }
        }
    })
);

type TAppointmentSelectionProps = {
    handleSetScreen: TArgCallback<TScreen>;
    currentConfig: TServiceTypeSettings|undefined;
}

export const AppointmentSelection: React.FC<TAppointmentSelectionProps> = ({handleSetScreen, currentConfig}) => {
    const [
        slots,
        serviceValetSlots,
        selectedTimingType,
        selectedTime,
        customerData,
        selectedVehicle,
        service,
        subService,
        selectedPackage,
        selectedOpsCodes,
        appointment,
        serviceValetAppointment,
        consultant,
        categoriesIds,
        allCategories,
        valueService,
        customerEnteredEmail,
        userType,
        vehicle,
        hashKey,
        serviceType,
        zipCode,
        address,
        selectedRecalls,
        serviceTypeOption,
    ] = useSelector((state: RootState) => [
        state.appointment.appointmentSlots,
        state.appointment.serviceValetSlots,
        state.appointmentFrame.selectedTiming,
        state.appointmentFrame.selectedTime,
        state.appointment.customerLoadedData,
        state.appointment.customerSelectedVehicle,
        state.appointmentFrame.service,
        state.appointmentFrame.subService,
        state.appointmentFrame.selectedPackage,
        state.appointment.selectedSR,
        state.appointment.appointment,
        state.appointment.serviceValetAppointment,
        state.appointmentFrame.advisor,
        state.appointmentFrame.categoriesIds,
        state.categories.allCategories,
        state.appointmentFrame.valueService,
        state.appointment.customerEnteredEmail,
        state.appointmentFrame.userType,
        state.appointmentFrame.selectedVehicle,
        state.appointmentFrame.hashKey,
        state.appointmentFrame.serviceType,
        state.appointmentFrame.zipCode,
        state.appointmentFrame.address,
        state.appointmentFrame.selectedRecalls,
        state.appointmentFrame.serviceTypeOption,
    ]);

    const [date, setDate] = useState<moment.Moment>(moment.utc().startOf('day'));
    const [month, setMonth] = useState<moment.Moment>(moment.utc());
    const [loading, setLoading] = useState<boolean>(false);

    const {id} = useParams();
    const initRef = useRef<boolean>(false);
    const isMount = useRef(true);
    const dispatch = useDispatch();
    const nextDisabled = useMemo(() => serviceTypeOption?.type === EServiceType.PikUpDropOff
        ? !serviceValetAppointment
        : !appointment,
        [appointment, serviceValetAppointment])
    const groupedAppointments: TGroupedAppointments = useMemo(() => {
        return groupAppointments(slots);
    }, [slots]);

    const handleGALandingOnPage = useCallback(() => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Selected advisor',
            label: consultant ? consultant.name : 'Any available',
            nonInteraction: true
        });
        if (appointment) {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Service Requests',
                label: `Requests Codes: 
                ${appointment?.serviceRequestPrices?.map(item => item.requestName).join(', ')}
                ${!isNaN(appointment?.price?.value) ? `with Total Price $${+appointment.price.value}` : ''}`,
            });
        }
    }, [consultant, appointment])

    useEffect(() => {
        handleGALandingOnPage();
    }, [selectedPackage, consultant, appointment])

    useEffect(() => {
        if (selectedTime) setMonth(moment.utc(selectedTime))
    }, [selectedTime])

    useEffect(() => {
        const currentSlots = serviceTypeOption?.type === EServiceType.PikUpDropOff ? serviceValetSlots : slots;
        const currentAppointment = serviceTypeOption?.type === EServiceType.PikUpDropOff ? serviceValetAppointment : appointment;
        if (currentSlots.length && isMount.current) {
            if (currentAppointment?.date) {
                setDate(moment.utc(currentAppointment.date).startOf('day'))
            } else {
                if (selectedTime) {
                    setDate(moment.utc(selectedTime).startOf('day'));
                } else {
                    if (currentSlots?.length) setDate(moment(currentSlots[0].date).startOf('day'))
                }
            }
            isMount.current = false;
        }
    }, [slots, selectedTime, appointment, serviceTypeOption, serviceValetSlots, serviceValetAppointment]);

    const updateDate = useCallback((d: moment.Moment) => {
        setDate(d.startOf('day'));
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        if (!d.isSame(month, 'month')) {
            setMonth(d);
        }
    }, [month, selectedTimingType]);

    const setDateCallback = useCallback((d: moment.Moment) => {
        if (selectedTimingType !== EAppointmentTimingType.FirstAvailable) {
            setDate(d.startOf('day'));
        }
    }, [selectedTimingType]);

    const handleDateRangeSet = useCallback((v: boolean) => {
        initRef.current = v;
    }, []);

    const getCategories = useCallback((): number[] => {
        return allCategories
            .filter(category => {
                return category.type === EServiceCategoryType.GeneralCategory && categoriesIds.includes(category.id)
            })
            .map(item => item.id)
    }, [allCategories, EServiceCategoryType, categoriesIds])

    useEffect(() => {
        async function loadData () {
            if (id) {
                setLoading(true);
                try {
                    const dd: IAppointmentSlotsRequest = {
                        appointmentTimingType: serviceTypeOption?.type === EServiceType.PikUpDropOff || !selectedTimingType
                            ? EAppointmentTimingType.FirstAvailable
                            : selectedTimingType,
                        serviceCenterId: decodeSCID(id),
                        consultantId: consultant?.id ?? null,
                        fromDate: selectedTime ? moment(selectedTime).toISOString() : moment.utc().startOf("day"),
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
                    if (zipCode?.length) dd.zipCode = zipCode;
                    if (address?.label) dd.address = address.label;
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
                    if (hashKey) dd.appointmentHashKey = hashKey;
                    if (userType === EUserType.Existing && customerEnteredEmail) dd.searchTerm = customerEnteredEmail;
                    if (serviceTypeOption?.type === EServiceType.PikUpDropOff) {
                        await dispatch(loadServiceValetSlots(dd));
                    } else {
                        await dispatch(loadAppointmentSlots(
                            dd,
                            setDateCallback,
                            () => handleDateRangeSet(false)
                        ));
                    }
                } finally {
                    setLoading(false);
                }
            }
        }
        loadData().finally();
    }, [
        dispatch, id, selectedTimingType,
        selectedVehicle, customerData, service, vehicle,
        subService, selectedPackage, selectedOpsCodes, consultant, valueService, serviceType, selectedTime
    ]);

    const handleGANext = useCallback(() => {
        if (appointment) {
            ReactGA.event({
                category: 'EvenFlow User',
                action: serviceTypeOption?.type === EServiceType.PikUpDropOff ? 'Selected Service Valet Appointment Slot' : 'Selected Appointment Slot',
                label: `On ${moment(appointment.date).format('MM-DD-YYYY')} at ${moment(appointment.date).format('hh:mm A')}`,
            });
        }
    }, [appointment])

    const handleGABack = useCallback(() => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Went back',
            label: 'From Selection Date & Time Page',
        });
    }, [])

    const handleNext = useCallback((): void => {
        handleGANext();
        handleSetScreen(currentConfig?.transportationNeeds ? 'transportationNeeds' : 'appointmentConfirmation');
    }, [currentConfig])

    const handleBack = useCallback((): void => {
        const nextScreen = currentConfig?.appointmentSelection
            ? 'appointmentTiming'
            : currentConfig?.advisorSelection
                ? 'consultantSelection'
                : "serviceNeeds"
        handleGABack();
        handleSetScreen(nextScreen);
    }, [currentConfig])

    return (
        <StepWrapper>
            <Wrapper>
                <SelectedAppointment />
                <Actions onBack={handleBack} onNext={handleNext} nextDisabled={nextDisabled} />
                {serviceTypeOption?.type === EServiceType.PikUpDropOff
                    ? <SVAppointmentDateSelector
                        onDateRangeSet={handleDateRangeSet}
                        dateRangeUpdated={initRef.current}
                        dateChangeDisabled={selectedTimingType !== EAppointmentTimingType.SpecialOffers}
                        date={date}
                        loading={loading}
                        onDateChange={updateDate} />
                    : <AppointmentDateSelector
                        dateChangeDisabled={selectedTimingType !== EAppointmentTimingType.SpecialOffers}
                        appointments={groupedAppointments}
                        date={date}
                        onDateRangeSet={handleDateRangeSet}
                        dateRangeUpdated={initRef.current}
                        loading={loading}
                        onDateChange={updateDate} />
                }
                {serviceTypeOption?.type === EServiceType.PikUpDropOff
                ? <SVAppointmentTimeSelector
                        date={date}
                        loading={loading}/>
                : <AppointmentTimeSelector
                        appointments={
                            groupedAppointments[date.toISOString().replace('.000', '')]
                        }
                        date={date}
                        loading={loading}/>}
            </Wrapper>
        </StepWrapper>
    );
};