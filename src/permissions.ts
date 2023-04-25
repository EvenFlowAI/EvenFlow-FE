import {TRouteRoleMap} from "./utils/types";
import {Routes} from "./config/routes";

export const PERMISSIONS: TRouteRoleMap[] = [
    {route: Routes.Login.Base, roles: true},
    {route: Routes.Login.ForgotPassword, roles: true},

    {route: Routes.Admin.Appointments, roles: true},
    {route: Routes.Admin.DealershipGroups, roles: ["Super Admin"]},
    {route: Routes.Admin.Employees, roles: ["Manager", "Owner"]},
    {route: Routes.Admin.Profile, roles: ["Owner", "Super Admin", "Manager",]},
    {route: Routes.Admin.ServiceCenters, roles: ["Super Admin", "Owner", "Manager"]},
    {route: Routes.Admin.ServiceRequests, roles: ["Owner", "Manager",]},

    {route: Routes.Account.ResetPassword, roles: true},
    {route: Routes.Account.Verification, roles: true},

    {route: Routes.Optimizer.AppointmentAllocation, roles: ["Owner", "Manager"]},
    {route: Routes.Optimizer.AppointmentSlotScoring, roles: ["Owner", "Manager"]},
    {route: Routes.Optimizer.AppointmentValue, roles: ["Owner", "Manager"]},
    {route: Routes.Optimizer.CapacitySettings, roles: ["Owner", "Manager"]},
    {route: Routes.Optimizer.EmployeeSchedule, roles: ["Owner", "Manager"]},
    {route: Routes.Optimizer.OptimizationWindows, roles: ["Owner", "Manager"]},
    {route: Routes.Optimizer.PricingSettings, roles: ["Owner", "Manager"]},
    {route: Routes.Optimizer.ServiceRequests, roles: ["Owner", "Manager"]},
    // {route: Routes.Optimizer.ServiceRequests, roles: ["Owner", "Manager", "Advisor"]},

    {route: Routes.OfferManagement.Base, roles: ["Owner", "Manager"]},

    {route: Routes.Admin.Base, roles: true},
    {route: Routes.Account.Base, roles: true},
    {route: Routes.Optimizer.Base, roles: ["Owner", "Manager", "Advisor"]},
];