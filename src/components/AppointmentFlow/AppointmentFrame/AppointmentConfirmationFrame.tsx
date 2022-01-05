import React, {useState} from 'react';
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
import {EServiceCenterName, ICreateAppointmentResp, IUpdateAppointment} from "../../../api/types";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";
import moment from "moment";
import {decodeSCID} from "../../../utils/utils";
import {collectServiceRequestIds} from "./utils";
import {Api} from "../../../config/requests";
import {setAppointmentId} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {useException, useModal} from "../../../utils/hooks";
import {saveCustomerCache, setCustomerLoadedData} from "../../../store/reducers/appointment/actions";
import CreateAppointment from "../../Modals/CreateAppointment/CreateAppointment";

const Wrapper = styled('div')(({theme}) => ({
    // width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    "&>div": {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "flex-start",
        alignItems: "stretch"
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
    const [appointment, appointmentFrame] = useSelector((state: RootState) => [
        state.appointment,
        state.appointmentFrame
    ]);

    const {id} = useParams();
    const {isOpen, onClose, onOpen} = useModal();
    const showError = useException();
    const dispatch = useDispatch();

    const onCreateClick = () => {
        if (appointment.scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
            || appointment.scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest) {
            appointmentFrame.selectedVehicle?.vin ? handleCreateAppointment() : onOpen();
        } else {
            handleCreateAppointment()
        }
    }

    const handleCreateAppointment = (vin = '', withVin = true) => {
        // TODO: UpdateFlow?
        const data: IUpdateAppointment = {
            id: appointmentFrame.id,
            hashKey: appointmentFrame.hashKey,
            appointmentTimingType: appointmentFrame.selectedTiming ?? EAppointmentTimingType.FirstAvailable,
            customerId: appointment.customerLoadedData?.id,
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
                engineType: "",
                make: "",
                model: "",
                transmission: "",
                ...(appointmentFrame.selectedVehicle ?? {}),
                vin: withVin ? appointmentFrame.selectedVehicle?.vin || vin : '',
                year: appointmentFrame?.selectedVehicle?.year
                    ? String(appointmentFrame.selectedVehicle.year) : null,
                mileage: appointmentFrame.maintenanceDetails?.serviceInterval ?? null,
            },
            transportationType: appointmentFrame.transportation?.type,
            slot: appointment.appointment?.id.split("|")[1] || "",
            serviceRequestIds: collectServiceRequestIds(
                appointmentFrame.service,
                appointmentFrame.subService,
                appointmentFrame.selectedPackage,
                appointment.selectedSR
            ),
            date: appointment.appointment?.id.split("|")[0] || "",
            serviceCategoryId: appointmentFrame.subService?.id ?? appointmentFrame.service?.id ?? null,
            maintenancePackageOptionId: appointmentFrame.selectedPackage?.id ?? null
        };
        const endpoint = data?.hashKey
            ? Api.endpoints.Appointments.UpdateByKey
            : Api.endpoints.Appointments.Create;
        setSaving(true);
        Api.call<ICreateAppointmentResp>(
            endpoint, { data, urlParams: {id: data.hashKey} }
        )
            .then(({data}) => {
                dispatch(setAppointmentId({
                    id: data.id,
                    hashKey: data.hashKey,
                }));
                if (appointment.customerLoadedData && endpoint === Api.endpoints.Appointments.Create) {
                    const d = {
                        ...appointment.customerLoadedData
                    };
                    const vehicle = d.vehicles.find(
                        c => c.vin === data.vehicle.vin
                    );
                    if (vehicle) {
                        vehicle.appointmentHashKeys = [...vehicle.appointmentHashKeys, data.hashKey]
                    } else {
                        d.vehicles = [...d.vehicles, {...data.vehicle, appointmentHashKeys: [data.hashKey]}];
                    }
                    if (!d.emails.length) {
                        d.emails = [appointmentFrame.customer.email];
                        const fNameParts = appointmentFrame.customer.fullName.split(" ");
                        const firstName = fNameParts[0];
                        const lastName = fNameParts.slice(1).join(' ');
                        d.firstName = firstName;
                        d.lastName = lastName;
                        d.id = data.customerId;
                        d.phoneNumbers = [appointmentFrame.customer.phoneNumber];
                    }
                    dispatch(setCustomerLoadedData(d));
                    saveCustomerCache(d);
                }
                onNext();
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
                <UserData errors={errors} setErrors={setErrors}/>
                <SelectedDate onChangeSlot={onChangeSlot} />
            </div>
            <div>
                <Review />
                <SelectedPrice/>
                <Reminders />
                <Info>By using this service you accept the terms of our Visitor Agreement.</Info>
            </div>

        </Wrapper>
        <Actions loading={saving} onBack={onBack} onNext={onCreateClick} />
        <CreateAppointment
            open={isOpen}
            loading={saving}
            onClose={onClose}
            handleCreateAppointment={handleCreateAppointment}
        />
    </StepWrapper>
};