import React from "react";
import {ContentContainer} from "../Content/ContentContainer/ContentContainer";
import {Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from "../../utils/Routes";
import {Routes} from "../../config/routes";
import {CapacitySettings} from "./CapacitySettings/CapacitySettings";
import {AppointmentValue} from "./AppointmentValue/AppointmentValue";
import {OPsCodesPage} from "./OPsCodes/OPsCodesPage";
import {AppointmentSlotScoring} from "./AppointmentSlotScoring/AppointmentSlotScoring";
import { OptimizationWindowsPage } from "./OptimizationWindows/OptimizationWindowsPage";
import {AppointmentAllocationPage} from "./AppointmentAllocation/AppointmentAllocationPage";
import {EmployeeSchedule} from "./EmployeeSchedule/EmployeeSchedule";

export const OptimizerPage = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Optimizer.ServiceRequests} component={OPsCodesPage} />
            <PrivateRoute path={Routes.Optimizer.AppointmentValue} component={AppointmentValue} />
            <PrivateRoute path={Routes.Optimizer.CapacitySettings} component={CapacitySettings} />
            <PrivateRoute path={Routes.Optimizer.EmployeeSchedule} component={EmployeeSchedule} />
            <PrivateRoute path={Routes.Optimizer.AppointmentSlotScoring} component={AppointmentSlotScoring} />
            <PrivateRoute path={Routes.Optimizer.AppointmentAllocation} component={AppointmentAllocationPage} />
            <PrivateRoute path={Routes.Optimizer.OptimizationWindows} component={OptimizationWindowsPage} />
            <Redirect to={Routes.Optimizer.ServiceRequests} />
        </Switch>
    </ContentContainer>
}