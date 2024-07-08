import React from 'react';
import {Route, Switch, useParams} from "react-router-dom";
import {BookingFlow} from "../../pages/booking/BookingFlow/BookingFlow";
import PaymentBill from "../../features/booking/PaymentBill/PaymentBill";
import {Login} from "../../pages/admin/Login/Login";
import ValueService from "../../pages/booking/ValueService/ValueService";
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {AdminPanel} from "../../pages/admin/AdminPanel/AdminPanel";
import {
    setCurrentFrameScreen,
    setTrackerCreated,
    setValueService
} from "../../store/reducers/appointmentFrameReducer/actions";
import {TScreen} from "../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {Routes} from "../constants";
import {useAnalyticsForParentSite} from "../../hooks/useAnalyticsBySCId/useAnalyticsBySCId";
import {RootState} from "../../store/rootReducer";
import AppointmentFlow from "../../pages/booking/AppointmentFlow/AppointmentFlow";

type TProps = {
    valueServicePreviousScreen: TScreen;
    valueServiceNextScreen: TScreen;
}

const AppRoutes: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({valueServicePreviousScreen, valueServiceNextScreen}) => {
    const dispatch = useDispatch();
    const {id} = useParams<{id: string}>();
    const {trackerData} = useSelector((state: RootState) => state.appointmentFrame);

    const setTracker = (ids: string[]) => dispatch(setTrackerCreated({isCreated: true, ids}))

    useAnalyticsForParentSite(id, trackerData.isCreated, setTracker);

    const onValueServiceBack = async () => {
        await dispatch(setValueService(null));
        await dispatch(setCurrentFrameScreen(valueServicePreviousScreen));
    }

    return (
        <Switch>
            <Route path={Routes.EndUser.AppointmentFrame} exact component={AppointmentFlow} />
            <Route path={Routes.EndUser.ManageAppointmentFrame} exact component={AppointmentFlow} />
            <Route path={Routes.EndUser.CancelAppointment} exact component={BookingFlow} />
            <Route path={Routes.EndUser.CancelAppointmentFromEmail} exact component={BookingFlow} />
            <Route path={Routes.EndUser.EditAppointment} exact component={BookingFlow} />
            <Route path={Routes.EndUser.EditAppointmentFromEmail} exact component={BookingFlow} />
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