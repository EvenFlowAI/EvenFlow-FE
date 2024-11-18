import {LinkTypeWithSub} from "../../../types/types";
import {Routes} from "../../../routes/constants";

export const SULinks: LinkTypeWithSub[] = [
    {to: Routes.Admin.DealershipGroups, name: "Dealership Groups", roles: ["Super Admin"]},
    {to: Routes.Admin.ServiceCenters, name: "Service Centers", roles: ["Super Admin"]},
    {to: Routes.Admin.Application,
        name: "Application",
        roles: ["Super Admin"],
        subLinks: [
            {
                to: Routes.Admin.Vehicles,
                name: "Vehicles",
                roles: ["Super Admin"],
                sub: true,
            },
            {
                to: Routes.Admin.OpCodeCategory,
                name: "Op Code Category",
                roles: ["Super Admin"],
                sub: true,
            },
        ]},
];

export const MainLinksWithSub: LinkTypeWithSub[] = [
    {
        to: Routes.CenterProfile.Base,
        name: "Center Profile",
        roles: ["Owner", "Manager", "Service Director"],
        subLinks: [
            {
                to: Routes.CenterProfile.ServiceCenters,
                name: "Service Centers",
                roles: ["Owner", "Manager", "Service Director"],
                sub: true,
            },
            {
                to: Routes.CenterProfile.FacilitySetUp,
                name: "Facility Set Up",
                roles: ["Owner", "Manager", "Service Director"],
                sub: true,
            },
            {
                to: Routes.CenterProfile.Vehicles,
                name: "Vehicles",
                roles: ["Owner", "Manager", "Service Director"],
                sub: true,
            },
            // {
            //     to: Routes.CenterProfile.Integrations,
            //     name: "Integrations",
            //     roles: ["Owner", "Manager", "Service Director"],
            //     sub: true,
            // }
        ]
    },
    {
        to: Routes.Employees.Base,
        name: "Employees",
        roles: ["Owner", "Manager", "Service Director"],
        subLinks: [
            {
                to: Routes.Employees.AddDelete,
                name: "Add & Delete",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.Employees.ScheduleSetUp,
                name: "Schedule Set Up",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.Employees.ScheduleManagement,
                name: "Schedule Management",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.Employees.EmployeeCapacity,
                name: "Employee Capacity",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            }
        ]
    },
    {
        to: Routes.Services.Base,
        name: "Services",
        roles: ["Owner", "Manager", "Service Director"],
        subLinks: [
            {
                to: Routes.Services.VehicleServices,
                name: "Vehicle Services",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.Services.ServiceValet,
                name: "Service Valet",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.Services.MobileService,
                name: "Mobile Service",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.Services.OtherTransportation,
                name: "Other Transportation",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
        ],
    },
    {
        to: Routes.CapacityManagement.Base,
        name: "Capacity Management",
        roles: ["Owner", "Manager", "Service Director"],
        subLinks: [
            {to: Routes.CapacityManagement.Pods, name: "Service Books", sub: true, roles: ["Owner", "Manager", "Service Director"]},
            {
                to: Routes.CapacityManagement.CapacitySettings,
                name: "Capacity Settings",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.DemandManagement,
                name: "Demand Management",
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
                to: Routes.CapacityManagement.AppointmentAllocation,
                name: "Appointment Allocation",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.ManageEXEvenFlowAppointments,
                name: "Manage Ex EvenFlow Appointments",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.RequestDifferentiation,
                name: "Request Differentiation",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.CapacityManagement.TimeDifferentiation,
                name: "Time Differentiation",
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
        ]
    },
    {
        to: Routes.Pricing.Base, name: "Dynamic Pricing", roles: ["Owner", "Manager"], subLinks: [
            {
                to: Routes.Pricing.ServicePricingSettings,
                name: "Service Price",
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
        to: Routes.BookingFlow.Base, name: "Booking Experience", roles: ["Owner", "Manager", "Service Director"], subLinks: [
            {
                to: Routes.BookingFlow.BookingFlowConfigDetails,
                name: "Booking Flow Configuration",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.BookingFlow.FirstScreen,
                name: "First Screen Configuration",
                exact: true,
                sub: true,
                roles: ["Owner", "Manager", "Service Director"]
            },
            {
                to: Routes.BookingFlow.ServiceOpsCodesMapping,
                name: "Service Categories",
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
    {to: Routes.Dealer.Base, name: "Dealer Operations", roles: ["Owner", 'Manager', "Service Director"]},
    {to: Routes.Admin.Appointments, name: "Appointments", roles: true},
]