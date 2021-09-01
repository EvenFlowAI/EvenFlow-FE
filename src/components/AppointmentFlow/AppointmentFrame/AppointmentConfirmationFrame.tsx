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
import {ICreateAppointment, ICreateAppointmentResp, IUpdateAppointment} from "../../../api/types";
import {EAppointmentTimingType} from "../../../store/reducers/appointment/types";
import moment from "moment";
import {decodeSCID} from "../../../utils/utils";
import {collectServiceRequestIds} from "./utils";
import {Api} from "../../../config/requests";
import {setAppointmentId} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {useException} from "../../../utils/hooks";
import {saveCustomerCache, setCustomerLoadedData} from "../../../store/reducers/appointment/actions";

const Wrapper = styled('div')({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    "&>div": {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "flex-start",
        alignItems: "stretch"
    }
});

const Info = styled('div')({
    fontSize: 12
});

type TProps = {
    onChangeSlot: TCallback;
} & TActionProps;
export const AppointmentConfirmationFrame: React.FC<TProps> = ({onBack, onChangeSlot, onNext}) => {
    const [saving, setSaving] = useState<boolean>(false);

    const {id} = useParams();
    const dispatch = useDispatch();
    const [appointment, appointmentFrame] = useSelector((state: RootState) => [
        state.appointment,
        state.appointmentFrame
    ]);

    const showError = useException();

    const handleCreateAppointment = () => {
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
                vin: "",
                driveType: "",
                engineType: "",
                make: "",
                model: "",
                transmission: "",
                ...(appointmentFrame.selectedVehicle ?? {}),
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
        if (data.serviceCategoryId && data.serviceCategoryId < 1) {
            data.serviceCategoryId = null;
        }
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
                if (appointment.customerLoadedData) {
                    const d = {
                        ...appointment.customerLoadedData,
                        vehicles: appointment.customerLoadedData.vehicles.map(
                            v => v.vin === appointmentFrame.selectedVehicle?.vin ? {...v, appointmentHashKeys: [...v.appointmentHashKeys, data.hashKey]} : v
                        )
                    };
                    dispatch(setCustomerLoadedData(d));
                    saveCustomerCache(d);
                }
                onNext();
            })
            .catch(e => {showError(e)})
            .finally(() => {setSaving(false)})
    }
    return <StepWrapper>
        <Wrapper>
            <div>
                <UserData />
                <SelectedDate onChangeSlot={onChangeSlot} />
            </div>
            <div>
                <Review />
                <SelectedPrice />
                <Reminders />
                <Info>By using this service you accept the terms of our Visitor Agreement.</Info>
            </div>

        </Wrapper>
        <Actions loading={saving} onBack={onBack} onNext={handleCreateAppointment} />
    </StepWrapper>
};