import React from "react";
import {ContentContainer} from "../../../components/Content/ContentContainer/ContentContainer";
import {Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from "../../../utils/Routes";
import {Routes} from "../../../config/routes";
import {CapacitySettings} from "../../../components/Optimizer/CapacitySettings/CapacitySettings";
import {AppointmentValueSettings} from "../AppointmentValueSettings/AppointmentValueSettings";
import {AppointmentSlotScoring} from "../AppointmentSlotScoring/AppointmentSlotScoring";
import { OptimizationWindowsPage } from "../../../components/Optimizer/OptimizationWindows/OptimizationWindowsPage";
import {AppointmentAllocationPage} from "../../../components/Optimizer/AppointmentAllocation/AppointmentAllocationPage";
import {ServiceRequests} from "../ServiceRequests/ServiceRequests";
import ManageAppointments from "../../../components/Optimizer/ManageAppointments/ManageAppointments";
import Pods from "../../../components/Optimizer/Pods/Pods";
import PartsAvailability from "../../../components/Optimizer/PartsAvailability/PartsAvailability";
import CapacityServiceValet from "../../../components/Optimizer/CapacityServiceValet/CapacityServiceValet";

export const CapacityManagement = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Optimizer.ServiceRequests} component={ServiceRequests} />
            <PrivateRoute path={Routes.Optimizer.AppointmentValue} component={AppointmentValueSettings} />
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