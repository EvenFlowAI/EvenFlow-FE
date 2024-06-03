import React, {useEffect, useMemo, useState} from 'react';
import {StepWrapper} from "../../../../components/styled/StepWrapper";
import {ActionButtons} from "../../ActionButtons/ActionButtons";
import {AppointmentUserData} from "../../AppointmentUserData/AppointmentUserData";
import {Button} from "@mui/material";
import {AppointmentSelectedDate} from "../../AppointmentSelectedDate/AppointmentSelectedDate";
import {AppointmentReminders} from "../../AppointmentReminders/AppointmentReminders";
import {TArgCallback, TCallback, TError} from "../../../../types/types";
import {decodeSCID, getAppointmentDate} from "../../../../utils/utils";
import {
    clearAppointmentData,
    createOrUpdateAppointment,
    loadAppointmentRequestsPrices, searchForCustomerConsents,
    setAppointmentSaving,
    setCurrentFrameScreen,
    setReminders,
    setServiceOptionChanged,
    setSideBarSteps,
    setVehicle,
    setWelcomeScreenView
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useHistory, useParams} from "react-router-dom";
import {
    loadAllServiceCategories,
    loadSRs,
    setCustomerLoadedData,
} from "../../../../store/reducers/appointment/actions";
import AppointmentVehicleInfo from "../../AppointmentVehicleInfo/AppointmentVehicleInfo";
import PaymentTypeModal from "../../PaymentTypeModal/PaymentTypeModal";
import {useTranslation} from "react-i18next";
import ServiceRequestsManaging from "./ServiceRequestsManaging/ServiceRequestsManaging";
import {SelectedPriceManaging} from "./SelectedPriceManaging/SelectedPriceManaging";
import ServiceTypeManaging from "./ServiceTypeManaging/ServiceTypeManaging";
import {ReviewManaging} from "./ReviewManaging/ReviewManaging";
import ConfirmCancelUpdate from "./ConfirmCancelUpdateModal/ConfirmCancelUpdate";
import {ILoadedVehicle} from "../../../../api/types";
import {loadCategoriesByQuery} from "../../../../store/reducers/categories/actions";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {setChangesCompletedOpen, setSlotsWarningOpen} from "../../../../store/reducers/modals/actions";
import {API} from "../../../../api/api";
import {isMobile} from 'react-device-detect';
import DetailedFeesManage from "../AppointmentConfirmation/DetailedFees/DetailedFeesManage";
import {loadFirstScreenOptionsByQuery} from "../../../../store/reducers/serviceTypes/actions";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import AddressManaging from "./AddressManaging/AddressManaging";
import {ButtonWrapper, ManageTitle, Wrapper} from "./styles";
import {useModal} from "../../../../hooks/useModal/useModal";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";
import {Routes} from "../../../../routes/constants";
import CustomerConsents from "../../../../components/modals/booking/CustomerConsents/CustomerConsents";
import OpenModalLink from "../../../../components/wrappers/OpenModalLink/OpenModalLink";
import CommentModal from "../../../../components/modals/booking/CommentModal/CommentModal";

type TProps = {
    onChangeSlot: TCallback;
    onUpdateAppointment: TArgCallback<ILoadedVehicle>;
};

export const ManageAppointment: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({onChangeSlot, onUpdateAppointment}) => {
    const {isAdvisorAvailable, currentConfig} = useSelector(({bookingFlowConfig}: RootState) => bookingFlowConfig);
    const {
        scProfile,
        appointmentWasChanged,
        serviceValetAppointment,
        appointment,
    } = useSelector(({appointment}: RootState) => appointment);
    const {
        isAppointmentSaving,
        serviceTypeOption,
        customer,
        selectedVehicle,
        appointmentByKey,
        transportation,
        isConsentsLoading,
    } = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const {isLoading} = useSelector(({recalls}: RootState) => recalls);

    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const currentUser = useCurrentUser();
    const {id} = useParams<{id: string}>();
    const {isOpen: isFeesOpen, onClose: onFeesClose, onOpen: onFeesOpen} = useModal();
    const {isOpen: isPaymentOpen, onClose: onPaymentClose, onOpen: onPaymentOpen} = useModal();
    const {isOpen: isCancelConfirmOpen, onClose: onCancelConfirmClose, onOpen: onCancelConfirmOpen} = useModal();
    const {isOpen: isCommentOpen, onClose: onCommentClose, onOpen: onCommentOpen} = useModal();

    const showError = useException();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {askConfirm} = useConfirm();
    const showMessage = useMessage();
    const history = useHistory();

    const isEmailRequired = useMemo(() => {
        return currentUser
            ? Boolean(scProfile?.emailRequirement?.adminAndEmployeesEnabled)
            : Boolean(scProfile?.emailRequirement?.customerSelfServiceEnabled)
    }, [currentUser, scProfile])


    useEffect(() => {
        if (scProfile) {
            dispatch(loadCategoriesByQuery(scProfile.id))
            dispatch(loadSRs(scProfile.id))
        }
    }, [scProfile, serviceTypeOption])

    useEffect(() => {
        if (scProfile) {
            dispatch(loadAllServiceCategories(scProfile.id));
        }
    }, [scProfile, id])

    useEffect(() => {
        if (currentConfig && scProfile) dispatch(loadFirstScreenOptionsByQuery(scProfile.id))
    }, [currentConfig, scProfile])

    useEffect(() => {
        if (scProfile && appointmentWasChanged) {
            dispatch(loadAppointmentRequestsPrices(scProfile.id))
        }
    }, [scProfile, appointmentWasChanged])

    useEffect(() => {
        dispatch(setReminders([0, 2]));
    }, [])

    const checkIsValid = () => {
        let isValid = true;
        const localErrors: string[] = [];
        if (!customer.email && isEmailRequired) {
            isValid = false;
            localErrors.push('email')
            showError('"Email" must not be empty')
        }
        if (!customer?.fullName) {
            isValid = false;
            localErrors.push('fullname')
            showError('"Full Name" must not be empty')
        }
        if (!customer?.phoneNumber) {
            isValid = false;
            localErrors.push('phonenumber')
            showError('"Phone Number" must not be empty')
        }
        if (serviceTypeOption?.type === EServiceType.PickUpDropOff && !serviceValetAppointment && !appointmentByKey?.serviceValetTime) {
            isValid = false;
            showError('Please select correct Appointment Date and Time')
        }
        if (serviceTypeOption?.type !== EServiceType.PickUpDropOff && !appointment && appointmentByKey?.serviceValetTime) {
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

    const searchForConsents = () => {
        dispatch(searchForCustomerConsents(handleCreateAppointment))
    }

    const onCancelChanges = () => {
        setLoading(true)
        if (selectedVehicle) {
            const vehicle = {
                ...selectedVehicle,
                vin: appointmentByKey?.vehicle?.vin ?? '',
                mileage: appointmentByKey?.vehicle?.mileage ?? null,
                engineTypeId: appointmentByKey?.vehicle?.engineTypeId ?? null,
            };
            dispatch(setVehicle(vehicle));
            dispatch(clearAppointmentData())
            dispatch(setServiceOptionChanged(false));
            onUpdateAppointment(vehicle)
            setTimeout(() => setLoading(false), 3000)
        }
    }

    const handleCancelAppointment = async () => {
        if (appointmentByKey) {
            dispatch(setAppointmentSaving(true))
            try {
                const key = appointmentByKey.hashKey;
                await API.appointment.cancelByKey(key);
                showMessage(
                    <div>
                        Your appointment has been canceled. <br/>
                        Please do not forget to update the appointment in your calendar.
                    </div>
                );
                dispatch(setSideBarSteps([]));
                dispatch(setServiceOptionChanged(false));
                dispatch(setVehicle(null));
                dispatch(clearAppointmentData());
                dispatch(setCustomerLoadedData(null));
                dispatch(setWelcomeScreenView("select"))
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
        if (appointmentByKey) {
            askConfirm({
                isRemove: true,
                confirmContent: "Cancel appointment",
                title: "Cancel appointment",
                content: <span>
                            Please confirm you want to cancel appointment on {getAppointmentDate(appointmentByKey)}?
                        </span>,
                onConfirm: handleCancelAppointment
            });
        }

    }

    return <StepWrapper>
        <ManageTitle>Manage Appointment</ManageTitle>
        <Wrapper>
            {isAppointmentSaving || isConsentsLoading
                ? <Loading/>
                : <React.Fragment>
                    <div>
                        <AppointmentSelectedDate onChangeSlot={onChangeSlot} />
                        <AppointmentVehicleInfo/>
                        {isLoading ? <Loading/> : <ServiceRequestsManaging/>}
                        <AddressManaging/>
                        <SelectedPriceManaging/>
                        <OpenModalLink onClick={onFeesOpen} text={t("View itemized fees of services")}/>
                        <ServiceTypeManaging/>
                        {transportation || serviceTypeOption?.transportationOption || isAdvisorAvailable
                            ? <ReviewManaging/>
                            : null}
                        <OpenModalLink onClick={onCommentOpen} text={t("View Appointment Comments")}/>
                    </div>
                    <div>
                        <AppointmentUserData errors={errors} setErrors={setErrors} isEmailRequired={isEmailRequired}/>
                        <AppointmentReminders isEmailRequired={isEmailRequired}/>
                    </div>
                </React.Fragment>
            }

        </Wrapper>
        {/*todo change to open payment window on next*/}
        {isAppointmentSaving || isConsentsLoading
            ? null
            :  <ActionButtons
                loading={isAppointmentSaving || isConsentsLoading}
                nextDisabled={loading}
                onBack={onCancelConfirmOpen}
                onNext={searchForConsents}
                nextLabel="Confirm Changes"
                prevLabel="Cancel Changes"
            />}

        {isAppointmentSaving || isConsentsLoading
            ? null
            :  <ButtonWrapper>
                <Button
                    disabled={isAppointmentSaving || isConsentsLoading}
                    variant="text"
                    onClick={onCancelAppointment}>
                    Cancel Appointment
                </Button>
            </ButtonWrapper>}

        <DetailedFeesManage open={isFeesOpen} onClose={onFeesClose}/>
        <PaymentTypeModal open={isPaymentOpen} onClose={onPaymentClose} onNo={searchForConsents}/>
        <CommentModal open={isCommentOpen} onClose={onCommentClose}/>
        <ConfirmCancelUpdate open={isCancelConfirmOpen} onClose={onCancelConfirmClose} onCancelChanges={onCancelChanges}/>
        <CustomerConsents onNext={handleCreateAppointment}/>
    </StepWrapper>
};