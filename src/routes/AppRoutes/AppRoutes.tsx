import React from 'react';
import {Route, Switch} from "react-router-dom";
import {AppointmentFlow} from "../../pages/booking/AppointmentFlow/AppointmentFlow";
import {BookingFlow} from "../../pages/booking/BookingFlow/BookingFlow";
import PaymentBill from "../../features/booking/PaymentBill/PaymentBill";
import {Login} from "../../pages/admin/Login/Login";
import ValueService from "../../pages/booking/ValueService/ValueService";
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {AdminPanel} from "../../pages/admin/AdminPanel/AdminPanel";
import {setCurrentFrameScreen, setValueService} from "../../store/reducers/appointmentFrameReducer/actions";
import {TScreen} from "../../types/types";
import {useDispatch} from "react-redux";
import {Routes} from "../constants";

type TProps = {
    valueServicePreviousScreen: TScreen;
    valueServiceNextScreen: TScreen;
}

const AppRoutes: React.FC<React.PropsWithChildren<TProps>> = ({valueServicePreviousScreen, valueServiceNextScreen}) => {
    const dispatch = useDispatch();

    const onValueServiceBack = async () => {
        await dispatch(setValueService(null));
        await dispatch(setCurrentFrameScreen(valueServicePreviousScreen));
    }

    return (
        <Switch>
            <Route path={Routes.EndUser.AppointmentFrame} exact component={AppointmentFlow} />
            <Route path={Routes.EndUser.CancelAppointment} exact component={BookingFlow} />
            <Route path={Routes.EndUser.EditAppointment} exact component={BookingFlow} />
            <Route path={Routes.EndUser.Base} exact component={BookingFlow} />
            <Route path={Routes.EndUser.PaymentBill} exact component={PaymentBill} />
            <Route path={Routes.Login.Base} component={Login} />
            <Route path={Routes.Account.Base} component={Login} />
            <Route
                path={Routes.EndUser.ValueService}
                exact
                render={() => <ValueService onBack={onValueServiceBack} nextScreen={valueServiceNextScreen}/>}/>
            <PrivateRoute path="/" component={AdminPanel}/>
        </Switch>
    );
};

export default AppRoutes;