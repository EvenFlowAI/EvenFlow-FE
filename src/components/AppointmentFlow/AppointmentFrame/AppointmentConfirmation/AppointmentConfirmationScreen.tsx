import React, {useEffect, useMemo, useState} from 'react';
import {TActionProps} from "../types";
import {StepWrapper} from "../SideBarSteps/parts/StepWrapper";
import {Actions} from "../Actions/Actions";
import {UserData} from "./parts/UserData";
import {styled} from "@material-ui/core";
import {SelectedDate} from "./parts/SelectedDate";
import {Review} from "./parts/Review";
import {SelectedPrice} from "./parts/SelectedPrice";
import {Reminders} from "./parts/Reminders";
import {TCallback} from "../../../../types/types";
import {decodeSCID} from "../../../../utils/utils";
import {
    createOrUpdateAppointment, showPrevScreen,
    setReminders
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {useCurrentUser, useException, useModal} from "../../../../utils/hooks";
import {
    loadAllServiceCategories,
} from "../../../../store/reducers/appointment/actions";
import Vehicle from "./parts/Vehicle";
import ServiceRequests from "./parts/ServiceRequests";
import DetailedFees from "../../../Modals/DetailedFees/DetailedFees";
import Address from "./parts/Address";
import PaymentType from "../../../Modals/PaymentType/PaymentType";
import ServiceType from "./parts/ServiceType";
import {useTranslation} from "react-i18next";
import {isMobile} from 'react-device-detect';
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";

const Wrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "80px",
    "&>div": {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "flex-start",
        alignItems: "stretch"
    },
    "& > .itemizedLink": {
        textDecoration: 'underline',
        textTransform: 'none',
    },
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr",
        gap: "20px",
    }
}));

const Info = styled('div')({
    fontSize: 12
});

interface TError {
    field: string,
    message: string
}

type TProps = {
    onChangeSlot: TCallback;
} & TActionProps;

export const AppointmentConfirmationScreen: React.FC<TProps> = ({onBack, onChangeSlot, onNext}) => {
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

    const handleBack = () => dispatch(showPrevScreen())

    return <StepWrapper>
        <Wrapper>
            <div>
                <SelectedDate onChangeSlot={onChangeSlot} />
                <Vehicle/>
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
                <UserData errors={errors} setErrors={setErrors} isEmailRequired={isEmailRequired}/>
                <Reminders isEmailRequired={isEmailRequired}/>
                <Info>{t("terms of our Visitor Agreement")}.</Info>
            </div>

        </Wrapper>
        {/*todo change to open payment window on next*/}
        <Actions loading={saving} onBack={handleBack} onNext={handleCreateAppointment} />
        <DetailedFees open={isFeesOpen} onClose={onFeesClose}/>
        <PaymentType open={isPaymentOpen} onClose={onPaymentClose} onNo={handleCreateAppointment}/>
    </StepWrapper>
};