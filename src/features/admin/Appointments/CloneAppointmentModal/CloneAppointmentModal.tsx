import React, {useCallback, useMemo, useRef, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {useException} from "../../../../hooks/useException/useException";
import {RootState} from "../../../../store/rootReducer";
import dayjs from "dayjs";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {
    selectAppointment, selectServiceValetAppointment
} from "../../../../store/reducers/appointment/actions";
import {SelectedAppointment} from "./SelectedAppointment/SelectedAppointment";
import {SlotsScreenWrapper} from "../../../booking/AppointmentFlow/AppointmentSlots/styles";
import {ActionButtons} from "../../../booking/ActionButtons/ActionButtons";
import {
    SVAppointmentDateSelector
} from "../../../../components/bookingDateTime/SVAppointmentDateSelector/SVAppointmentDateSelector";
import {
    AppointmentDateSelector
} from "../../../../components/bookingDateTime/AppointmentDateSelector/AppointmentDateSelector";
import {TGroupedAppointments} from "../../../../utils/types";
import {groupAppointments} from "../../../booking/AppointmentFlow/AppointmentSlots/utils";
import {TCallback, TParsableDate} from "../../../../types/types";
import {
    SVAppointmentTimeSelector
} from "../../../../components/bookingDateTime/SVAppointmentTimeSelector/SVAppointmentTimeSelector";
import {
    AppointmentTimeSelector
} from "../../../../components/bookingDateTime/AppointmentTimeSelector/AppointmentTimeSelector";
import {
    cloneAppointment,
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useModal} from "../../../../hooks/useModal/useModal";
import Informing from "../../../../components/modals/common/Informing/Informing";
import {clearAfterCloning} from "../../../../store/reducers/appointments/actions";

const CloneAppointmentModal: React.FC<DialogProps & {onViewClose: TCallback}> = (props) => {
    const {currentAppointment, isAppointmentLoading} = useSelector((state: RootState) => state.appointments);
    const {isAppointmentSaving} = useSelector((state: RootState) => state.appointmentFrame);
    const {
        appointment,
        serviceValetAppointment,
        appointmentSlots,
    } = useSelector((state: RootState) => state.appointment);
    const [date, setDate] = useState<TParsableDate>(dayjs.utc().startOf('day'));
    const [month, setMonth] = useState<TParsableDate>(dayjs.utc());
    const [newHashKey, setNewHashKey] = useState<string>('');

    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const {onOpen, isOpen, onClose} = useModal();
    const initRef = useRef<boolean>(false);
    const isLoading = isAppointmentLoading || isAppointmentSaving;

    const dateString = useMemo(() => {
        return appointment
            ? dayjs.utc(appointment.date).format('ddd, MMMM D, h:mm A')
            : serviceValetAppointment
                ? dayjs.utc(serviceValetAppointment.date)
                    .set('hour', +serviceValetAppointment.pickUpMin.split(":")[0])
                    .set('minute', +serviceValetAppointment.pickUpMin.split(":")[1])
                    .format("ddd, MMMM D, h:mm A")
                : ""
    }, [appointment, serviceValetAppointment])

    const nextDisabled = useMemo(() => currentAppointment?.serviceTypeOption?.type === EServiceType.PickUpDropOff
            ? !serviceValetAppointment
            : !appointment,
        [appointment, serviceValetAppointment, currentAppointment])

    const onCloneClose = () => {
        dispatch(clearAfterCloning())
        props.onClose()
    }

    const onCloneSuccess = (hashKey: string) => {
        setNewHashKey(hashKey)
        onOpen()
    }

    const handleConfirm = () => {
        selectedSC && dispatch(cloneAppointment(selectedSC.id, onCloneSuccess, showError))
    }

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

    const onRedirect = async () => {
        if (newHashKey) {
            const url = window.location.href.replace('/admin/appointments', `/appointment-update/${newHashKey}?fromAdmin=true`)
            window.open(url, '_blank', 'noreferrer');
        }
    };

    const onInformClose = () => {
        onClose();
        onCloneClose();
        props.onViewClose();
    }

    return <BaseModal {...props} width={900}>
        <DialogTitle onClose={onCloneClose}/>
        <DialogContent style={{padding: '0 36px 36px 36px'}}>
            <SlotsScreenWrapper>
                <SelectedAppointment/>
                <ActionButtons
                    color="info"
                    onBack={onCloneClose}
                    onNext={handleConfirm}
                    nextDisabled={nextDisabled}
                    nextLabel={"Confirm"}
                    prevLabel={"Cancel"}
                    loading={isLoading}/>
                {currentAppointment?.serviceTypeOption?.type === EServiceType.PickUpDropOff
                    ? <SVAppointmentDateSelector
                        onDateRangeSet={handleDateRangeSet}
                        dateRangeUpdated={initRef.current}
                        dateChangeDisabled
                        date={date}
                        loading={isLoading}
                        onDateChange={updateDate} />
                    : <AppointmentDateSelector
                        dateChangeDisabled
                        appointments={groupedAppointments}
                        date={date}
                        onDateRangeSet={handleDateRangeSet}
                        dateRangeUpdated={initRef.current}
                        loading={isLoading}
                        onDateChange={updateDate} />
                }
                {currentAppointment?.serviceTypeOption?.type === EServiceType.PickUpDropOff
                    ? <SVAppointmentTimeSelector
                        date={date}
                        loading={isLoading}/>
                    : <AppointmentTimeSelector
                        appointments={
                            groupedAppointments[dayjs(date).toISOString().replace('.000', '')]
                        }
                        date={date}
                        loading={isLoading}/>}
            </SlotsScreenWrapper>
            <Informing
                open={isOpen}
                onClose={onInformClose}
                actionButtonText="Modify Appointment"
                onActionClick={onRedirect}
                title={`Success! The appointment has been \n confirmed for ${dateString}`}
            />
        </DialogContent>
    </BaseModal>
};

export default CloneAppointmentModal;