import React, {useEffect, useMemo, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {UserData} from "./confirmationSections/UserData";
import {Button, styled} from "@material-ui/core";
import {SelectedDate} from "./confirmationSections/SelectedDate";
import {Reminders} from "./confirmationSections/Reminders";
import {TArgCallback, TCallback} from "../../../types/types";
import {decodeSCID} from "../../../utils/utils";
import {
    clearAppointmentData,
    createOrUpdateAppointment,
    loadAppointmentRequestsPrices,
    setAppointmentSaving,
    setCurrentFrameScreen,
    setReminders, setServiceOptionChanged, setSideBarSteps, setVehicle,
    setWelcomeScreenView
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useHistory, useParams} from "react-router-dom";
import {useConfirm, useCurrentUser, useException, useMessage, useModal} from "../../../utils/hooks";
import {
    loadAllServiceCategories, loadSRs, setCustomerLoadedData,
} from "../../../store/reducers/appointment/actions";
import Vehicle from "./confirmationSections/Vehicle";
import PaymentType from "../../Modals/PaymentType/PaymentType";
import {useTranslation} from "react-i18next";
import ServiceRequestsManage from "./manageSections/ServiceRequestsManage";
import {SelectedPriceManage} from "./manageSections/SelectedPriceManage";
import ServiceTypeManage from "./manageSections/ServiceTypeManage";
import {ReviewManage} from "./manageSections/ReviewManage";
import ConfirmCancelUpdate from "../../Modals/ConfirmCancelUpdate/ConfirmCancelUpdate";
import {ILoadedVehicle} from "../../../api/types";
import {loadCategoriesByQuery} from "../../../store/reducers/categories/actions";
import {Loading} from "../../UI/Loading";
import {setChangesCompletedOpen, setSlotsWarningOpen} from "../../../store/reducers/modals/actions";
import AddressManage from "./manageSections/AddressManage";
import {API} from "../../../api/api";
import {Routes} from "../../../config/routes";
import {isMobile} from 'react-device-detect';
import moment from "moment/moment";
import DetailedFeesManage from "../../Modals/DetailedFees/DetailedFeesManage";
import {loadFirstScreenOptionsByQuery} from "../../../store/reducers/serviceTypes/actions";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";

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
        gridTemplateColumns: "1fr"
    },
}));

const ButtonWrapper = styled('div')(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    "& > button": {
        color: "#142EA1"
    }
}));

const ManageTitle = styled('div')({
    fontSize: 20,
    fontWeight: 700,
    textTransform: 'uppercase'
})

const Info = styled('div')({
    fontSize: 12
});

interface TError {
    field: string,
    message: string
}

type TProps = {
    onChangeSlot: TCallback;
    onUpdateAppointment: TArgCallback<ILoadedVehicle>;
};

export const ManageAppointment: React.FC<TProps> = ({onChangeSlot, onUpdateAppointment}) => {
    const [appointment, appointmentFrame, saving] = useSelector((state: RootState) => [
        state.appointment,
        state.appointmentFrame,
        state.appointmentFrame.isAppointmentSaving,
    ]);
    const {isAdvisorAvailable, currentConfig} = useSelector((state: RootState) => state.bookingFlowConfig);

    const [errors, setErrors] = useState<string[]>([]);
    const currentUser = useCurrentUser();
    const {id} = useParams();
    const {isOpen: isFeesOpen, onClose: onFeesClose, onOpen: onFeesOpen} = useModal();
    const {isOpen: isPaymentOpen, onClose: onPaymentClose, onOpen: onPaymentOpen} = useModal();
    const {isOpen: isCancelConfirmOpen, onClose: onCancelConfirmClose, onOpen: onCancelConfirmOpen} = useModal();

    const showError = useException();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {askConfirm} = useConfirm();
    const showMessage = useMessage();
    const history = useHistory();

    const isEmailRequired = useMemo(() => {
        return currentUser
            ? Boolean(appointment.scProfile?.emailRequirement?.adminAndEmployeesEnabled)
            : Boolean(appointment.scProfile?.emailRequirement?.customerSelfServiceEnabled)
    }, [currentUser, appointment.scProfile])


    useEffect(() => {
        if (appointment?.scProfile) {
            dispatch(loadCategoriesByQuery(appointment.scProfile.id))
            dispatch(loadSRs(appointment.scProfile.id))
        }
    }, [appointment.scProfile, appointmentFrame.serviceTypeOption])

    useEffect(() => {
        if (appointment.scProfile) {
            dispatch(loadAllServiceCategories(appointment.scProfile.id));
        }
    }, [appointment.scProfile, id])

    useEffect(() => {
        if (currentConfig && appointment.scProfile) dispatch(loadFirstScreenOptionsByQuery(appointment.scProfile.id))
    }, [currentConfig, appointment.scProfile])

    useEffect(() => {
        if (appointment?.scProfile && appointment.appointmentWasChanged) {
            dispatch(loadAppointmentRequestsPrices(appointment.scProfile.id))
        }
    }, [appointment?.scProfile, appointment.appointmentWasChanged])

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
        if (appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff && !appointment.serviceValetAppointment && !appointmentFrame.appointmentByKey?.serviceValetTime) {
            isValid = false;
            showError('Please select correct Appointment Date and Time')
        }
        if (appointmentFrame.serviceTypeOption?.type !== EServiceType.PickUpDropOff && !appointment.appointment && appointmentFrame.appointmentByKey?.serviceValetTime) {
            isValid = false;
            showError('Please select correct Appointment Date and Time')
        }
        setErrors(localErrors)
        return isValid;
    }

    const handleError = (e: any) => {
        const timeSlotUnavailable = e.response?.data?.message?.toLowerCase().includes("time slot");
        const dateForZoneUnavailable = e.response?.data?.message?.toLowerCase().includes("is not available for this geographic zone or for the date");
        if (timeSlotUnavailable || dateForZoneUnavailable) {
            dispatch(setChangesCompletedOpen(false))
            dispatch(setSlotsWarningOpen(true))
        } else {
            showError(e);
        }
        if (e.response?.data?.errors) {
            const data = [...e.response.data.errors]
            setErrors(() => {
                return data.map((err: TError): string => err.field?.split('.')[1].toLowerCase());
            })
        }
    }

    const onNext = () => {
        dispatch(setCurrentFrameScreen("appointmentConfirmed"))
    }

    const handleCreateAppointment = () => {
        if (checkIsValid()) {
            dispatch(createOrUpdateAppointment(decodeSCID(id), onNext, handleError, isMobile, Boolean(currentUser)))
        }
    }

    const onCancelChanges = () => {
        if (appointmentFrame.selectedVehicle) {
            const vehicle = {...appointmentFrame.selectedVehicle};
            dispatch(clearAppointmentData())
            dispatch(setServiceOptionChanged(false));
            onUpdateAppointment(vehicle)
        }
    }

    const handleCancelAppointment = async () => {
        if (appointmentFrame.appointmentByKey) {
            dispatch(setAppointmentSaving(true))
            try {
                const key = appointmentFrame.appointmentByKey.hashKey;
                await API.appointment.cancelByKey(key);
                await showMessage(
                    <div>
                        Your appointment has been canceled. <br/>
                        Please do not forget to update the appointment in your calendar.
                    </div>
                );
                await dispatch(setSideBarSteps([]));
                await dispatch(setServiceOptionChanged(false));
                await dispatch(setVehicle(null));
                await dispatch(clearAppointmentData());
                await dispatch(setCustomerLoadedData(null));
                await dispatch(setWelcomeScreenView("select"))
                history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1")
            } catch (e) {
                showError(e);
            }
            finally {
                dispatch(setAppointmentSaving(false))
            }
        }
    }

    const onCancelAppointment = () => {
        if (appointmentFrame.appointmentByKey) {
            askConfirm({
                isRemove: true,
                confirmContent: "Cancel appointment",
                title: "Cancel appointment",
                content: <span>
                            Please confirm you want to cancel appointment on <br />
                    {moment.utc(appointmentFrame.appointmentByKey.dateInUtc).format("LLL")}?
                        </span>,
                onConfirm: handleCancelAppointment
            });
        }

    }

    return <StepWrapper>
        <ManageTitle>Manage Appointment</ManageTitle>
        <Wrapper>
            {saving
                ? <Loading/>
                : <React.Fragment>
                    <div>
                        <SelectedDate onChangeSlot={onChangeSlot} />
                        <Vehicle/>
                        <ServiceRequestsManage/>
                        <AddressManage/>
                        <SelectedPriceManage/>
                        <div
                            role="presentation"
                            style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', fontSize: 15 }}
                            onClick={onFeesOpen}>
                            {t("View itemized fees of services")}
                        </div>
                        <ServiceTypeManage/>
                        {appointmentFrame.transportation || appointmentFrame.serviceTypeOption?.transportationOption || isAdvisorAvailable
                            ? <ReviewManage/>
                            : null}
                    </div>
                    <div>
                        <UserData errors={errors} setErrors={setErrors} isEmailRequired={isEmailRequired}/>
                        <Reminders isEmailRequired={isEmailRequired}/>
                        <Info>{t("terms of our Visitor Agreement")}.</Info>
                    </div>
                </React.Fragment>
            }

        </Wrapper>
        {/*todo change to open payment window on next*/}
        {saving
            ? null
            :  <Actions
                loading={saving}
                onBack={onCancelConfirmOpen}
                onNext={handleCreateAppointment}
                nextLabel="Confirm Changes"
                prevLabel="Cancel Changes"
            />}

        {saving
            ? null
            :  <ButtonWrapper>
                <Button
                    disabled={saving}
                    variant="text"
                    onClick={onCancelAppointment}>
                    Cancel Appointment
                </Button>
            </ButtonWrapper>}

        <DetailedFeesManage open={isFeesOpen} onClose={onFeesClose}/>
        <PaymentType open={isPaymentOpen} onClose={onPaymentClose} onNo={handleCreateAppointment}/>
        <ConfirmCancelUpdate open={isCancelConfirmOpen} onClose={onCancelConfirmClose} onCancelChanges={onCancelChanges}/>
    </StepWrapper>
};