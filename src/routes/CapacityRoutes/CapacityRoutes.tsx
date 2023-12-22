import React from "react";
import {ContentContainer} from "../../components/wrappers/ContentContainer/ContentContainer";
import {Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {CapacitySettings} from "../../pages/admin/CapacitySettings/CapacitySettings";
import {AppointmentValueSettings} from "../../pages/admin/AppointmentValueSettings/AppointmentValueSettings";
import {AppointmentSlotScoring} from "../../pages/admin/AppointmentSlotScoring/AppointmentSlotScoring";
import { OptimizationWindowsPage } from "../../pages/admin/OptimizationWindows/OptimizationWindowsPage";
import {AppointmentAllocation} from "../../pages/admin/AppointmentAllocation/AppointmentAllocation";
import {ServiceRequests} from "../../pages/admin/ServiceRequests/ServiceRequests";
import ManageExEFAppointments from "../../features/admin/ManageExEFAppointments/ManageExEFAppointments";
import Pods from "../../pages/admin/Pods/Pods";
import Recalls from "../../pages/admin/Recalls/Recalls";
import CapacityServiceValet from "../../pages/admin/CapacityServiceValet/CapacityServiceValet";
import {Routes} from "../constants";

export const CapacityRoutes = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Optimizer.ServiceRequests} component={ServiceRequests} />
            <PrivateRoute path={Routes.Optimizer.AppointmentValue} component={AppointmentValueSettings} />
            <PrivateRoute path={Routes.Optimizer.CapacitySettings} component={CapacitySettings} />
            <PrivateRoute path={Routes.Optimizer.AppointmentSlotScoring} component={AppointmentSlotScoring} />
            <PrivateRoute path={Routes.Optimizer.AppointmentAllocation} component={AppointmentAllocation} />
            <PrivateRoute path={Routes.Optimizer.OptimizationWindows} component={OptimizationWindowsPage} />
            <PrivateRoute path={Routes.Optimizer.Pods} component={Pods} />
            <PrivateRoute path={Routes.Optimizer.ManageEXEvenFlowAppointments} component={ManageExEFAppointments} />
            <PrivateRoute path={Routes.Optimizer.PartsAvailability} component={Recalls} />
            <PrivateRoute path={Routes.Optimizer.ServiceValet} component={CapacityServiceValet} />
            <Redirect to={Routes.Optimizer.ServiceRequests} />
        </Switch>
    </ContentContainer>
}