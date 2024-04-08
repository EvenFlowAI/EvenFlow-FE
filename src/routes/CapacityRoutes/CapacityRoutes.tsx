import React from "react";
import {ContentContainer} from "../../components/wrappers/ContentContainer/ContentContainer";
import {Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {CapacitySettings} from "../../pages/admin/CapacitySettings/CapacitySettings";
import {AppointmentSlotScoring} from "../../pages/admin/AppointmentSlotScoring/AppointmentSlotScoring";
import { OptimizationWindowsPage } from "../../pages/admin/OptimizationWindows/OptimizationWindowsPage";
import {AppointmentAllocation} from "../../pages/admin/AppointmentAllocation/AppointmentAllocation";
import ManageExEFAppointments from "../../features/admin/ManageExEFAppointments/ManageExEFAppointments";
import Pods from "../../pages/admin/Pods/Pods";
import {Routes} from "../constants";
import RequestDifferentiation from "../../pages/admin/RequestDifferentiation/RequestDifferentiation";

export const CapacityRoutes = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.CapacityManagement.CapacitySettings} component={CapacitySettings} />
            <PrivateRoute path={Routes.CapacityManagement.AppointmentSlotScoring} component={AppointmentSlotScoring} />
            <PrivateRoute path={Routes.CapacityManagement.AppointmentAllocation} component={AppointmentAllocation} />
            <PrivateRoute path={Routes.CapacityManagement.OptimizationWindows} component={OptimizationWindowsPage} />
            <PrivateRoute path={Routes.CapacityManagement.Pods} component={Pods} />
            <PrivateRoute path={Routes.CapacityManagement.ManageEXEvenFlowAppointments} component={ManageExEFAppointments} />
            <PrivateRoute path={Routes.CapacityManagement.RequestDifferentiation} component={RequestDifferentiation} />
            <Redirect to={Routes.CapacityManagement.Pods} />
        </Switch>
    </ContentContainer>
}