import React, {useEffect, useMemo, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {UserData} from "./confirmationSections/UserData";
import {styled} from "@material-ui/core";
import {SelectedDate} from "./confirmationSections/SelectedDate";
import {Review} from "./confirmationSections/Review";
import {SelectedPrice} from "./confirmationSections/SelectedPrice";
import {Reminders} from "./confirmationSections/Reminders";
import {TCallback} from "../../../types/types";
import {ICreateAppointmentResp} from "../../../api/types";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";
import moment from "moment";
import {decodeSCID} from "../../../utils/utils";
import {collectServiceRequestIds, getCategories, getVehicleData, mapRecallsForRequest} from "./utils";
import {Api} from "../../../config/requests";
import {
    handleAppointmentResponse,
    setAppointmentSaving,
    setReminders
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {useCurrentUser, useException, useModal} from "../../../utils/hooks";
import {
    loadAllServiceCategories,
} from "../../../store/reducers/appointment/actions";
import Vehicle from "./confirmationSections/Vehicle";
import ServiceRequests from "./confirmationSections/ServiceRequests";
import DetailedFees from "../../Modals/DetailedFees/DetailedFees";
import Address from "./confirmationSections/Address";
import PaymentType from "../../Modals/PaymentType/PaymentType";
import ServiceType from "./confirmationSections/ServiceType";
import {useTranslation} from "react-i18next";
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

export const AppointmentConfirmationFrame: React.FC<TProps> = ({onBack, onChangeSlot, onNext}) => {
    const [errors, setErrors] = useState<string[]>([]);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const currentUser = useCurrentUser();
    const [appointment, appointmentFrame, categories, customerEnteredEmail, saving] = useSelector((state: RootState) => [
        state.appointment,
        state.appointmentFrame,
        state.categories,
        state.appointment.customerEnteredEmail,
        state.appointmentFrame.isAppointmentSaving,
    ]);

    const {id} = useParams();
    const {isOpen: isFeesOpen, onClose: onFeesClose, onOpen: onFeesOpen} = useModal();
    const {isOpen: isPaymentOpen, onClose: onPaymentClose, onOpen: onPaymentOpen} = useModal();

    const showError = useException();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const currentConfig = useMemo(() => {
        const serviceType = appointmentFrame.serviceTypeOption?.type ?? EServiceType.VisitCenter;
        return config.find(item => item.serviceType?.toString() === serviceType.toString());
    }, [config, appointmentFrame.serviceTypeOption])

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

    const handleResponse = async (data: ICreateAppointmentResp, endpoint: {route: string; method: string}) => {
        await dispatch(handleAppointmentResponse(data, endpoint))
    }

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
        setErrors(localErrors)
        return isValid;
    }

    const handleCreateAppointment = () => {
        if (checkIsValid()) {
            const [make, model, year] = getVehicleData(appointmentFrame.selectedVehicle, appointmentFrame.valueService);

            const vehicle = {
                dmsId: appointmentFrame?.selectedVehicle?.dmsId ?? null,
                ...(appointmentFrame.selectedVehicle ?? {}),
                engineTypeId: appointmentFrame.selectedVehicle?.engineTypeId ? Number(appointmentFrame.selectedVehicle?.engineTypeId) : null,
                model,
                make,
                year,
                vin: appointmentFrame.selectedVehicle?.vin ?? '',
                mileage: appointmentFrame?.selectedVehicle?.mileage ?? null,
                modelDetails: appointmentFrame?.valueService?.model?.name ?? '',
            }

            const driver = {
                ...appointmentFrame.customer,
                email: appointmentFrame.customer.email?.length ? appointmentFrame.customer.email : null,
            }

            const date = appointmentFrame.serviceTypeOption?.type === EServiceType.PickUpDropOff && appointment.serviceValetAppointment
                ? moment(appointment.serviceValetAppointment.date).toISOString().split("T")[0] || ""
                : appointment.appointment?.id.split("|")[0] || "";

            const appointmentTimingType = appointmentFrame.serviceTypeOption?.type !== EServiceType.PickUpDropOff && appointmentFrame.selectedTiming
                ? appointmentFrame.selectedTiming
                : EAppointmentTimingType.FirstAvailable;

            const transportationOptionId = appointmentFrame.serviceTypeOption?.transportationOption?.id
                ?? appointmentFrame.transportation?.id
                ?? null;

            const serviceRequestIds = collectServiceRequestIds(
                appointmentFrame.service,
                appointmentFrame.subService,
                appointmentFrame.selectedPackage,
                appointment.selectedSR,
            )

            const maintenancePackageOption = appointmentFrame.selectedPackage
                ? {id: appointmentFrame.selectedPackage?.id, priceType: appointmentFrame.packagePricingType}
                : appointmentFrame.packageEMenuType !== null
                    ? {optionType: appointmentFrame.packageEMenuType}
                    : null;

            const data = {
                id: appointmentFrame.id,
                hashKey: appointmentFrame.hashKey,
                appointmentTimingType,
                customerId: appointment.customerLoadedData?.id ?? null,
                comment: appointmentFrame.description,
                driver,
                vehicle,
                gmt: moment().utcOffset(),
                offerId: appointment.appointment?.offer?.id ?? null,
                reminderTypes: appointmentFrame.reminders,
                serviceCenterId: decodeSCID(id),
                consultantId: appointmentFrame.advisor?.id ?? appointmentFrame?.slotsConsultantId,
                transportationOptionId,
                slot: appointment.appointment?.id.split("|")[1] || "00:00:00",
                serviceRequestIds,
                date,
                serviceCategoryIds: getCategories(categories.allCategories, appointmentFrame.categoriesIds),
                maintenancePackageOption,
                valueServiceOfferIds: appointmentFrame?.valueService?.selectedService?.id
                    ? [appointmentFrame?.valueService?.selectedService.id]
                    : [],
                searchTerm: customerEnteredEmail,
                serviceTypeOptionId: appointmentFrame.serviceTypeOption?.id ?? null,
                zipCode: appointmentFrame.zipCode ?? null,
                address: appointmentFrame.address?.label ?? appointmentFrame.address ?? null,
                recalls: mapRecallsForRequest(appointmentFrame.selectedRecalls),
            };

            const endpoint = data?.hashKey
                ? Api.endpoints.Appointments.UpdateByKey
                : Api.endpoints.Appointments.Create;

            dispatch(setAppointmentSaving(true))

            Api.call<ICreateAppointmentResp>(endpoint, { data, urlParams: {id: data.hashKey} })
                .then(({data}) => {
                    handleResponse(data, endpoint)
                        .then(() => onNext());
                })
                .catch(e => {
                    showError(e);
                    if (e.response?.data?.errors) {
                        const data = [...e.response.data.errors]
                        setErrors(() => {
                            return data.map((err: TError): string => err.field.split('.')[1].toLowerCase());
                        })
                    }
                })
                .finally(() => {
                    dispatch(setAppointmentSaving(false))
                })
        }
    }

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
                {appointmentFrame.transportation || appointmentFrame.serviceTypeOption?.transportationOption || currentConfig?.advisorSelection
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
        <Actions loading={saving} onBack={onBack} onNext={handleCreateAppointment} />
        <DetailedFees open={isFeesOpen} onClose={onFeesClose}/>
        <PaymentType open={isPaymentOpen} onClose={onPaymentClose} onNo={handleCreateAppointment}/>
    </StepWrapper>
};