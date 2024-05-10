import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {useException} from "../../../../hooks/useException/useException";
import {EAppointmentTimingType, IAppointmentSlotsRequest} from "../../../../store/reducers/appointment/types";
import {RootState} from "../../../../store/rootReducer";
import dayjs from "dayjs";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {
    loadAppointmentSlots,
    loadServiceValetSlots,
    selectAppointment, selectServiceValetAppointment
} from "../../../../store/reducers/appointment/actions";
import {mapRecallsForRequest} from "../../../../utils/utils";
import {SelectedAppointment} from "./SelectedAppointment/SelectedAppointment";
import {SlotsScreenWrapper} from "../../../booking/AppointmentFlow/AppointmentSlots/styles";
import {ActionButtons} from "../../../booking/ActionButtons/ActionButtons";
import {
    SVAppointmentDateSelector
} from "../../../booking/AppointmentFlow/AppointmentSlots/SVAppointmentDateSelector/SVAppointmentDateSelector";
import {
    AppointmentDateSelector
} from "../../../booking/AppointmentFlow/AppointmentSlots/AppointmentDateSelector/AppointmentDateSelector";
import {TGroupedAppointments} from "../../../../utils/types";
import {groupAppointments} from "../../../booking/AppointmentFlow/AppointmentSlots/utils";
import {TParsableDate} from "../../../../types/types";
import {
    SVAppointmentTimeSelector
} from "../../../booking/AppointmentFlow/AppointmentSlots/SVAppointmentTimeSelector/SVAppointmentTimeSelector";
import {
    AppointmentTimeSelector
} from "../../../booking/AppointmentFlow/AppointmentSlots/AppointmentTimeSelector/AppointmentTimeSelector";

const CloneAppointmentModal: React.FC<DialogProps> = (props) => {
    const {currentAppointment} = useSelector((state: RootState) => state.appointments);
    const {selectedRecalls} = useSelector((state: RootState) => state.appointmentFrame);
    const {
        appointment,
        serviceValetAppointment,
        appointmentSlots,
    } = useSelector((state: RootState) => state.appointment);
    const [date, setDate] = useState<TParsableDate>(dayjs.utc().startOf('day'));
    const [month, setMonth] = useState<TParsableDate>(dayjs.utc());
    const initRef = useRef<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const showError = useException();

    const nextDisabled = useMemo(() => currentAppointment?.serviceTypeOption?.type === EServiceType.PickUpDropOff
            ? !serviceValetAppointment
            : !appointment,
        [appointment, serviceValetAppointment, currentAppointment])

    useEffect(() => {
        const utcOffset = dayjs().utcOffset()
        setLoading(true)
        if (selectedSC && currentAppointment) {
            const data: IAppointmentSlotsRequest = {
                appointmentTimingType: EAppointmentTimingType.FirstAvailable,
                serviceCenterId: selectedSC.id,
                advisorId: currentAppointment.advisor?.id ?? null,
                fromDate:dayjs().startOf("day").add(utcOffset, 'minute').toISOString(),
                maintenancePackageOption: currentAppointment.maintenancePackageOption ?? null,
                serviceRequestIds: currentAppointment.serviceRequests
                    ? currentAppointment.serviceRequests.map(el => el.id)
                    : [],
                serviceCategoryIds: currentAppointment.serviceCategories
                    ? currentAppointment.serviceCategories.map(el => el.id)
                    : [],
                customerId: currentAppointment.customerId,
                serviceTypeOptionId: currentAppointment.serviceTypeOption?.id ?? null,
                recalls: mapRecallsForRequest(selectedRecalls),
            }
            if (currentAppointment.address?.zipCode) data.zipCode = currentAppointment.address?.zipCode;
            if (currentAppointment.address) {
                data.address = currentAppointment.address.fullAddress
            }
            if (currentAppointment.vehicle) {
                data.vehicle = {
                    vin: currentAppointment.vehicle.vin,
                    year: currentAppointment.vehicle.year,
                    make: currentAppointment.vehicle.make,
                    model: currentAppointment.vehicle.model,
                    mileage: currentAppointment.vehicle.mileage,
                    engineTypeId: currentAppointment.vehicle.engineTypeId,
                }
            }
            if (currentAppointment.hashKey) data.appointmentHashKey = currentAppointment.hashKey;
            if (currentAppointment.driver?.email) data.searchTerm = currentAppointment.driver?.email;
            if (currentAppointment.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                if (data.address && data.zipCode) dispatch(loadServiceValetSlots(data));
            } else {
                dispatch(loadAppointmentSlots(data));
            }
        }
        setLoading(false)
    }, [selectedSC, currentAppointment])

    const handleCancel = () => props.onClose()
    const handleConfirm = () => {}

    const groupedAppointments: TGroupedAppointments = useMemo(() => {
        return groupAppointments(appointmentSlots);
    }, [appointmentSlots]);

    const handleDateRangeSet = useCallback((v: boolean) => {
        initRef.current = v;
    }, []);

    const updateDate = useCallback((d: TParsableDate) => {
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        setDate(dayjs(d).startOf('day'));
        if (!dayjs(d).isSame(month, 'month')) {
            setMonth(d);
        }
    }, [month]);

    return <BaseModal {...props} width={900}>
        <DialogTitle onClose={props.onClose}/>
        <DialogContent style={{padding: '0 36px 36px 36px'}}>
            <SlotsScreenWrapper>
                <SelectedAppointment/>
                <ActionButtons
                    color="info"
                    onBack={handleCancel}
                    onNext={handleConfirm}
                    nextDisabled={nextDisabled}
                    nextLabel={"Confirm"}
                    prevLabel={"Cancel"}/>
                {currentAppointment?.serviceTypeOption?.type === EServiceType.PickUpDropOff
                    ? <SVAppointmentDateSelector
                        onDateRangeSet={handleDateRangeSet}
                        dateRangeUpdated={initRef.current}
                        dateChangeDisabled
                        date={date}
                        loading={loading}
                        onDateChange={updateDate} />
                    : <AppointmentDateSelector
                        dateChangeDisabled
                        appointments={groupedAppointments}
                        date={date}
                        onDateRangeSet={handleDateRangeSet}
                        dateRangeUpdated={initRef.current}
                        loading={loading}
                        onDateChange={updateDate} />
                }
                {currentAppointment?.serviceTypeOption?.type === EServiceType.PickUpDropOff
                    ? <SVAppointmentTimeSelector
                        date={date}
                        loading={loading}/>
                    : <AppointmentTimeSelector
                        appointments={
                            groupedAppointments[dayjs(date).toISOString().replace('.000', '')]
                        }
                        date={date}
                        loading={loading}/>}
            </SlotsScreenWrapper>
        </DialogContent>
    </BaseModal>
};

export default CloneAppointmentModal;