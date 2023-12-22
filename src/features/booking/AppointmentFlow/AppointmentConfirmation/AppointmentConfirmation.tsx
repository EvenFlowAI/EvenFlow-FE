import React, {useEffect, useMemo, useState} from 'react';
import {StepWrapper} from "../../../../components/styled/StepWrapper";
import {ActionButtons} from "../../ActionButtons/ActionButtons";
import {AppointmentUserData} from "../../AppointmentUserData/AppointmentUserData";
import {AppointmentSelectedDate} from "../../AppointmentSelectedDate/AppointmentSelectedDate";
import {Review} from "./Review/Review";
import {SelectedPrice} from "./SelectedPrice/SelectedPrice";
import {AppointmentReminders} from "../../AppointmentReminders/AppointmentReminders";
import {TActionProps, TCallback, TError} from "../../../../types/types";
import {decodeSCID} from "../../../../utils/utils";
import {createOrUpdateAppointment, setReminders} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {loadAllServiceCategories,} from "../../../../store/reducers/appointment/actions";
import AppointmentVehicleInfo from "../../AppointmentVehicleInfo/AppointmentVehicleInfo";
import ServiceRequests from "./ServiceRequests/ServiceRequests";
import DetailedFees from "../../../../components/modals/booking/DetailedFees/DetailedFees";
import Address from "./Address/Address";
import PaymentType from "../../../../components/modals/booking/PaymentType/PaymentType";
import ServiceType from "./ServiceType/ServiceType";
import {useTranslation} from "react-i18next";
import {isMobile} from 'react-device-detect';
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {Info, Wrapper} from "./styles";
import {useModal} from "../../../../hooks/useModal/useModal";
import {useException} from "../../../../hooks/useException/useException";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";

type TProps = {
    onChangeSlot: TCallback;
} & TActionProps;

export const AppointmentConfirmation: React.FC<TProps> = ({onBack, onChangeSlot, onNext}) => {
    const [errors, setErrors] = useState<string[]>([]);
    const {isAdvisorAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const currentUser = useCurrentUser();
    const [appointment, appointmentFrame, saving] = useSelector((state: RootState) => [
        state.appointment,
        state.appointmentFrame,
        state.appointmentFrame.isAppointmentSaving,
    ]);

    const {id} = useParams();
    const {isOpen: isFeesOpen, onClose: onFeesClose, onOpen: onFeesOpen} = useModal();
    const {isOpen: isPaymentOpen, onClose: onPaymentClose, onOpen: onPaymentOpen} = useModal();

    const showError = useException();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const isEmailRequired = useMemo(() => {
        return currentUser
            ? Boolean(appointment.scProfile?.emailRequirement?.adminAndEmployeesEnabled)
            : Boolean(appointment.scProfile?.emailRequirement?.customerSelfServiceEnabled)
    }, [currentUser, appointment.scProfile])

    useEffect(() => {
        appointment?.scProfile && dispatch(loadAllServiceCategories(appointment.scProfile.id));
    }, [appointment.scProfile])

    useEffect(() => {
        dispatch(setReminders([0, 2]));
    }, [])

    const checkIsValid = () => {
        let isValid = true;
        const localErrors: string[] = [];
        if (!appointmentFrame.customer.email && isEmailRequired) {
            isValid = false;
            localErrors.push('email')
            showError('"Email" must not be empty')
        }
        if (!appointmentFrame.customer?.fullName) {
            isValid = false;
            localErrors.push('fullname')
            showError('"Full Name" must not be empty')
        }
        if (!appointmentFrame.customer?.phoneNumber) {
            isValid = false;
            localErrors.push('phonenumber')
            showError('"Phone Number" must not be empty')
        }
        const invalidServiceValetSlot = appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff && !appointment.serviceValetAppointment;
        const invalidSlot = appointmentFrame.serviceTypeOption?.type !== EServiceType.PickUpDropOff && !appointment.appointment;
        if (invalidServiceValetSlot || invalidSlot) {
            isValid = false;
            showError('Selected date and time are not correct. Please select correct date and time or cancel all changes')
        }
        setErrors(localErrors)
        return isValid;
    }

    const handleError = (e: any) => {
        showError(e);
        if (e.response?.data?.errors) {
            const data = [...e.response.data.errors]
            setErrors(() => {
                return data.map((err: TError): string => err.field?.split('.')[1].toLowerCase());
            })
        }
    }

    const handleCreateAppointment = () => {
        if (checkIsValid()) {
            dispatch(createOrUpdateAppointment(decodeSCID(id), onNext, handleError, isMobile, Boolean(currentUser)))
        }
    }

    return <StepWrapper>
        <Wrapper>
            <div>
                <AppointmentSelectedDate onChangeSlot={onChangeSlot} />
                <AppointmentVehicleInfo/>
                <ServiceRequests/>
                <Address/>
                <SelectedPrice/>
                <div
                    role="presentation"
                    style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', fontSize: 15 }}
                    onClick={onFeesOpen}>
                    {t("View itemized fees of services")}
                </div>
                <ServiceType/>
                {appointmentFrame.transportation || appointmentFrame.serviceTypeOption?.transportationOption || isAdvisorAvailable
                    ? <Review/>
                    : null}
            </div>
            <div>
                <AppointmentUserData errors={errors} setErrors={setErrors} isEmailRequired={isEmailRequired}/>
                <AppointmentReminders isEmailRequired={isEmailRequired}/>
                <Info>{t("terms of our Visitor Agreement")}.</Info>
            </div>

        </Wrapper>
        {/*todo change to open payment window on next*/}
        <ActionButtons loading={saving} onBack={onBack} onNext={handleCreateAppointment} />
        <DetailedFees open={isFeesOpen} onClose={onFeesClose}/>
        <PaymentType open={isPaymentOpen} onClose={onPaymentClose} onNo={handleCreateAppointment}/>
    </StepWrapper>
};