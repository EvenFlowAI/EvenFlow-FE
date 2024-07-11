import React, {useEffect, useMemo} from "react";
import {Grid} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
    clearAppointmentData,
    setServiceOptionChanged,
    setTrackerCreated,
    setWelcomeScreenView
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {LocalTokens, TCallback} from "../../../types/types";
import {v4 as uuidv4} from 'uuid';
import {EServiceType, EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import {RootState} from "../../../store/rootReducer";
import {ActionButtons} from "../ActionButtons/ActionButtons";
import ReturningSelfCustomer from "./ReturningSelfCustomer/ReturningSelfCustomer";
import NewSelfCustomer from "./NewSelfCustomer/NewSelfCustomer";
import ReturningCustomerForAdmin from "./ReturningCustomerForAdmin/ReturningCustomerForAdmin";
import NewCustomerForAdmin from "./NewCustomerForAdmin/NewCustomerForAdmin";
import {loadMileage} from "../../../store/reducers/vehicleDetails/actions";
import {useParams} from "react-router-dom";
import {useStyles} from "./styles";
import {useAnalyticsForParentSite} from "../../../hooks/useAnalyticsBySCId/useAnalyticsBySCId";
import {useCurrentUser} from "../../../hooks/useCurrentUser/useCurrentUser";
import {loadGeneralSettings} from "../../../store/reducers/generalSettings/actions";
import {ESettingType} from "../../../store/reducers/generalSettings/types";

type TProps = {
    onComplete: (serviceType: EServiceType, userType?: EUserType) => void;
    loading: boolean;
    handleNew: () => void;
    redirect: TCallback;
};

export const CustomerSelect: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
                                                     onComplete,
                                                     loading,
                                                     handleNew,
    redirect,
                                                 }) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {trackerData} = useSelector((state: RootState) => state.appointmentFrame);
    const {shortSC} = useSelector((state: RootState) => state.serviceCenters);

    const {id} = useParams<{id: string}>();
    const { classes  } = useStyles();
    const dispatch = useDispatch();
    const currentUser = useCurrentUser();
    const isAuthorized = useMemo(() =>  currentUser && currentUser.dealershipId === scProfile?.dealershipId,
        [currentUser, scProfile])

    const setTracker = (ids: string[]) => dispatch(setTrackerCreated({isCreated: true, ids}))

    useAnalyticsForParentSite(id, trackerData.isCreated, setTracker);

    useEffect(() => {
        const uid = uuidv4();
        sessionStorage.setItem(LocalTokens.sessionId, uid);
        window.addEventListener('unload', () => {
            sessionStorage.setItem(LocalTokens.sessionId, '')
        })
    }, [sessionStorage])
    
    useEffect(() => {
        if (scProfile) {
            dispatch(loadMileage(scProfile.id))
            dispatch(loadGeneralSettings(scProfile.id, [ESettingType.CompanyName]))
        }
    }, [scProfile])

    useEffect(() => {
        dispatch(clearAppointmentData())
        dispatch(setServiceOptionChanged(false));
    }, [])

    const handleBack = () => dispatch(setWelcomeScreenView("serviceCenterSelect"))

    return <div className={classes.wrapper}>
        <Grid className={classes.buttonsContainer}
              alignItems="stretch"
              container
              spacing={4}>
            {isAuthorized
                ? <ReturningCustomerForAdmin handleNew={handleNew} redirect={redirect}/>
                : <ReturningSelfCustomer onComplete={onComplete} loading={loading} />}
            {isAuthorized
                ? <NewCustomerForAdmin handleNew={handleNew}/>
                : <NewSelfCustomer handleNew={handleNew}/>}
        </Grid>
        {isAuthorized && !!shortSC?.length && <ActionButtons onBack={handleBack} onNext={() => {}} hideNext prevLabel="Change Service Center"/>}
    </div>
};