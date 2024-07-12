import React, {useEffect, useMemo, useState} from 'react';
import {WelcomeLayout} from "../../../features/booking/WelcomeLayout/WelcomeLayout";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {API} from "../../../api/api";
import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
    clearStorage,
    loadSCProfile,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../../store/reducers/appointment/actions";
import {AppointmentStatus, ICustomerLoadedData, ILoadedVehicle} from "../../../api/types";
import {Edit} from "@mui/icons-material";
import {RootState} from "../../../store/rootReducer";
import {NotFoundError} from "../../../components/wrappers/NotFoundError/NotFoundError";
import {encodeSCID} from "../../../utils/utils";
import {
    clearAppointmentData,
    setCurrentFrameScreen, setServiceTypeOption,
    setUpdateAppointment,
    setUserType,
    setVehicle
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {loadCategoriesByQuery} from "../../../store/reducers/categories/actions";
import {useTranslation} from "react-i18next";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {EServiceType, EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import {
    dateTimeFormat
} from "../../../features/admin/Appointments/ViewAppointmentsModal/AppointmentDetails/AppointmentDetails";
import {useStorage} from "../../../hooks/useStorage/useStorage";
import {Routes} from "../../../routes/constants";
import dayjs from "dayjs";
import {ContentContainer} from "./styles";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";

type TState = "loading" | "error" | "canceled" | "passed";

type TLParams = {
    fromAdmin?: string
}

export const EditAppointment = () => {
    const [state, setState] = useState<TState>("loading");
    const selectedScId: number|undefined = useSelector((state: RootState) => {
        return state.appointment.scProfile?.id
    });
    const { customerLoadedData, scProfile } = useSelector((state: RootState) => state.appointment);
    const { allCategories } = useSelector((state: RootState) => state.categories);

    const history = useHistory();
    const dispatch = useDispatch();
    const {id} = useParams<{id: string}>();
    const {t} = useTranslation();
    const {search} = useLocation<TLParams>();
    const currentUser = useCurrentUser()
    const isFromAdmin = useMemo(() => {
        const isFromAdmin = new URLSearchParams(search).get('fromAdmin')?.toLowerCase();
        return isFromAdmin === 'true' || isFromAdmin === '1';
    }, [search])

    const isAuth = useMemo(() => currentUser?.dealershipId === scProfile?.dealershipId, [currentUser, scProfile]);

    useStorage();

    const setFrameScreen = (serviceTypeOption: IFirstScreenOption|undefined) => {
        dispatch(setCurrentFrameScreen(serviceTypeOption?.type !== EServiceType.VisitCenter ? "location" : "serviceNeeds"))
    }

    useEffect(() => {
        if (selectedScId) {
            dispatch(loadCategoriesByQuery(selectedScId))
        }
    }, [selectedScId])

    useEffect(() => {
        const requestFunc = isFromAdmin || !id.includes('by-key')
            ? API.appointment.getByKey
            : API.appointment.getFromEmail
        requestFunc(id)
            .then(async ({data}) => {
                await dispatch(loadSCProfile(data.serviceCenterId));
                dispatch(setUserType(EUserType.Existing))
                dispatch(setUpdateAppointment(data));
                const vehicle: ILoadedVehicle = {
                    ...data.vehicle,
                    appointmentHashKeys: [data.hashKey],
                }
                const customer: ICustomerLoadedData = {
                    ...data.driver,
                    id: data.customerId,
                    vehicles: [vehicle],
                    phoneNumbers: [data.driver.phoneNumber],
                    emails: [data.driver.email],
                    fullName: data.driver.fullName,
                    fromSearchByName: isFromAdmin,
                    companyName: data.driver.companyName,
                    isUpdating: isAuth,
                }
                if (data.address) customer.address = data.address
                dispatch(setCustomerLoadedData(customer));
                dispatch(setVehicle({...vehicle}));
                saveCustomerCache(customer);
                if (isFromAdmin) setFrameScreen(data.serviceTypeOption)
                if (data.appointmentStatus === AppointmentStatus.Cancelled) {
                    setState("canceled");
                    return;
                }
                const [hours, minutes] = data.timeSlot.split(":");
                const formattedDate = dayjs(data.dateInUtc).format()
                const dateTime = dayjs.utc(formattedDate).hour(+hours).minute(+minutes).format(dateTimeFormat)
                if (dayjs.utc().diff(dateTime) >= 0) {
                    setState("passed");
                    return;
                }
                if (selectedScId) history.push(Routes.EndUser.ManageAppointmentFrame.replace(":id", encodeSCID(selectedScId)))
            })
            .catch((e) => {
                setState("error");
            })
    }, [id, dispatch, history, allCategories, isAuth]);

    const handleCreateNew = () => {
        if (selectedScId) {
            clearStorage();
            dispatch(clearAppointmentData());
            dispatch(setServiceTypeOption(null));
            if (customerLoadedData) {
                dispatch(setCustomerLoadedData({...customerLoadedData, isUpdating: false}));
            }
            history.replace(`${Routes.EndUser.Welcome}/${encodeSCID(selectedScId)}?frame=1`);
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