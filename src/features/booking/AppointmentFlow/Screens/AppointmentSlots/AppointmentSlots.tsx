import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StepWrapper} from '../../../../../components/styled/StepWrapper';
import {ActionButtons} from '../../../ActionButtons/ActionButtons';
import {SelectedAppointment} from "./SelectedAppointment/SelectedAppointment";
import {
    AppointmentDateSelector
} from "../../../../../components/bookingDateTime/AppointmentDateSelector/AppointmentDateSelector";
import {
    AppointmentTimeSelector
} from "../../../../../components/bookingDateTime/AppointmentTimeSelector/AppointmentTimeSelector";
import {useHistory, useParams} from "react-router-dom";
import {collectServiceRequestIds, decodeSCID, mapRecallsForRequest} from "../../../../../utils/utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {
    EAppointmentTimingType,
    IAppointmentSlotsRequest,
    MPOptionShort,
} from "../../../../../store/reducers/appointment/types";
import {
    loadAppointmentSlots,
    loadServiceValetSlots,
    selectAppointment,
    selectServiceValetAppointment,
} from "../../../../../store/reducers/appointment/actions";
import {TGroupedAppointments} from "../../../../../utils/types";
import ReactGA from "react-ga4";
import {EServiceCategoryType} from "../../../../../store/reducers/categories/types";
import {EServiceType, EUserType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {TArgCallback, TCallback, TParsableDate, TScreen} from "../../../../../types/types";
import {
    SVAppointmentDateSelector
} from "../../../../../components/bookingDateTime/SVAppointmentDateSelector/SVAppointmentDateSelector";
import {
    SVAppointmentTimeSelector
} from "../../../../../components/bookingDateTime/SVAppointmentTimeSelector/SVAppointmentTimeSelector";
import {
    clearAppointmentSteps,
    setServiceTypeOption,
    setWelcomeScreenView
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {useTranslation} from "react-i18next";
import {SlotsScreenWrapper} from "./styles";
import {groupAppointments} from "./utils";
import {Routes} from "../../../../../routes/constants";
import dayjs from "dayjs";
import CustomerConsents from "../../../../../components/modals/booking/CustomerConsents/CustomerConsents";
import {useModal} from "../../../../../hooks/useModal/useModal";
import MileageModal from "../../../../../components/modals/booking/MileageModal/MileageModal";

type TAppointmentSelectionProps = {
    handleSetScreen: TArgCallback<TScreen>;
    onNext: TCallback;
    prevLogicalScreen: TScreen;
    fromServiceValetToVisitCenter?: boolean;
}

export const AppointmentSlots: React.FC<React.PropsWithChildren<React.PropsWithChildren<TAppointmentSelectionProps>>> = ({
                                                                                                                             handleSetScreen,
                                                                                                                             onNext,
                                                                                                                             prevLogicalScreen,
                                                                                                                             fromServiceValetToVisitCenter,

}) => {
    const {
        appointmentSlots,
        serviceValetSlots,
        customerLoadedData,
        selectedSR,
        appointment,
        serviceValetAppointment,
        customerEnteredEmail,
    } = useSelector((state: RootState) => state.appointment)

    const {
        selectedTiming,
        selectedTime,
        selectedVehicle,
        service,
        subService,
        selectedPackage,
        advisor,
        categoriesIds,
        valueService,
        userType,
        hashKey,
        zipCode,
        address,
        selectedRecalls,
        serviceTypeOption,
        packagePricingType,
        packageEMenuType,
        consultants,
        appointmentByKey,
        isConsultantsLoading,
        isConsentsLoading,
        trackerData,
        transportation,
        editingPosition,
        serviceOptionChangedFromSlotPage
    } = useSelector((state: RootState) => state.appointmentFrame)

    const {currentConfig, isAppointmentTimingAvailable, isTransportationAvailable} = useSelector((state: RootState) => state.bookingFlowConfig)

    const {allCategories} = useSelector((state: RootState) => state.categories);
    const {mileage} = useSelector((state: RootState) => state.vehicleDetails);

    const [date, setDate] = useState<TParsableDate>(dayjs.utc().startOf('day'));
    const [month, setMonth] = useState<TParsableDate>(dayjs.utc());
    const [loading, setLoading] = useState<boolean>(false);

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const {id} = useParams<{id: string}>();
    const initRef = useRef<boolean>(false);
    const isMount = useRef(true);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const history = useHistory();
    const {isOpen: isMileageOpen, onClose: onMileageClose, onOpen: onMileageOpen} = useModal();
    const nextDisabled = useMemo(() => serviceTypeOption?.type === EServiceType.PickUpDropOff
        ? !serviceValetAppointment
        : !appointment,
        [appointment, serviceValetAppointment])

    const groupedAppointments: TGroupedAppointments = useMemo(() => {
        return groupAppointments(appointmentSlots);
    }, [appointmentSlots]);

    const handleGALandingOnPage = useCallback(() => {
        if (consultants?.length && currentConfig?.advisorSelection) {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected advisor',
                label: advisor ? advisor.name : 'Any available',
                nonInteraction: true
            }, trackerData.ids);
        }
        if (appointment) {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Service Requests',
                label: `Requests Codes: 
                ${appointment?.serviceRequestPrices?.map(item => item.requestName).join(', ')}
                ${!isNaN(appointment?.price?.value) ? `with Total Price $${+appointment.price.value}` : ''}`,
            }, trackerData.ids);
        }
    }, [advisor, appointment, consultants, currentConfig, trackerData])

    useEffect(() => {
        handleGALandingOnPage();
    }, [selectedPackage, advisor, appointment])

    useEffect(() => {
        if (selectedTime) setMonth(dayjs.utc(selectedTime))
    }, [selectedTime])

    useEffect(() => {
        const currentSlots = serviceTypeOption?.type === EServiceType.PickUpDropOff ? serviceValetSlots : appointmentSlots;
        const currentAppointment = serviceTypeOption?.type === EServiceType.PickUpDropOff ? serviceValetAppointment : appointment;
        if (currentSlots.length && isMount.current) {
            if (currentAppointment?.date) {
                setDate(dayjs.utc(currentAppointment.date).startOf('day'))
            } else {
                if (selectedTime) {
                    setDate(dayjs.utc(selectedTime).startOf('day'));
                } else {
                    if (currentSlots?.length) setDate(dayjs(currentSlots[0].date).startOf('day'))
                }
            }
            isMount.current = false;
        }
    }, [appointmentSlots, selectedTime, appointment, serviceTypeOption, serviceValetSlots, serviceValetAppointment]);

    const clearData = () => {
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        dispatch(clearAppointmentSteps(isTransportationAvailable ? "transportationNeeds" : "appointmentSelection"));
    }

    const updateDate = useCallback((d: TParsableDate) => {
        clearData()
        setDate(dayjs(d).startOf('day'));
        if (!dayjs(d).isSame(month, 'month')) {
            setMonth(d);
        }
    }, [month, selectedTiming]);


    const setDateCallback = useCallback((d: TParsableDate) => {
        if (selectedTiming !== EAppointmentTimingType.FirstAvailable) {
            setDate(dayjs(d).startOf('day'));
        }
    }, [selectedTiming]);

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

    const loadData = async () => {
        if (id) {
            const utcOffset = dayjs().utcOffset()
            setLoading(true);
            try {
                const maintenancePackageOption: MPOptionShort|null = selectedPackage
                    ? {id: selectedPackage?.id, priceType: packagePricingType}
                    : packageEMenuType !== null
                        ? {optionType: packageEMenuType}
                        : null;

                const transportationOptionId: number|null = (serviceTypeOption?.type === EServiceType.VisitCenter || !serviceTypeOption)
                    && !serviceTypeOption?.transportationOption
                    && transportation
                        ? transportation.id
                        : null;
                const data: IAppointmentSlotsRequest = {
                    appointmentTimingType: serviceTypeOption?.type === EServiceType.PickUpDropOff || !selectedTiming
                        ? EAppointmentTimingType.FirstAvailable
                        : selectedTiming,
                    serviceCenterId: decodeSCID(id),
                    advisorId: advisor?.id ?? null,
                    fromDate: selectedTime
                        ? dayjs(selectedTime).add(utcOffset, 'minute').toISOString()
                        : dayjs().startOf("day").add(utcOffset, 'minute').toISOString(),
                    maintenancePackageOption,
                    serviceRequestIds: collectServiceRequestIds(
                        service, subService, selectedPackage, selectedSR
                    ),
                    serviceCategoryIds: getCategories(),
                    customerId: customerLoadedData?.id,
                    warrantyExpiration: selectedVehicle?.warrantyExpiration,
                    serviceTypeOptionId: serviceTypeOption?.id ?? null,
                    recalls: mapRecallsForRequest(selectedRecalls),
                    transportationOptionId,
                }
                if (valueService?.selectedService) {
                    data.valueServiceOfferIds = [valueService.selectedService.id];
                }
                if (zipCode?.length) data.zipCode = zipCode;
                if (address) {
                    if (address?.label) {
                        data.address = address.label;
                    } else if (typeof address === 'string') {
                        data.address = address;
                    }
                }
                if (selectedVehicle) {
                    data.vehicle = {
                        vin: selectedVehicle.vin,
                        year: selectedVehicle.year,
                        make: selectedVehicle.make,
                        model: selectedVehicle.model,
                        mileage: selectedVehicle.mileage,
                        engineTypeId: selectedVehicle.engineTypeId,
                    }
                }
                if (hashKey) data.appointmentHashKey = hashKey;
                if (userType === EUserType.Existing && customerEnteredEmail) data.searchTerm = customerEnteredEmail;
                if (serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                    if (data.address && data.zipCode) await dispatch(loadServiceValetSlots(data));
                } else {
                    await dispatch(loadAppointmentSlots(
                        data,
                        setDateCallback,
                        () => handleDateRangeSet(false)
                    ));
                }
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        const mileageIsValid = selectedVehicle?.mileage
            && mileage.find(item => item.value.toString() === selectedVehicle?.mileage?.toString())
        if (!mileageIsValid) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false)
                onMileageOpen()
            }, 1000)
        } else {
            loadData().finally();
        }
    }, [
        dispatch, id, selectedTiming,
        selectedVehicle, customerLoadedData, service, packagePricingType, packageEMenuType, serviceTypeOption,
        subService, selectedPackage, selectedSR, advisor, valueService, serviceType, selectedTime, zipCode, address, mileage,
        transportation
    ]);

    const handleGANext = useCallback(() => {
        if (appointment) {
            ReactGA.event({
                category: 'EvenFlow User',
                action: serviceTypeOption?.type === EServiceType.PickUpDropOff ? 'Selected Service Valet Appointment Slot' : 'Selected Appointment Slot',
                label: `On ${dayjs.utc(appointment.date).format('MM-DD-YYYY')} at ${dayjs.utc(appointment.date).format('hh:mm A')}`,
            }, trackerData.ids);
        }
    }, [appointment, serviceTypeOption, trackerData])

    const handleGABack = useCallback(() => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Went back',
            label: 'From Selection Date & Time Page',
        }, trackerData.ids);
    }, [trackerData])

    const handleConsents = () => {
        handleSetScreen("appointmentConfirmation")
    }

    const handleNext = useCallback((): void => {
        handleGANext();
        onNext();
    }, [onNext, handleGANext])

    const handleBack = useCallback((): void => {
        handleGABack();
        if (prevLogicalScreen === "appointmentSelection" || (fromServiceValetToVisitCenter && !isAppointmentTimingAvailable)) {
            dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
            dispatch(setWelcomeScreenView("serviceSelect"))
            history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
        } else {
            if (editingPosition === "slot" && serviceOptionChangedFromSlotPage) dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
            handleSetScreen(prevLogicalScreen);
        }
    }, [currentConfig, history, fromServiceValetToVisitCenter, prevLogicalScreen])

    const loadDataForMileage = () => {
        onMileageClose()
        loadData().finally()
    }

    return (
        <StepWrapper>
            <SlotsScreenWrapper>
                <SelectedAppointment handleSetScreen={handleSetScreen}/>
                <ActionButtons
                    removeTopMargin
                    onBack={handleBack}
                    onNext={handleNext}
                    nextDisabled={nextDisabled}
                    nextLabel={t("Next")}
                    loading={isConsultantsLoading || isConsentsLoading}/>
                {serviceTypeOption?.type === EServiceType.PickUpDropOff
                    ? <SVAppointmentDateSelector
                        onDateRangeSet={handleDateRangeSet}
                        dateRangeUpdated={initRef.current}
                        dateChangeDisabled={selectedTiming !== EAppointmentTimingType.SpecialOffers}
                        date={date}
                        loading={loading || isConsentsLoading}
                        onDateChange={updateDate} />
                    : <AppointmentDateSelector
                        dateChangeDisabled={selectedTiming !== EAppointmentTimingType.SpecialOffers}
                        appointments={groupedAppointments}
                        date={date}
                        onDateRangeSet={handleDateRangeSet}
                        dateRangeUpdated={initRef.current}
                        loading={loading || isConsentsLoading}
                        onDateChange={updateDate} />
                }
                {serviceTypeOption?.type === EServiceType.PickUpDropOff
                ? <SVAppointmentTimeSelector
                        date={date}
                        loading={loading || isConsentsLoading}/>
                : <AppointmentTimeSelector
                        appointments={
                            groupedAppointments[dayjs(date).toISOString().replace('.000', '')]
                        }
                        date={date}
                        loading={loading || isConsentsLoading}/>}
            </SlotsScreenWrapper>
            <CustomerConsents onNext={handleConsents}/>
            <MileageModal open={isMileageOpen} onClose={onMileageClose} onSave={loadDataForMileage}/>
        </StepWrapper>
    );
};