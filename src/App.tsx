import React, {useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import {Container, IconButton, useMediaQuery, useTheme} from '@mui/material';
import {useHistory} from 'react-router-dom';
import {ConfirmModal} from './components/modals/common/ConfirmModal/ConfirmModal';
import {SnackbarProvider} from "notistack";
import {Close} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store/rootReducer";
import {EServiceType} from "./store/reducers/appointmentFrameReducer/types";
import {loadBookingFlowConfig, setConfiguration} from "./store/reducers/bookingFlowConfig/actions";
import {TScreen} from "./types/types";
import AppRoutes from "./routes/AppRoutes/AppRoutes";
import dayjs from "dayjs";
import {disableEmotionWarning} from "./utils/utils";

const App = () => {
    const {scProfile, isTopAligning} = useSelector((state: RootState) => state.appointment);
    const {config, currentConfig, isAdvisorAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const [valueServiceNextScreen, setValueServiceNextScreen] = useState<TScreen>("consultantSelection");
    const [valueServicePreviousScreen, setValueServicePreviousScreen] = useState<TScreen>("serviceNeeds");
    const notificationsRef = useRef<SnackbarProvider|null>(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("mdl"));
    const lastLoadingTime = useMemo(() => dayjs().utc().toISOString(), []);

    useEffect(() => {
        window.addEventListener('focus', () => {
            const itIsTimeToReload = dayjs().utc(true).get('hour') > 2;
            const isBefore = dayjs(lastLoadingTime).utc().isBefore(dayjs().utc(), 'day')
            if (isBefore && itIsTimeToReload) {
                localStorage.setItem('timestamp', dayjs().utc(true).toISOString())
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
        disableEmotionWarning()
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
                    height: isTopAligning || isMobile? "auto" : "100vh",
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
