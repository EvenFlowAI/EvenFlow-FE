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
import {collectServiceRequestIds} from "./utils";
import {Api} from "../../../config/requests";
import {setAppointmentId, setReminders} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {useException, useModal} from "../../../utils/hooks";
import {
    loadAllServiceCategories,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../../store/reducers/appointment/actions";
import Vehicle from "./confirmationSections/Vehicle";
import ServiceRequests from "./confirmationSections/ServiceRequests";
import DetailedFees from "../../Modals/DetailedFees/DetailedFees";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import Address from "./confirmationSections/Address";
import PaymentType from "../../Modals/PaymentType/PaymentType";
import ServiceType from "./confirmationSections/ServiceType";
import {useTranslation} from "react-i18next";

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
    const [saving, setSaving] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const [appointment, appointmentFrame, categories, customerEnteredEmail] = useSelector((state: RootState) => [
        state.appointment,
        state.appointmentFrame,
        state.categories,
        state.appointment.customerEnteredEmail,
    ]);

    const {id} = useParams();
    const {isOpen: isFeesOpen, onClose: onFeesClose, onOpen: onFeesOpen} = useModal();
    const {isOpen: isPaymentOpen, onClose: onPaymentClose, onOpen: onPaymentOpen} = useModal();
    const showError = useException();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType?.toString() === appointmentFrame.serviceType?.toString());
    }, [config, appointmentFrame.serviceType])

    useEffect(() => {
        appointment?.scProfile && dispatch(loadAllServiceCategories(appointment.scProfile.id));
    }, [appointment.scProfile])

    useEffect(() => {
        dispatch(setReminders([0, 2]));
    }, [])

    const handleResponse = (data: ICreateAppointmentResp, endpoint: {route: string; method: string}) => {
        dispatch(setAppointmentId({
            id: data.id,
            hashKey: data.hashKey,
        }));
        if (appointment.customerLoadedData && endpoint === Api.endpoints.Appointments.Create) {
            const d = {
                ...appointment.customerLoadedData
            };
            let vehicle = d.vehicles.find(
                c => c.vin === data.vehicle.vin
            );
            if (vehicle) {
                vehicle = {...vehicle};
                vehicle.appointmentHashKeys = [...vehicle.appointmentHashKeys, data.hashKey]
            } else {
                d.vehicles = [...d.vehicles, {...data.vehicle, appointmentHashKeys: [data.hashKey]}];
            }
            if (!d.emails?.length) {
                d.emails = [appointmentFrame.customer.email];
                d.fullName = data.driver?.fullName;
                d.id = data.customerId;
                d.phoneNumbers = [data.driver?.phoneNumber];
            }
            dispatch(setCustomerLoadedData(d));
            saveCustomerCache(d);
        }
        onNext();
    }

    const getCategories = (): number[] => {
        return categories.allCategories
            .filter(category => {
                return category.type === EServiceCategoryType.GeneralCategory
                    && appointmentFrame.categoriesIds.includes(category.id)
            })
            .map(item => item.id)
    }

    const getMake = (): string|null => {
        return appointmentFrame?.selectedVehicle?.make?.length
            ? appointmentFrame?.selectedVehicle?.make
            : appointmentFrame?.valueService
                ? "BMW"
                : null;
    }
    const getModel = (): string|null => {
        return appointmentFrame?.selectedVehicle?.model?.length
            ? appointmentFrame?.selectedVehicle?.model
            : appointmentFrame?.valueService?.series?.name
                ? appointmentFrame.valueService.series.name
                : null;
    }

    const getYear = (): string|null => {
        return appointmentFrame?.selectedVehicle?.year
            ? String(appointmentFrame.selectedVehicle.year)
            : appointmentFrame?.valueService?.year?.year
                ? String(appointmentFrame.valueService.year.year)
                : null;
    }

    const handleCreateAppointment = () => {
        const make = getMake();
        const model = getModel();
        const year = getYear();

        const data = {
            id: appointmentFrame.id,
            hashKey: appointmentFrame.hashKey,
            appointmentTimingType: appointmentFrame.selectedTiming ?? EAppointmentTimingType.FirstAvailable,
            customerId: appointment.customerLoadedData?.id ?? null,
            comment: appointmentFrame.description,
            driver: appointmentFrame.customer,
            gmt: moment().utcOffset(),
            isNeedCall: false,
            offerId: appointment.appointment?.offer?.id ?? null,
            reminderTypes: appointmentFrame.reminders,
            serviceCenterId: decodeSCID(id),
            consultantId: appointmentFrame.advisor?.id,
            vehicle: {
                dmsId: null,
                driveType: "",
                ...(appointmentFrame.selectedVehicle ?? {}),
                engineTypeId: appointmentFrame.selectedVehicle?.engineTypeId ? Number(appointmentFrame.selectedVehicle?.engineTypeId) : null,
                model,
                make,
                transmission: "",
                vin: appointmentFrame.selectedVehicle?.vin ?? '',
                year,
                mileage: appointmentFrame?.selectedVehicle?.mileage ?? null,
                modelDetails: appointmentFrame?.valueService?.model?.name ?? '',
            },
            transportationOptionId: appointmentFrame.transportation?.id ?? null,
            slot: appointment.appointment?.id.split("|")[1] || "",
            serviceRequestIds: collectServiceRequestIds(
                appointmentFrame.service,
                appointmentFrame.subService,
                appointmentFrame.selectedRecalls,
                appointmentFrame.selectedPackage,
                appointment.selectedSR
            ),
            date: appointment.appointment?.id.split("|")[0] || "",
            serviceCategoryIds: getCategories(),
            maintenancePackageOptionId: appointmentFrame.selectedPackage?.id ?? null,
            valueServiceOfferIds: appointmentFrame?.valueService?.selectedService?.id ? [appointmentFrame?.valueService?.selectedService.id] : [],
            searchTerm: customerEnteredEmail,
            serviceTypeOptionId: appointmentFrame.serviceTypeOption?.id ?? null,
            zipCode: appointmentFrame.zipCode ?? null,
            address: appointmentFrame.address?.label ?? null,
        };

        const endpoint = data?.hashKey
            ? Api.endpoints.Appointments.UpdateByKey
            : Api.endpoints.Appointments.Create;

        setSaving(true);

        Api.call<ICreateAppointmentResp>(
            endpoint, { data, urlParams: {id: data.hashKey} }
        )
            .then(({data}) => {
                handleResponse(data, endpoint);
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
                setSaving(false);
            })
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
                {currentConfig?.transportationNeeds && appointmentFrame.transportation
                    ? <Review/>
                    : null}
            </div>
            <div>
                <UserData errors={errors} setErrors={setErrors}/>
                <Reminders/>
                <Info>{t("terms of our Visitor Agreement")}.</Info>
            </div>

        </Wrapper>
        {/*todo change to open payment window on next*/}
        <Actions loading={saving} onBack={onBack} onNext={handleCreateAppointment} />
        <DetailedFees open={isFeesOpen} onClose={onFeesClose}/>
        <PaymentType open={isPaymentOpen} onClose={onPaymentClose} onNo={handleCreateAppointment}/>
    </StepWrapper>
};