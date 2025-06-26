import { TRouteRoleMap } from './utils/types';

import { Routes } from './routes/constants';

export const PERMISSIONS: TRouteRoleMap[] = [
  { route: Routes.Login.Base, roles: true },
  { route: Routes.Login.ForgotPassword, roles: true },

  { route: Routes.Admin.Appointments, roles: true },
  { route: Routes.Admin.DealershipGroups, roles: ['Super Admin'] },
  { route: Routes.Admin.Application, roles: ['Super Admin'] },
  { route: Routes.Employees.Base, roles: ['Manager', 'Owner', 'Service Director'] },
  { route: Routes.Employees.AddDelete, roles: ['Manager', 'Owner', 'Service Director'] },
  { route: Routes.Admin.Profile, roles: true },
  {
    route: Routes.CenterProfile.Base,
    roles: ['Super Admin', 'Owner', 'Manager', 'Service Director'],
  },
  {
    route: Routes.CenterProfile.FacilitySetUp,
    roles: ['Super Admin', 'Owner', 'Manager', 'Service Director'],
  },
  {
    route: Routes.CenterProfile.Vehicles,
    roles: ['Super Admin', 'Owner', 'Manager', 'Service Director'],
  },
  {
    route: Routes.CenterProfile.Integrations,
    roles: ['Super Admin', 'Owner', 'Manager', 'Service Director'],
  },
  { route: Routes.Admin.ServiceRequests, roles: ['Owner', 'Manager', 'Service Director'] },

  { route: Routes.Account.ResetPassword, roles: true },
  { route: Routes.Account.Verification, roles: true },

  {
    route: Routes.CapacityManagement.AppointmentValue,
    roles: ['Owner', 'Manager', 'Service Director'],
  },
  {
    route: Routes.CapacityManagement.CapacitySettings,
    roles: ['Owner', 'Manager', 'Service Director'],
  },
  {
    route: Routes.CapacityManagement.DemandManagement,
    roles: ['Owner', 'Manager', 'Service Director'],
  },
  {
    route: Routes.CapacityManagement.PartsAvailability,
    roles: ['Owner', 'Manager', 'Service Director'],
  },
  {
    route: Routes.CapacityManagement.EmployeeSchedule,
    roles: ['Owner', 'Manager', 'Service Director'],
  },
  {
    route: Routes.CapacityManagement.OptimizationWindows,
    roles: ['Owner', 'Manager', 'Service Director'],
  },
  {
    route: Routes.CapacityManagement.PricingSettings,
    roles: ['Owner', 'Manager', 'Service Director'],
  },
  { route: Routes.Services.VehicleServices, roles: ['Owner', 'Manager', 'Service Director'] },
  { route: Routes.Services.ServiceValet, roles: ['Owner', 'Manager', 'Service Director'] },
  { route: Routes.Services.Base, roles: ['Owner', 'Manager', 'Service Director'] },

  { route: Routes.OfferManagement.Base, roles: ['Owner', 'Manager', 'Service Director'] },

  { route: Routes.Admin.Base, roles: true },
  { route: Routes.Account.Base, roles: true },
  {
    route: Routes.CapacityManagement.Base,
    roles: ['Owner', 'Manager', 'Advisor', 'Service Director'],
  },
];
