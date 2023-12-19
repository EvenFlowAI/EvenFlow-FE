import React from "react";
import {ContentContainer} from "../../../components/Content/ContentContainer/ContentContainer";
import {Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from "../../../utils/Routes";
import {Routes} from "../../../config/routes";
import {CapacitySettings} from "../CapacitySettings/CapacitySettings";
import {AppointmentValueSettings} from "../AppointmentValueSettings/AppointmentValueSettings";
import {AppointmentSlotScoring} from "../AppointmentSlotScoring/AppointmentSlotScoring";
import { OptimizationWindowsPage } from "../OptimizationWindows/OptimizationWindowsPage";
import {AppointmentAllocation} from "../AppointmentAllocation/AppointmentAllocation";
import {ServiceRequests} from "../ServiceRequests/ServiceRequests";
import ManageExEFAppointments from "../../../features/ManageExEFAppointments/ManageExEFAppointments";
import Pods from "../Pods/Pods";
import Recalls from "../Recalls/Recalls";
import CapacityServiceValet from "../CapacityServiceValet/CapacityServiceValet";

export const CapacityManagement = () => {
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