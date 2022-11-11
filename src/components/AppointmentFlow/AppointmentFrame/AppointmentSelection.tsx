import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {TActionProps} from "./types";
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
import {loadAppointmentSlots} from "../../../store/reducers/appointment/actions";
import {TGroupedAppointments} from "../../../utils/types";
import {collectServiceRequestIds} from "./utils";
import ReactGA from "react-ga";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {EUserType} from "../../../store/reducers/appointmentFrameReducer/types";

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

export const AppointmentSelection: React.FC<TActionProps> = ({onBack, onNext}) => {
    const [
        slots,
        selectedTimingType,
        selectedTime,
        customerData,
        selectedVehicle,
        service,
        subService,
        selectedPackage,
        selectedOpsCodes,
        appointment,
        consultant,
        categoriesIds,
        allCategories,
        valueService,
        customerEnteredEmail,
        userType,
        vehicle,
        hashKey,
    ] = useSelector((state: RootState) => [
        state.appointment.appointmentSlots,
        state.appointmentFrame.selectedTiming,
        state.appointmentFrame.selectedTime,
        state.appointment.customerLoadedData,
        state.appointment.customerSelectedVehicle,
        state.appointmentFrame.service,
        state.appointmentFrame.subService,
        state.appointmentFrame.selectedPackage,
        state.appointment.selectedSR,
        state.appointment.appointment,
        state.appointmentFrame.advisor,
        state.appointmentFrame.categoriesIds,
        state.categories.allCategories,
        state.appointmentFrame.valueService,
        state.appointment.customerEnteredEmail,
        state.appointmentFrame.userType,
        state.appointmentFrame.selectedVehicle,
        state.appointmentFrame.hashKey,
    ]);

    const [date, setDate] = useState<moment.Moment>(moment.utc().startOf('day'));
    const [month, setMonth] = useState<moment.Moment>(moment.utc());
    const [loading, setLoading] = useState<boolean>(false);

    const {id} = useParams();
    const initRef = useRef<boolean>(false);
    const isMount = useRef(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedTime) setMonth(moment.utc(selectedTime))
    }, [selectedTime])

    useEffect(() => {
        if (slots.length && isMount.current) {
            if (appointment?.date) {
                setDate(moment.utc(appointment.date).startOf('day'))
            } else {
                if (selectedTime) {
                    setDate(moment.utc(selectedTime).startOf('day'));
                } else {
                    if (slots?.length) setDate(moment(slots[0].date).startOf('day'))
                }
            }
            isMount.current = false;
        }
    }, [slots, selectedTime, appointment]);

    useEffect(() => {
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
    }, [selectedPackage, consultant])

    const updateDate = useCallback((d: moment.Moment) => {
        setDate(d.startOf('day'));
        if (!d.isSame(month, 'month')
            && selectedTimingType === EAppointmentTimingType.SpecialOffers) {
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

    const getCategories = (): number[] => {
        return allCategories
            .filter(category => {
                return category.type === EServiceCategoryType.GeneralCategory && categoriesIds.includes(category.id)
            })
            .map(item => item.id)
    }

    useEffect(() => {
        async function loadData () {
            if (id) {
                setLoading(true);
                const sd: moment.Moment = month
                    ? moment(month)
                    : moment.utc().startOf("day");
                try {
                    const dd: IAppointmentSlotsRequest = {
                        appointmentTimingType: selectedTimingType ?? EAppointmentTimingType.FirstAvailable,
                        serviceCenterId: decodeSCID(id),
                        consultantId: consultant?.id ?? null,
                        fromDate: sd.toISOString(),
                        maintenancePackageOptionId: selectedPackage?.id ?? null,
                        serviceRequestIds: collectServiceRequestIds(
                            service, subService, selectedPackage, selectedOpsCodes
                        ),
                        serviceCategoryIds: getCategories(),
                        countOfDays: Math.abs(sd.diff(moment(sd).endOf("month"), "days")) + 1,
                        customerId: customerData?.id,
                        warrantyExpiration: selectedVehicle?.warrantyExpiration,
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
                        }
                    }
                    if (hashKey) dd.appointmentHashKey = hashKey;
                    if (userType === EUserType.Existing && customerEnteredEmail) dd.searchTerm = customerEnteredEmail;
                    await dispatch(loadAppointmentSlots(
                        dd,
                        setDateCallback,
                        () => handleDateRangeSet(false)
                    ));
                } finally {
                    setLoading(false);
                }
            }
        }
        loadData().finally();
    }, [
        dispatch, id, selectedTimingType, month,
        selectedVehicle, customerData, service, handleDateRangeSet, vehicle,
        subService, selectedPackage, setDateCallback, selectedOpsCodes, consultant, valueService
    ]);
    const groupedAppointments: TGroupedAppointments = useMemo(() => {
        return groupAppointments(slots);
    }, [slots]);

    const handleNext = (): void => {
        if (appointment) {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Appointment Slot',
                label: `On ${moment(appointment.date).format('MM-DD-YYYY')} at ${moment(appointment.date).format('hh:mm A')}`,
            });
        }
        onNext();
    }

    const handleBack = (): void => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Went back',
            label: 'From Selection Date & Time Page',
        });
        onBack();
    }

    return (
        <StepWrapper>
            <Wrapper>
                <SelectedAppointment />
                <Actions onBack={handleBack} onNext={handleNext} nextDisabled={!appointment} />
                <AppointmentDateSelector
                    dateChangeDisabled={selectedTimingType !== EAppointmentTimingType.SpecialOffers}
                    appointments={groupedAppointments}
                    date={date}
                    onDateRangeSet={handleDateRangeSet}
                    dateRangeUpdated={initRef.current}
                    loading={loading}
                    onDateChange={updateDate} />
                <AppointmentTimeSelector
                    appointments={
                        groupedAppointments[date.toISOString().replace('.000', '')]
                    }
                    date={date}
                    loading={loading}
                />
            </Wrapper>
        </StepWrapper>
    );
};