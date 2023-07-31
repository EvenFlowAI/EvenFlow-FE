import React, {useEffect, useMemo, useState} from 'react';
import {WelcomeLayout} from "./WelcomeLayout";
import {Loading} from "../UI/Loading";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {API} from "../../api/api";
import {Button, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {
    clearStorage,
    loadSCProfile,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {Routes} from "../../config/routes";
import {AppointmentStatus, ICustomerLoadedData, ILoadedVehicle} from "../../api/types";
import {Edit} from "@material-ui/icons";
import {RootState} from "../../store/rootReducer";
import {NotFoundError} from "./NotFoundError";
import {encodeSCID} from "../../utils/utils";
import {
    setCurrentFrameScreen,
    setUpdateAppointment,
    setVehicle
} from "../../store/reducers/appointmentFrameReducer/actions";
import moment from "moment";
import {loadCategoriesByQuery} from "../../store/reducers/categories/actions";
import {useTranslation} from "react-i18next";
import {useStorage} from "../../utils/hooks";
import {IFirstScreenOption} from "../../store/reducers/serviceTypes/types";
import {EServiceType} from "../../store/reducers/appointmentFrameReducer/types";

const ContentContainer = styled("div")({
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold"
});

type TState = "loading" | "error" | "canceled" | "passed";

type TLParams = {
    fromAdmin?: string
}

export const EditAppointment = () => {
    const [state, setState] = useState<TState>("loading");
    const selectedSC: number|undefined = useSelector((state: RootState) => {
        return state.appointment.scProfile?.id
    });
    const { allCategories } = useSelector((state: RootState) => state.categories);

    const history = useHistory();
    const dispatch = useDispatch();
    const {id} = useParams();
    const {t} = useTranslation();
    const {search} = useLocation<TLParams>();
    const isFromAdmin = useMemo(() => {
        const isFromAdmin = new URLSearchParams(search).get('fromAdmin')?.toLowerCase();
        return isFromAdmin === 'true' || isFromAdmin === '1';
    }, [search])

    useStorage();

    const setFrameScreen = (serviceTypeOption: IFirstScreenOption|undefined) => {
        dispatch(setCurrentFrameScreen(serviceTypeOption?.type !== EServiceType.VisitCenter ? "location" : "serviceNeeds"))
    }

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadCategoriesByQuery(selectedSC))
        }
    }, [selectedSC])

    useEffect(() => {
        let trimmedKey = id.replaceAll(',', '').replaceAll('.', '');
        API.appointment.getByKey(trimmedKey)
            .then(async ({data}) => {
                await dispatch(loadSCProfile(data.serviceCenterId));
                if (isFromAdmin) setFrameScreen(data.serviceTypeOption)
                dispatch(setUpdateAppointment(data));
                const vehicle: ILoadedVehicle = {
                    ...data.vehicle,
                    appointmentHashKeys: [data.hashKey]
                }
                const customer: ICustomerLoadedData = {
                    ...data.driver,
                    id: data.customerId,
                    vehicles: [vehicle],
                    phoneNumbers: [data.driver.phoneNumber],
                    emails: [data.driver.email],
                    fullName: data.driver.fullName,
                    city: data.driver.city ?? "",
                }
                dispatch(setCustomerLoadedData(customer));
                dispatch(setVehicle({...vehicle}));
                saveCustomerCache(customer);
                if (data.appointmentStatus === AppointmentStatus.Cancelled) {
                    setState("canceled");
                    return;
                }
                const [hours, minutes] = data.timeSlot.split(":");
                if (moment.utc().diff(moment(data.dateInUtc).hours(+hours).minutes(+minutes)) >= 0) {
                    setState("passed");
                    return;
                }
                history.replace(`${Routes.EndUser.AppointmentFrameBase}/${encodeSCID(data.serviceCenterId)}`);
            })
            .catch((e) => {
                setState("error");
            })
    }, [id, dispatch, history, allCategories]);

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
            case "passed":
                return <div>
                    <p>{t("Appointment time is already passed")}.</p>
                    <p>
                        <small>{t("Schedule different appointment")}</small>
                    </p> <br/>
                    <Button
                        onClick={handleCreateNew}
                        startIcon={<Edit />}
                        color="primary" variant="contained">
                        {t("Schedule appointment")}
                    </Button>
                </div>
            case "canceled":
                return <div>
                    <p>{t("Appointment is already cancelled")}.</p>
                    <p>
                        <small>{t("Schedule different appointment")}</small>
                    </p> <br/>
                    <Button
                        onClick={handleCreateNew}
                        startIcon={<Edit />}
                        color="primary" variant="contained">
                        {t("Schedule appointment")}
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