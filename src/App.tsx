import React, {useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import {Container, IconButton} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import {ConfirmModal} from './components/modals/common/ConfirmModal/ConfirmModal';
import {ProviderContext, SnackbarProvider} from "notistack";
import {Close} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store/rootReducer";
import {EServiceType} from "./store/reducers/appointmentFrameReducer/types";
import {loadBookingFlowConfig, setConfiguration} from "./store/reducers/bookingFlowConfig/actions";
import {EServiceCenterName} from "./api/types";
import moment from "moment";
import {TScreen} from "./types/types";
import AppRoutes from "./routes/AppRoutes/AppRoutes";

const App = () => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {config, currentConfig, isAdvisorAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const [valueServiceNextScreen, setValueServiceNextScreen] = useState<TScreen>("consultantSelection");
    const [valueServicePreviousScreen, setValueServicePreviousScreen] = useState<TScreen>("serviceNeeds");
    const notificationsRef = useRef<ProviderContext>();
    const dispatch = useDispatch();
    const history = useHistory();
    const lastLoadingTime = useMemo(() => moment().utc().toISOString(), []);
    const isTopAligning = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.Fremont
        || scProfile?.serviceCenterFlag === EServiceCenterName.LakePowellFord || scProfile?.serviceCenterFlag === EServiceCenterName.DealerBuilt, [scProfile]);

    useEffect(() => {
        window.addEventListener('focus', () => {
            const itIsTimeToReload = moment().utc(true).get('hour') > 2;
            const isBefore = moment(lastLoadingTime).utc().isBefore(moment().utc(), 'day')
            if (isBefore && itIsTimeToReload) {
                localStorage.setItem('timestamp', moment().utc(true).toISOString())
                history.go(0)
            }
        })
    }, [lastLoadingTime, history])

    useEffect(() => {
        const serviceType = serviceTypeOption?.type ?? EServiceType.VisitCenter;
        const currentConfiguration = config.find(item => item.serviceType?.toString() === serviceType.toString());
        if (currentConfiguration) dispatch(setConfiguration(currentConfiguration, serviceTypeOption))
    }, [serviceTypeOption, config])

    useEffect(() => {
        if (serviceTypeOption?.type === EServiceType.MobileService || serviceTypeOption?.type === EServiceType.PickUpDropOff) {
            setValueServicePreviousScreen("location");
        } else {
            setValueServicePreviousScreen("serviceNeeds");
        }
        const serviceType = serviceTypeOption?.type ?? EServiceType.VisitCenter;
        if ((currentConfig && !isAdvisorAvailable)
            || serviceType === EServiceType.MobileService) {
            setValueServiceNextScreen("appointmentTiming");
        }
    }, [serviceTypeOption, currentConfig, isAdvisorAvailable])

    useEffect(() => {
        if (scProfile) {
            dispatch(loadBookingFlowConfig(scProfile.id))
        }
    }, [scProfile])

    useEffect(() => {
        caches.keys().then((names) => {
            names.forEach((name) => {
                caches.delete(name);
            });
        })
    }, [])

    const handleClose = (key: React.ReactText) => () => {
        notificationsRef?.current?.closeSnackbar(key);
    }
    const shackAction = (key: React.ReactText) => {
        return <IconButton size="small" onClick={handleClose(key)}><Close htmlColor="#fff" /></IconButton>;
    }
    const isWin = window.navigator.appVersion.indexOf('Win') !== -1;

    return (
        <SnackbarProvider
            maxSnack={3}
            ref={notificationsRef}
            action={shackAction}
            anchorOrigin={{horizontal: "right", vertical: "top"}}
            variant="success">
            <Container
                component="main"
                maxWidth={false}
                className={isWin ? "winos" : undefined}
                disableGutters
                style={{
                    height: isTopAligning ? "auto" : "100vh",
                    maxHeight: "-webkit-fill-available"}}>
                <ConfirmModal/>
                <AppRoutes
                    valueServicePreviousScreen={valueServicePreviousScreen}
                    valueServiceNextScreen={valueServiceNextScreen}/>
            </Container>
        </SnackbarProvider>
    );
}

export default App;
