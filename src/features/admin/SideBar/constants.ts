import { LinkTypeWithSub, Roles } from '../../../types/types';
import { Routes } from '../../../routes/constants';
import { TRole } from '../../../store/reducers/users/types';
import { reportingAllowedRoles } from '../../../pages/admin/Reporting/constants';

const baseRoles: TRole[] = [
  Roles.EvenFlowAdmin,
  Roles.EvenFlowAccountManager,
  Roles.EvenFlowSupport,
  Roles.EvenFlowAIAgent,
  Roles.DealerOwner,
  Roles.ServiceDirector,
  Roles.ServiceManager,
  Roles.BDCManager,
  Roles.Staff,
];

const isProdOrUat =
  process.env.REACT_APP_ENV === 'production' || process.env.REACT_APP_ENV === 'uat';

export const SULinks: LinkTypeWithSub[] = [
  { to: Routes.Admin.DealershipGroups, name: 'Dealership Groups', roles: [Roles.EvenFlowAdmin] },
  { to: Routes.Admin.ServiceCenters, name: 'Service Centers', roles: [Roles.EvenFlowAdmin] },
  {
    to: Routes.Admin.Application,
    name: 'Application',
    roles: [Roles.EvenFlowAdmin],
    subLinks: [
      {
        to: Routes.Admin.Vehicles,
        name: 'Vehicles',
        roles: [Roles.EvenFlowAdmin],
        sub: true,
      },
      {
        to: Routes.Admin.OpCodeCategory,
        name: 'Op Code Category',
        roles: [Roles.EvenFlowAdmin],
        sub: true,
      },
      {
        to: Routes.Admin.RoleManagement,
        name: 'Role Management',
        roles: [Roles.EvenFlowAdmin],
        sub: true,
      },
      {
        to: Routes.Admin.RecallDatabase,
        name: 'Recall Database',
        roles: [Roles.EvenFlowAdmin],
        sub: true,
      },
    ],
  },
];

export const MainLinksWithSub: LinkTypeWithSub[] = [
  {
    to: Routes.Admin.AiAgents,
    name: 'AI Agents (BETA)',
    roles: [Roles.DealerOwner],
  },

  {
    to: Routes.CenterProfile.Base,
    name: 'Center Profile',
    roles: baseRoles,
    subLinks: [
      {
        to: Routes.CenterProfile.ServiceCenters,
        name: 'Service Centers',
        roles: baseRoles,
        sub: true,
      },
      {
        to: Routes.CenterProfile.FacilitySetUp,
        name: 'Facility Set Up',
        roles: baseRoles,
        sub: true,
      },
      {
        to: Routes.CenterProfile.Vehicles,
        name: 'Vehicles',
        roles: baseRoles,
        sub: true,
      },
    ],
  },
  {
    to: Routes.Employees.Base,
    name: 'Employees',
    roles: baseRoles,
    subLinks: [
      {
        to: Routes.Employees.AddDelete,
        name: 'Add & Delete',
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Employees.ScheduleSetUp,
        name: 'Schedule Set Up',
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Employees.ScheduleManagement,
        name: 'Schedule Management',
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Employees.EmployeeCapacity,
        name: 'Employee Capacity',
        sub: true,
        roles: baseRoles,
      },
    ],
  },
  {
    to: Routes.Services.Base,
    name: 'Services',
    roles: baseRoles,
    subLinks: [
      {
        to: Routes.Services.VehicleServices,
        name: 'Vehicle Services',
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Services.ServiceValet,
        name: 'Service Valet',
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Services.MobileService,
        name: 'Mobile Service',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Services.OtherTransportation,
        name: 'Other Transportation',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
    ],
  },
  {
    to: Routes.CapacityManagement.Base,
    name: 'Capacity Management',
    roles: baseRoles,
    subLinks: [
      {
        to: Routes.CapacityManagement.Pods,
        name: 'Service Books',
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.CapacityManagement.CapacitySettings,
        name: 'Capacity Settings',
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.CapacityManagement.DemandManagement,
        name: 'Demand Management',
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.CapacityManagement.PartsAvailability,
        name: 'Parts Availability',
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.CapacityManagement.RequestDifferentiation,
        name: 'Request Differentiation',
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.CapacityManagement.TimeDifferentiation,
        name: 'Time Differentiation',
        sub: true,
        roles: baseRoles,
      },
    ],
  },
  {
    to: Routes.Pricing.Base,
    name: 'Dynamic Pricing',
    roles: baseRoles,
    subLinks: [
      {
        to: Routes.Pricing.ServicePricingSettings,
        name: 'Service Price',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Pricing.OfferManagement,
        name: 'Offer Management',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
    ],
  },

  {
    to: Routes.BookingFlow.Base,
    name: 'Booking Experience',
    roles: baseRoles,
    subLinks: [
      {
        to: Routes.BookingFlow.BookingFlowConfigDetails,
        name: 'Booking Flow Configuration',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.BookingFlow.FirstScreen,
        name: 'First Screen Configuration',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.BookingFlow.ServiceOpsCodesMapping,
        name: 'Service Categories',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.BookingFlow.ScreenSettings,
        name: 'Screen Settings',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
    ],
  },
  {
    to: Routes.Dealer.Base,
    name: 'Dealer Operations',
    roles: baseRoles,
    subLinks: [
      {
        to: Routes.Dealer.DealerInternal,
        name: 'Internal',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Dealer.DealerCustomer,
        name: 'Customer',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
    ],
  },
  { to: Routes.Admin.Appointments, name: 'Appointments', roles: true },
  {
    to: Routes.Admin.Reporting,
    name: 'Reporting',
    roles: isProdOrUat ? reportingAllowedRoles : [],
    subLinks: [
      {
        to: Routes.Reporting.TodayAppointments,
        name: "Today's Appointments",
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Reporting.ShopLoading,
        name: 'Shop Loading',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Reporting.BDCReports,
        name: 'BDC Reports',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Reporting.CustomerBehavior,
        name: 'Customer Behavior',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Reporting.RepairOrderPerformance,
        name: 'Repair Orders',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Reporting.ServiceRetention,
        name: 'Service Retention',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
      {
        to: Routes.Reporting.HelpSupport,
        name: 'Help & Support',
        exact: true,
        sub: true,
        roles: baseRoles,
      },
    ],
  },
];
