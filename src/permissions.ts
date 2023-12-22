import {TRouteRoleMap} from "./utils/types";

import {Routes} from "./routes/constants";

export const PERMISSIONS: TRouteRoleMap[] = [
    {route: Routes.Login.Base, roles: true},
    {route: Routes.Login.ForgotPassword, roles: true},

    {route: Routes.Admin.Appointments, roles: true},
    {route: Routes.Admin.DealershipGroups, roles: ["Super Admin"]},
    {route: Routes.Admin.Employees, roles: ["Manager", "Owner", "Service Director"]},
    {route: Routes.Admin.Profile, roles: true},
    {route: Routes.Admin.ServiceCenters, roles: ["Super Admin", "Owner", "Manager",  "Service Director"]},
    {route: Routes.Admin.ServiceRequests, roles: ["Owner", "Manager", "Service Director"]},

    {route: Routes.Account.ResetPassword, roles: true},
    {route: Routes.Account.Verification, roles: true},

    {route: Routes.Optimizer.AppointmentAllocation, roles: ["Owner", "Manager", "Service Director"]},
    {route: Routes.Optimizer.AppointmentSlotScoring, roles: ["Owner", "Manager", "Service Director"]},
    {route: Routes.Optimizer.AppointmentValue, roles: ["Owner", "Manager", "Service Director"]},
    {route: Routes.Optimizer.CapacitySettings, roles: ["Owner", "Manager", "Service Director"]},
    {route: Routes.Optimizer.EmployeeSchedule, roles: ["Owner", "Manager", "Service Director"]},
    {route: Routes.Optimizer.OptimizationWindows, roles: ["Owner", "Manager", "Service Director"]},
    {route: Routes.Optimizer.PricingSettings, roles: ["Owner", "Manager", "Service Director"]},
    {route: Routes.Optimizer.ServiceRequests, roles: ["Owner", "Manager", "Service Director"]},
    // {route: Routes.Optimizer.ServiceRequestsScreen, roles: ["Owner", "Manager", "Advisor"]},

    {route: Routes.OfferManagement.Base, roles: ["Owner", "Manager", "Service Director"]},

    {route: Routes.Admin.Base, roles: true},
    {route: Routes.Account.Base, roles: true},
    {route: Routes.Optimizer.Base, roles: ["Owner", "Manager", "Advisor", "Service Director"]},
];