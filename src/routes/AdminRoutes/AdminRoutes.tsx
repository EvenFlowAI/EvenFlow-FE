import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { ContentContainer } from '../../components/wrappers/ContentContainer/ContentContainer';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';
import { DealershipGroupDetails } from '../../pages/admin/DealerShipGroupDetails/DealershipGroupDetails';
import { Profile } from '../../pages/admin/Profile/Profile';
import AppointmentsPage from '../../pages/admin/Appointments/AppointmentsPage';
import PricingRoutes from '../PricingRoutes/PricingRoutes';
import ReportingPage from '../../pages/admin/Reporting/ReportingPage';
import { CapacityRoutes } from '../CapacityRoutes/CapacityRoutes';
import { BookingFlowSettingsRoutes } from '../BookingFlowSettingsRoutes/BookingFlowSettingsRoutes';
import DealershipGroups from '../../pages/admin/DealershipGroups/DealershipGroups';
import { useCurrentUser } from '../../hooks/useCurrentUser/useCurrentUser';
import { Routes } from '../constants';
import EmployeesRoutes from '../EmployeesRoutes/EmployeesRoutes';
import ServicesRoutes from '../ServicesRoutes/ServicesRoutes';
import CenterProfileRoutes from '../CenterProfileRoutes/CenterProfileRoutes';
import { ServiceCenters } from '../../pages/admin/ServiceCenters/ServiceCenters';
import ApplicationRoutes from '../ApplicationRoutes/ApplicationRoutes';
import { DealerOperationsRoutes } from '../DealerOperationsRoutes/DealerOperationsRoutes';
import AiAgents from '../../pages/admin/AiAgents/AiAgents';
import ConfigurationAgent from '../../pages/admin/ConfigurationAgent/ConfigurationAgent';
import InsightsAgent from '../../pages/admin/InsightsAgent/InsightsAgent';
import AnomalyAgent from '../../pages/admin/AnomalyAgent/AnomalyAgent';
import { Roles } from '../../types/types';

export const AdminRoutes = () => {
  const currentUser = useCurrentUser();

  if (!currentUser) return null;

  const isRestrictedRole = ['BDC Agent', 'Advisor', 'Technician'].includes(currentUser.role);
  const isSuperUser = currentUser.isSuperUser;
  const isDealerOwnerSuperAdmin =
    Boolean(currentUser.adminDealership) && currentUser?.role === Roles.DealerOwner;

  const superUserRoutes = [
    { path: Routes.Admin.DealershipGroups, exact: true, component: DealershipGroups },
    { path: Routes.Admin.Application, component: ApplicationRoutes },
    { path: Routes.Admin.ServiceCenters, exact: true, component: ServiceCenters },
    { path: `${Routes.Admin.DealershipGroups}/:id`, component: DealershipGroupDetails },
  ];

  const regularRoutes = [
    { path: Routes.Employees.Base, component: EmployeesRoutes, condition: !isRestrictedRole },
    { path: Routes.CenterProfile.Base, component: CenterProfileRoutes },
    { path: Routes.Admin.Appointments, component: AppointmentsPage },
    {
      path: Routes.Admin.AiAgents,
      component: AiAgents,
      condition: isDealerOwnerSuperAdmin,
    },
    {
      path: Routes.Admin.ConfigurationAgent,
      component: ConfigurationAgent,
      condition: isDealerOwnerSuperAdmin,
    },
    {
      path: Routes.Admin.InsightsAgent,
      component: InsightsAgent,
      condition: isDealerOwnerSuperAdmin,
    },
    {
      path: Routes.Admin.AnomalyAgent,
      component: AnomalyAgent,
      condition: isDealerOwnerSuperAdmin,
    },

    {
      path: Routes.Dealer.Base,
      component: DealerOperationsRoutes,
      condition: !isRestrictedRole,
    },
    { path: Routes.Pricing.Base, component: PricingRoutes, condition: !isRestrictedRole },
    {
      path: Routes.BookingFlow.Base,
      component: BookingFlowSettingsRoutes,
      condition: !isRestrictedRole,
    },
    { path: Routes.Admin.Reporting, component: ReportingPage, condition: !isRestrictedRole },
    {
      path: Routes.CapacityManagement.Base,
      component: CapacityRoutes,
      condition: !isRestrictedRole,
    },
    { path: Routes.Services.Base, component: ServicesRoutes, condition: !isRestrictedRole },
  ];

  const redirectPath = isSuperUser ? Routes.Admin.DealershipGroups : Routes.Admin.Appointments;

  return (
    <ContentContainer>
      <Switch>
        {isSuperUser && superUserRoutes.map(route => <PrivateRoute key={route.path} {...route} />)}

        {!isSuperUser &&
          regularRoutes
            .filter(route => route.condition !== false)
            .map(route => <PrivateRoute key={route.path} {...route} />)}

        <PrivateRoute path={Routes.Admin.Profile} component={Profile} />

        <Redirect to={redirectPath} />
      </Switch>
    </ContentContainer>
  );
};
