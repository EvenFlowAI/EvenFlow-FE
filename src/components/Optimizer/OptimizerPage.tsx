import React from "react";
import {ContentContainer} from "../Content/ContentContainer/ContentContainer";
import {Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from "../../utils/Routes";
import {Routes} from "../../config/routes";
import {CapacitySettings} from "./CapacitySettings/CapacitySettings";
import {AppointmentValue} from "./AppointmentValue/AppointmentValue";
import {AppointmentSlotScoring} from "./AppointmentSlotScoring/AppointmentSlotScoring";
import { OptimizationWindowsPage } from "./OptimizationWindows/OptimizationWindowsPage";
import {AppointmentAllocationPage} from "./AppointmentAllocation/AppointmentAllocationPage";
import {ServiceRequests} from "./ServiceRequests/ServiceRequests";
import ManageAppointments from "./ManageAppointments/ManageAppointments";
import Pods from "./Pods/Pods";
import PartsAvailability from "./PartsAvailability/PartsAvailability";
import CapacityServiceValet from "./CapacityServiceValet/CapacityServiceValet";

export const OptimizerPage = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Optimizer.ServiceRequests} component={ServiceRequests} />
            <PrivateRoute path={Routes.Optimizer.AppointmentValue} component={AppointmentValue} />
            <PrivateRoute path={Routes.Optimizer.CapacitySettings} component={CapacitySettings} />
            <PrivateRoute path={Routes.Optimizer.AppointmentSlotScoring} component={AppointmentSlotScoring} />
            <PrivateRoute path={Routes.Optimizer.AppointmentAllocation} component={AppointmentAllocationPage} />
            <PrivateRoute path={Routes.Optimizer.OptimizationWindows} component={OptimizationWindowsPage} />
            <PrivateRoute path={Routes.Optimizer.Pods} component={Pods} />
            <PrivateRoute path={Routes.Optimizer.ManageEXEvenFlowAppointments} component={ManageAppointments} />
            <PrivateRoute path={Routes.Optimizer.PartsAvailability} component={PartsAvailability} />
            <PrivateRoute path={Routes.Optimizer.ServiceValet} component={CapacityServiceValet} />
            <Redirect to={Routes.Optimizer.ServiceRequests} />
        </Switch>
    </ContentContainer>
}