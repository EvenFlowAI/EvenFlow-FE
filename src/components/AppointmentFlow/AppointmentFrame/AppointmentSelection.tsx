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
    ]);

    const [date, setDate] = useState<moment.Moment>(
        appointment?.date
            ? moment.utc(appointment.date).startOf('day')
            : moment.utc().startOf('day')
    );
    const [month, setMonth] = useState<moment.Moment>(
        selectedTime ? moment.utc(selectedTime) : moment.utc()
    );
    const [loading, setLoading] = useState<boolean>(false);

    const dispatch = useDispatch();
    const initRef = useRef<boolean>(false);

    const {id} = useParams();

    const isMount = useRef(true);

    useEffect(() => {
        if (slots.length && isMount.current) {
            if (appointment?.date) {
                setDate(moment.utc(appointment.date).startOf('day'))
            } else {
                if (selectedTime) setDate(moment.utc(selectedTime).startOf('day'));
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
        if (selectedPackage) {
            const price = selectedPackage.serviceRequests.reduce((acc, el) => acc + el.price, 0);
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Service Requests',
                label: `Requests Codes: 
                ${selectedPackage.serviceRequests.map(item => (`${item.code} - ${item.description}`)).join(', ')}
                ${!isNaN(price) ? `with Total Price $${+price}` : ''}`,
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
        if (selectedTimingType && selectedTimingType !== EAppointmentTimingType.FirstAvailable) {
            setDate(d.startOf('day'));   
        }
    }, [selectedTimingType]);

    const handleDateRangeSet = useCallback((v: boolean) => {
        initRef.current = v;
    }, []);

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
                        serviceCategoryId: subService?.id ?? service?.id,
                        countOfDays: Math.abs(sd.diff(moment(sd).endOf("month"), "days")) + 1,
                        customerId: customerData?.id,
                        warrantyExpiration: selectedVehicle?.warrantyExpiration
                    }
                    if (dd.serviceCategoryId && dd.serviceCategoryId < 1) {
                        dd.serviceCategoryId = undefined;
                    }
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
        selectedVehicle, customerData, service, handleDateRangeSet,
        subService, selectedPackage, setDateCallback, selectedOpsCodes, consultant
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
            {/*<Actions onBack={handleBack} onNext={handleNext} nextDisabled={!appointment} />*/}
        </StepWrapper>
    );
};