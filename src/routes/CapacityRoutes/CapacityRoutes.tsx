import React from "react";
import {ContentContainer} from "../../components/wrappers/ContentContainer/ContentContainer";
import {Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {CapacitySettings} from "../../pages/admin/CapacitySettings/CapacitySettings";
import { OptimizationWindowsPage } from "../../pages/admin/OptimizationWindows/OptimizationWindowsPage";
import {AppointmentAllocation} from "../../pages/admin/AppointmentAllocation/AppointmentAllocation";
import ManageExEFAppointments from "../../features/admin/ManageExEFAppointments/ManageExEFAppointments";
import {Routes} from "../constants";
import RequestDifferentiation from "../../pages/admin/RequestDifferentiation/RequestDifferentiation";
import TimeDifferentiation from "../../pages/admin/TimeDifferentiation/TimeDifferentiation";
import ServiceBooks from "../../pages/admin/ServiceBooks/ServiceBooks";
import DemandManagement from "../../pages/admin/DemandManagement/DemandManagement";

export const CapacityRoutes = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.CapacityManagement.CapacitySettings} component={CapacitySettings} />
            <PrivateRoute path={Routes.CapacityManagement.DemandManagement} component={DemandManagement} />
            <PrivateRoute path={Routes.CapacityManagement.AppointmentAllocation} component={AppointmentAllocation} />
            <PrivateRoute path={Routes.CapacityManagement.OptimizationWindows} component={OptimizationWindowsPage} />
            <PrivateRoute path={Routes.CapacityManagement.Pods} component={ServiceBooks} />
            <PrivateRoute path={Routes.CapacityManagement.ManageEXEvenFlowAppointments} component={ManageExEFAppointments} />
            <PrivateRoute path={Routes.CapacityManagement.RequestDifferentiation} component={RequestDifferentiation} />
            <PrivateRoute path={Routes.CapacityManagement.TimeDifferentiation} component={TimeDifferentiation} />
            <Redirect to={Routes.CapacityManagement.Pods} />
        </Switch>
    </ContentContainer>
}