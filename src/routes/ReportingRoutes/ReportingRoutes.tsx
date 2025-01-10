import React from "react";
import { IEndUserConfig } from "../../features/admin/Reporting/types";
import { reportingAllowedRoles } from "../../pages/admin/Reporting/constants";
import { Redirect, Route, Switch } from "react-router-dom";
import { AppointmentsSummary } from "../../features/admin/Reporting/AppointmentSummary/AppointmentSummary";
import { ShopLoading } from "../../features/admin/Reporting/ShopLoading/ShopLoading";
import { ValetAppointments } from "../../features/admin/Reporting/ValetAppointments/ValetAppointments";
import { MobileServiceAppointments } from "../../features/admin/Reporting/MobileServiceAppointments/MobileServiceAppointments";
import { CustomerBehavior } from "../../features/admin/Reporting/CustomerBehavior/CustomerBehavior";
import { RepairOrderPerformance } from "../../features/admin/Reporting/RepairOrderPerformance/RepairOrderPerformance";
import { CapacityManagementPerformance } from "../../features/admin/Reporting/CapacityManagementPerfomance/CapacityManagementPerfomance";
import { useCurrentUser } from "../../hooks/useCurrentUser/useCurrentUser";
import { Routes } from "../constants";

export const ReportingRoutes: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ config: IEndUserConfig }>>
> = ({ config }) => {
  const currentUser = useCurrentUser();

  return config.qv_token &&
    (!window.origin.includes("apps.evenflow.ai") ||
      (currentUser && reportingAllowedRoles.includes(currentUser?.role))) ? (
    <Switch>
      <Route
        exact
        path={Routes.Reporting.BDCReports}
        render={() => <AppointmentsSummary settings={config} />}
      />
      <Route
        exact
        path={Routes.Reporting.ShopLoading}
        render={() => <ShopLoading settings={config} />}
      />
      <Route
        exact
        path={Routes.Reporting.ValetAppointments}
        render={() => <ValetAppointments settings={config} />}
      />
      <Route
        exact
        path={Routes.Reporting.AppointmentAssignments}
        render={() => <MobileServiceAppointments settings={config} />}
      />
      <Route
        exact
        path={Routes.Reporting.CustomerBehavior}
        render={() => <CustomerBehavior settings={config} />}
      />
      <Route
        exact
        path={Routes.Reporting.RepairOrderPerformance}
        render={() => <RepairOrderPerformance settings={config} />}
      />
      <Route
        exact
        path={Routes.Reporting.OutboundOpportunities}
        render={() => <CapacityManagementPerformance settings={config} />}
      />
      <Redirect to={Routes.Reporting.BDCReports} />
    </Switch>
  ) : null;
};
