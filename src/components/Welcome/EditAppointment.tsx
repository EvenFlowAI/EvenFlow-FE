import React, {useEffect, useState} from 'react';
import {WelcomeLayout} from "./WelcomeLayout";
import {Loading} from "../UI/Loading";
import {useHistory, useParams} from "react-router-dom";
import {API} from "../../api/api";
import {Button, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    clearStorage,
    loadEditAppointment,
    loadSCProfile, saveCustomerCache, setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {Routes} from "../../config/routes";
import {AppointmentStatus, ICustomerLoadedData, ILoadedVehicle} from "../../api/types";
import {Edit} from "@material-ui/icons";
import {RootState} from "../../store/rootReducer";
import {NotFoundError} from "./NotFoundError";
import {encodeSCID} from "../../utils/utils";
import {setUpdateAppointment, setVehicle} from "../../store/reducers/appointmentFrameReducer/actions";

const ContentContainer = styled("div")({
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold"
});

type TState = "loading" | "error" | "canceled";

export const EditAppointment = () => {
    const [state, setState] = useState<TState>("loading");
    const selectedSC: number|undefined = useSelector((state: RootState) => {
        return state.appointment.scProfile?.id
    });

    const history = useHistory();
    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        API.appointment.getByKey(id)
            .then(async ({data}) => {
                await dispatch(loadSCProfile(data.serviceCenterId));
                dispatch(setUpdateAppointment(data));
                const vehicle: ILoadedVehicle = {
                    ...data.vehicle,
                    appointmentHashKeys: [data.hashKey]
                }
                const parts = data.driver.fullName.split(" ");
                const fN = parts[0];
                const lN = parts.slice(1).join(" ");
                const customer: ICustomerLoadedData = {
                    ...data.driver,
                    id: data.customerId,
                    vehicles: [vehicle],
                    phoneNumbers: [data.driver.phoneNumber],
                    emails: [data.driver.email],
                    firstName: fN,
                    lastName: lN,
                }
                dispatch(setCustomerLoadedData(customer));
                dispatch(setVehicle({...vehicle}));
                saveCustomerCache(customer);
                if (data.appointmentStatus === AppointmentStatus.Cancelled) {
                    setState("canceled");
                    return;
                }
                history.replace(`${Routes.EndUser.AppointmentFrameBase}/${encodeSCID(data.serviceCenterId)}`);
            })
            .catch((e) => {
                setState("error");
            })
    }, [id, dispatch, history]);

    const handleCreateNew = () => {
        if (selectedSC) {
            clearStorage();
            history.replace(`${Routes.EndUser.Welcome}/${encodeSCID(selectedSC)}?frame=1`);
        }
    }

    const getContent = () => {
        switch (state) {
            case "error":
                return <NotFoundError />
            case "canceled":
                return <div>
                    <p>Appointment is already cancelled.</p>
                    <p>
                        <small>If you want to schedule a different one,
                            please click a button below</small>
                    </p> <br/>
                    <Button
                        onClick={handleCreateNew}
                        startIcon={<Edit />}
                        color="primary" variant="contained">
                        Schedule appointment
                    </Button>
                </div>
            case "loading":
            default:
                return <Loading />
        }
    }

    return <WelcomeLayout title={""}>
        <ContentContainer>
            {getContent()}
        </ContentContainer>
    </WelcomeLayout>
};