import React, {useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import {Container, IconButton} from '@material-ui/core';
import {Login} from "./components/Login/Login";
import {Route, Switch} from 'react-router-dom';
import {Layout} from "./components/Layout/Layout";
import {Routes} from "./config/routes";
import {PrivateRoute} from "./utils/Routes";
import {ConfirmDialog} from './components/UI/ConfirmDialog';
import {ProviderContext, SnackbarProvider} from "notistack";
import {Close} from "@material-ui/icons";
import {EndUserLayout} from "./components/Layout/EndUserLayout";
import {AppointmentLayout} from "./components/Layout/AppointmentLayout";
import {AppointmentConfirmation} from "./components/AppointmentFlow/AppointmentConfirmation";
import {AppointmentFrameLayout} from "./components/Layout/AppointmentFrameLayout";
import ValueService from "./components/AppointmentFlow/AppointmentFrame/ValueService/ValueService";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store/rootReducer";
import {setCurrentFrameScreen, setValueService} from "./store/reducers/appointmentFrameReducer/actions";
import {TScreen} from "./components/Layout/types";
import {EServiceType} from "./store/reducers/appointmentFrameReducer/types";
import {loadBookingFlowConfig} from "./store/reducers/bookingFlowConfig/actions";
import PaymentBill from "./components/AppointmentFlow/PaymentBill/PaymentBill";
import {EServiceCenterName} from "./api/types";

const App = () => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const {serviceType} = useSelector((state: RootState) => state.appointmentFrame);
    const [valueServiceNextScreen, setValueServiceNextScreen] = useState<TScreen>("consultantSelection");
    const [valueServicePreviousScreen, setValueServicePreviousScreen] = useState<TScreen>("serviceNeeds");
    const notificationsRef = useRef<ProviderContext>();
    const dispatch = useDispatch();
    const isTopAligning = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.Fremont
        || scProfile?.serviceCenterFlag === EServiceCenterName.LakePowellFord || scProfile?.serviceCenterFlag === EServiceCenterName.DealerBuilt, [scProfile]);

    useEffect(() => {
        if (serviceType === EServiceType.MobileService) {
            setValueServicePreviousScreen("location");
        }
        if (serviceType === EServiceType.PickUpDropOff) {
            setValueServicePreviousScreen("location");
        }
        const currentConfig = config.find(item => item.serviceType && serviceType && item.serviceType.toString() === serviceType.toString());
        if ((!currentConfig?.advisorSelection)
            || serviceType === EServiceType.MobileService) {
            setValueServiceNextScreen("appointmentTiming");
        }
    }, [serviceType, config])

    useEffect(() => {
        if (scProfile) dispatch(loadBookingFlowConfig(scProfile.id))
    }, [scProfile])

    const handleClose = (key: React.ReactText) => () => {
        notificationsRef?.current?.closeSnackbar(key);
    }
    const shackAction = (key: React.ReactText) => {
        return <IconButton size="small" onClick={handleClose(key)}><Close htmlColor="#fff" /></IconButton>;
    }
    const isWin = window.navigator.appVersion.indexOf('Win') !== -1;

    const onValueServiceBack = async () => {
        await dispatch(setValueService(null));
        await dispatch(setCurrentFrameScreen(valueServicePreviousScreen));
    }

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
                <ConfirmDialog/>
                <Switch>
                    <Route path={Routes.EndUser.Appointment} exact component={AppointmentLayout} />
                    <Route path={Routes.EndUser.AppointmentFrame} exact component={AppointmentFrameLayout} />
                    <Route path={Routes.EndUser.Confirmation} exact component={AppointmentConfirmation} />
                    <Route path={Routes.EndUser.CancelAppointment} exact component={EndUserLayout} />
                    <Route path={Routes.EndUser.EditAppointment} exact component={EndUserLayout} />
                    <Route path={Routes.EndUser.Base} exact component={EndUserLayout} />
                    <Route path={Routes.EndUser.PaymentBill} exact component={PaymentBill} />
                    <Route path={Routes.Login.Base} component={Login} />
                    <Route path={Routes.Account.Base} component={Login} />
                    <Route
                        path={Routes.EndUser.ValueService}
                        exact
                        render={() => <ValueService onBack={onValueServiceBack} nextScreen={valueServiceNextScreen}/>}/>
                    <PrivateRoute path="/" component={Layout}/>
                </Switch>
            </Container>
        </SnackbarProvider>
    );
}

export default App;
