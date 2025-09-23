import { TRouteRoleMap } from './utils/types';

import { Routes } from './routes/constants';
import {TRole} from "./store/reducers/users/types";
import {Roles} from "./types/types";


declare global {
  interface Array<T> {
    exceptOf(other: T[]): T[];
  }
}
Array.prototype.exceptOf = function <T>(this: T[], other: T[]): T[] {
  const set = new Set(other);
  return this.filter(x => !set.has(x));
};

const baseRoles: TRole[] = [
    Roles.EvenFlowAdmin,
    Roles.EvenFlowAccountManager,
    Roles.EvenFlowSupport,
    Roles.EvenFlowAIAgent,
    Roles.DealerOwner,
    Roles.ServiceDirector,
    Roles.ServiceManager,
    Roles.BDCManager,
    Roles.Staff
];

export const PERMISSIONS: TRouteRoleMap[] = [
  { route: Routes.Login.Base, roles: true },
  { route: Routes.Login.ForgotPassword, roles: true },

  {
    route: Routes.CenterProfile.Base,
    roles: baseRoles
  },
  { 
    route: Routes.Employees.Base,
    roles: baseRoles
  },
  { 
    route: Routes.Services.Base,
    roles: baseRoles
  },
  {
    route: Routes.CapacityManagement.Base,
    roles: baseRoles,
  },
  {
    route: Routes.Pricing.Base,
    roles: baseRoles,
  }, 
  {
    route: Routes.BookingFlow.Base,
    roles: baseRoles,
  },
  {
    route: Routes.Dealer.Base,
    roles: baseRoles,
  },
  { route: Routes.Admin.Appointments, roles: true },
  {
    route: Routes.Admin.Reporting,
    roles: baseRoles.exceptOf([Roles.Staff])
  },
    
  { route: Routes.Admin.DealershipGroups, roles: [Roles.EvenFlowAdmin] },
  { route: Routes.Admin.Application, roles: [Roles.EvenFlowAdmin] },
  
  { route: Routes.Admin.Profile, roles: true },
  { route: Routes.Account.ResetPassword, roles: true },
  { route: Routes.Account.Verification, roles: true },
  { route: Routes.Admin.Base, roles: true },
  { route: Routes.Account.Base, roles: true }
];
