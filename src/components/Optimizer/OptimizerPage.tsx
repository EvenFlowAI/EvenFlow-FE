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
import {useCurrentUser} from "../../utils/hooks";
import {Roles} from "../../config/constants";

export const OptimizerPage = () => {
    const currentUer = useCurrentUser();
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
            <Redirect to={currentUer?.role === Roles.Advisor ? Routes.Optimizer.EmployeeSchedule : Routes.Optimizer.ServiceRequests} />
        </Switch>
    </ContentContainer>
}