import {LinkType, LinkTypeWithSub} from "../../../types/types";

import {Routes} from "../../../routes/constants";

export const SULinks: LinkType[] = [
    {to: Routes.Admin.DealershipGroups, name: "Dealership Groups", roles: ["Super Admin"]},
    {to: Routes.Admin.ServiceCenters, name: "Service Centers", roles: ["Super Admin"]},
];

export const MainLinksWithSub: LinkTypeWithSub[] = [
    {to: Routes.Admin.ServiceCenters, name: "Service Centers", roles: ["Owner", "Service Director"]},
    {to: Routes.Admin.Employees, name: "Employees", roles: ["Owner", "Manager", "Service Director"]},
    {to: Routes.Admin.Base, name: "Operational Set Up", exact: true, roles: ["Owner", "Manager", "Service Director"]},
    {
        to: Routes.CapacityManagement.Base,
        name: "Capacity Optimization",
        roles: ["Owner", "Manager", "Service Director"],
        subLinks: [
            {
                to: Routes.CapacityManagement.ServiceRequests,
                name: "Service Requests",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.AppointmentValue,
                name: "Appointment Value Settings",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.AppointmentSlotScoring,
                name: "Appointment Slot Scoring",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.AppointmentAllocation,
                name: "Appointment Allocation",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.OptimizationWindows,
                name: "Optimization Windows",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {to: Routes.CapacityManagement.Pods, name: "Pods", sub: true, roles: ["Owner", "Manager", "Service Director"]},
            {
                to: Routes.CapacityManagement.ManageEXEvenFlowAppointments,
                name: "Manage Ex EvenFlow Appointments",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.CapacitySettings,
                name: "Capacity Settings",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.PartsAvailability,
                name: "Parts Availability",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.ServiceValet,
                name: "Service Valet",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
        ]
    },
    {
        to: Routes.Pricing.Base, name: "Pricing", roles: ["Owner", "Manager"], subLinks: [
            {
                to: Routes.Pricing.ServicePricingSettings,
                name: "Service Price Settings",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.Pricing.MobileService,
                name: "Mobile Service",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.Pricing.ServiceValet,
                name: "Service Valet",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.Pricing.OfferManagement,
                name: "Offer Management",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
        ]
    },

    {
        to: Routes.BookingFlow.Base, name: "Booking Flow", roles: ["Owner", "Manager", "Service Director"], subLinks: [
            {
                to: Routes.BookingFlow.BookingFlowConfigDetails,
                name: "Booking Flow Config",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.BookingFlow.TransportationOptions,
                name: "Transportation Options",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.BookingFlow.ServiceOpsCodesMapping,
                name: "Service Ops Code Mapping",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.BookingFlow.VehicleDetails,
                name: "Vehicle Detail Options",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.BookingFlow.FirstScreen,
                name: "First Screen",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.BookingFlow.ScreenSettings,
                name: "Screen Settings",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
        ]
    },
    {to: Routes.Admin.Appointments, name: "Appointments", roles: true},
]