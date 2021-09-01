import React, {useCallback, useEffect, useMemo, useState} from 'react';
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


const Wrapper = styled('div')({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: "20px",
    "&>div": {
        border: "1px solid #DADADA",
        padding: "18px 44px",
        "&>h4": {
            fontSize: 16,
            margin: "0 0 16px",
            padding: 0,
            fontWeight: "bold",
            textTransform: "uppercase"
        }
    }
});



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
        selectedOpsCodes
    ] = useSelector((state: RootState) => [
        state.appointment.appointmentSlots,
        state.appointmentFrame.selectedTiming,
        state.appointmentFrame.selectedTime,
        state.appointment.customerLoadedData,
        state.appointment.customerSelectedVehicle,
        state.appointmentFrame.service,
        state.appointmentFrame.subService,
        state.appointmentFrame.selectedPackage,
        state.appointment.selectedSR
    ]);

    const [date, setDate] = useState<moment.Moment>(
        selectedTime ? moment.utc(selectedTime) : moment.utc()
    );
    const [month, setMonth] = useState<moment.Moment>(
        selectedTime ? moment.utc(selectedTime) : moment.utc()
    );
    const [loading, setLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    const {id} = useParams();

    const updateDate = useCallback((d: moment.Moment) => {
        setDate(d);
        if (!d.isSame(month, 'month')) {
            setMonth(d);
        }
    }, [month]);

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
                        // onlyOffers: filters.offersOnly,
                        // shorterWaitTime: filters.waitTimeOnly,
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
                    await dispatch(loadAppointmentSlots(dd, updateDate));
                } finally {
                    setLoading(false);
                }
            }
        }
        loadData().finally();
    }, [
        dispatch, id, selectedTimingType, month,
        selectedVehicle, customerData, service,
        subService, selectedPackage, updateDate, selectedOpsCodes
    ]);

    const groupedAppointments: TGroupedAppointments = useMemo(() => {
        return groupAppointments(slots);
    }, [slots]);

    return (
        <StepWrapper>
            <Wrapper>
                <SelectedAppointment />
                <AppointmentDateSelector
                    appointments={groupedAppointments}
                    date={date}
                    loading={loading} onDateChange={updateDate} />
                <AppointmentTimeSelector
                    appointments={
                        groupedAppointments[date.toISOString().replace('.000', '')]
                    }
                    date={date}
                    loading={loading}
                />
            </Wrapper>
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};