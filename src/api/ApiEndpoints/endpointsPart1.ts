import { IApiEndpoints } from './types';

type TEndpointsPart1 = Pick<
  IApiEndpoints,
  | 'Accounts'
  | 'AncillaryPricing'
  | 'Appointments'
  | 'AppointmentAllocation'
  | 'AppointmentSlots'
  | 'AppointmentPricing'
  | 'Authentications'
  | 'BookingFlowConfig'
  | 'BookingFlowScreenSettings'
  | 'CapacityManagement'
  | 'CapacitySettings'
  | 'ComplimentaryServices'
  | 'Customers'
  | 'CustomerConsent'
  | 'Dealerships'
  | 'DemandManagement'
  | 'Employees'
  | 'EmployeeCapacity'
  | 'EmployeeSchedule'
  | 'GeneralSettings'
>;

export const endpointsPart1: TEndpointsPart1 = {
  Accounts: {
    Recovery: {
      route: '/accounts/password-recovery',
      method: 'post',
    },
    Reset: { route: '/accounts/password-reset', method: 'patch' },
    Change: { route: '/accounts/password-change', method: 'patch' },
    Verification: { route: '/accounts/verification', method: 'patch' },
    Profile: { route: '/accounts/profile', method: 'get' },
    Dealership: { route: '/accounts/dealership', method: 'get' },
    AccessibleDealerships: { route: '/accounts/accessible-dealerships', method: 'get' },
    ResendEmail: { route: '/accounts/invitation-email', method: 'post' },
  },
  AncillaryPricing: {
    GetZones: { route: '/ancillary-price/geographic-zone/by-query', method: 'post' },
    UpdateZone: { route: '/ancillary-price/geographic-zone/{id}', method: 'put' },
    GetDistances: { route: '/ancillary-price/distance/by-query', method: 'post' },
    CreateDistance: { route: '/ancillary-price/distance', method: 'post' },
    UpdateDistance: { route: '/ancillary-price/distance/{id}', method: 'put' },
    DeleteDistance: { route: '/ancillary-price/distance/{id}', method: 'delete' },
    GetByZip: { route: '/ancillary-price/get-convenience-fee', method: 'post' },
  },
  Appointments: {
    Create: { route: '/appointments', method: 'post' },
    Update: { route: '/appointments/{id}', method: 'put' },
    UpdateByKey: { route: '/appointments/{id}/by-key', method: 'put' },
    Cancel: { route: '/appointments/{id}/cancel', method: 'put' },
    CancelByKey: { route: '/appointments/{id}/cancel/by-key', method: 'put' },
    GetByKey: { route: '/appointments/{key}/by-key', method: 'get' },
    CheckPodChanged: { route: '/appointments/{key}/check-pod-changed', method: 'post' },
    GetServiceBooks: { route: '/appointments-filter/{id}/service-book-list', method: 'get' },
    GetSchedulers: { route: '/appointments-filter/scheduler-list', method: 'get' },
    GetShortByQuery: { route: '/appointments/short-by-query', method: 'get' },
  },
  AppointmentAllocation: {
    SetTimeWindows: { route: '/appointment-allocations/time-windows', method: 'put' },
    GetTimeWindows: { route: '/appointment-allocations/time-windows', method: 'get' },
    GetTWEligibility: {
      route: '/appointment-allocations/time-windows/eligibility',
      method: 'get',
    },
    SetTWEligibility: {
      route: '/appointment-allocations/time-windows/eligibility',
      method: 'patch',
    },
    CreateDemandSegment: { route: '/appointment-allocations/demand-segments', method: 'post' },
    GetDemandSegments: { route: '/appointment-allocations/demand-segments', method: 'get' },
    BatchUpdateDemandSegments: {
      route: '/appointment-allocations/demand-segments',
      method: 'put',
    },
    RemoveDemandSegment: {
      route: '/appointment-allocations/demand-segments/{id}',
      method: 'delete',
    },
    SetUnplanned: {
      route: '/demand-management-settings/unplanned-demand-segments',
      method: 'put',
    },
    GetUnplanned: {
      route: '/demand-management-settings/unplanned-demand-segments',
      method: 'get',
    },
    GetCapacity: { route: '/demand-management-settings/capacity', method: 'get' },
    GetUnplannedSlotsByDay: {
      route: '/demand-management-settings/unplanned-demand-slots',
      method: 'get',
    },
    UpdateUnplannedSlots: {
      route: '/demand-management-settings/unplanned-demand-slots',
      method: 'put',
    },
  },
  AppointmentSlots: {
    GetSlots: { route: '/appointment-slots/by-query', method: 'post' },
    GetServiceValetSlots: { route: '/appointment-slots/service-valet-slots', method: 'post' },
    GetDMSAvailability: { route: '/appointment-slots/dms-availability', method: 'get' },
    GetDMSAvailabilityCSV: { route: '/appointment-slots/dms-availability/csv', method: 'get' },
  },
  AppointmentPricing: {
    GetPriceList: { route: '/appointment-pricing/requests-price-list', method: 'post' },
  },
  Authentications: {
    Request: { route: '/authentications', method: 'post' },
    Refresh: { route: '/authentications/refresh', method: 'post' },
    Anonymous: { route: '/authentications/anonymous ', method: 'post' },
  },
  BookingFlowConfig: {
    Get: { route: '/booking-flow/{id}/settings', method: 'get' },
    Update: { route: '/booking-flow/{id}/settings', method: 'put' },
  },
  BookingFlowScreenSettings: {
    GetEmailRequirement: {
      route: '/booking-flow-screen-settings/{id}/email-requirement',
      method: 'get',
    },
    UpdateEmailRequirement: {
      route: '/booking-flow-screen-settings/{id}/email-requirement',
      method: 'put',
    },
  },
  CapacityManagement: {
    Reallocate: { route: '/capacity-management/capacity-data-reallocate', method: 'put' },
  },
  CapacitySettings: {
    GetAll: { route: '/capacity-settings', method: 'get' },
    GetById: { route: '/capacity-settings/{id}', method: 'get' },
    Update: { route: '/capacity-settings', method: 'put' },
  },
  ComplimentaryServices: {
    GetByQuery: { route: '/complimentary-services/by-query', method: 'post' },
    Create: { route: '/complimentary-services', method: 'post' },
    AddFromList: { route: '/complimentary-services/add-service-request', method: 'post' },
    Update: { route: '/complimentary-services/{id}', method: 'put' },
    Remove: { route: '/complimentary-services/{id}', method: 'delete' },
  },
  Customers: {
    GetByName: { route: '/customers/vehicles/by-customer-name', method: 'get' },
    Update: { route: '/customers/vehicles', method: 'put' },
    GetRepairHistory: { route: '/customers/vehicles/repair-orders', method: 'get' },
    GetBySearchTerm: { route: '/customers/vehicles', method: 'get' },
    GetSingleCustomerVehicles: { route: '/customers/single-customer-vehicles', method: 'get' },
  },
  CustomerConsent: {
    Create: { route: '/customer-consents', method: 'post' },
    GetAll: { route: '/customer-consents', method: 'get' },
    GetById: { route: '/customer-consents/{id}', method: 'get' },
    Remove: { route: '/customer-consents', method: 'delete' },
    Update: { route: '/customer-consents/{id}', method: 'put' },
    Search: { route: '/customer-consents/search', method: 'post' },
    Toggle: { route: '/customer-consents', method: 'patch' },
  },
  Dealerships: {
    Create: { route: '/dealerships', method: 'post' },
    GetShort: { route: '/dealerships', method: 'get' },
    GetAll: { route: '/dealerships/by-query', method: 'post' },
    Remove: { route: '/dealerships/{id}', method: 'delete' },
    Retrieve: { route: '/dealerships/{id}', method: 'get' },
    Update: { route: '/dealerships/{id}', method: 'put' },
    UpdateAddress: { route: '/dealerships', method: 'put' },
    UploadAvatar: { route: '/dealerships/{id}/avatar', method: 'patch' },
    UploadLogo: { route: '/dealerships/{id}/logo', method: 'patch' },
    UpdateSideBarColor: { route: '/dealerships/{id}/left-panel-color', method: 'patch' },
  },
  DemandManagement: {
    GetSettings: { route: '/demand-management-settings/predictions', method: 'get' },
    UpdateSettings: { route: '/demand-management-settings/predictions', method: 'put' },
  },
  Employees: {
    GetAssignmentSettings: {
      route: '/employees/assignment-settings/{serviceCenterId}',
      method: 'get',
    },
    UpdateAssignmentSettings: { route: '/employees/assignment-settings', method: 'put' },
  },
  EmployeeCapacity: {
    GetAdvisorsCapacity: { route: '/employee-capacity/advisors', method: 'get' },
    UpdateAdvisorsCapacity: { route: '/employee-capacity/advisors', method: 'put' },
    GetTechniciansCapacity: { route: '/employee-capacity/technicians', method: 'get' },
    UpdateTechniciansCapacity: { route: '/employee-capacity/technicians', method: 'put' },
    UpdateTechniciansSettings: {
      route: '/employee-capacity/technicians/settings',
      method: 'put',
    },
  },
  EmployeeSchedule: {
    Create: { route: '/employee-schedules', method: 'post' },
    Retrieve: { route: '/employee-schedules/{id}', method: 'get' },
    Update: { route: '/employee-schedules', method: 'put' },
    Remove: { route: '/employee-schedules/{id}', method: 'delete' },
    GetAll: { route: '/employee-schedules/by-query', method: 'post' },
    SetForWeek: { route: '/employee-schedules/batch-update', method: 'put' },
    GetCalendarSummary: {
      route: '/employee-schedules/date-range-summary-per-role',
      method: 'post',
    },
    GetByDate: { route: '/employee-schedules/get-by-date', method: 'get' },
    UpdateByDate: { route: '/employee-schedules/set-for-date-range', method: 'put' },
    GetBaseSummary: { route: '/employee-schedules/base-summary', method: 'post' },
    GetSummaryByEmployee: {
      route: '/employee-schedules/base-summary-by-employee',
      method: 'post',
    },
    GetTimeScheduleByEmployee: {
      route: '/employee-schedules/get-base-schedule-by-employee',
      method: 'get',
    },
    SetTimeScheduleByEmployee: {
      route: '/employee-schedules/set-base-schedule-by-employee',
      method: 'post',
    },
  },
  GeneralSettings: {
    Get: { route: '/general-settings', method: 'get' },
    Update: { route: '/general-settings', method: 'post' },
  },
};
