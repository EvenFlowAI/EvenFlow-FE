export enum AdminRoutes {
  Base = '/admin',
  DealershipGroups = '/admin/dealership-groups',
  Appointments = '/admin/appointments',
  AiAgents = '/admin/aiAgents',
  Profile = '/admin/profile',
  ServiceCenters = '/admin/service-centers',
  ServiceRequests = '/admin/service-requests',
  CapacityOptimization = '/admin/capacity-optimization',
  Pricing = '/admin/pricing',
  MobileService = '/admin/pricing/mobile-service',
  Reporting = '/admin/reporting',
  Application = '/admin/application',
  Vehicles = '/admin/application/vehicles',
  OpCodeCategory = '/admin/application/op-code-category',
}

export enum AdminLogin {
  Base = '/admin-login',
  ForgotPassword = '/admin-login/forgot-password',
}

export enum AccountRoutes {
  Base = '/account',
  Verification = '/account/email-verification',
  ResetPassword = '/account/reset-password',
}

export enum OfferManagementRoutes {
  Base = '/offer-management',
}

export enum CapacityManagementRoutes {
  Base = '/admin/capacity-management',
  AppointmentValue = '/admin/capacity-management/appointment-value',
  CapacitySettings = '/admin/capacity-management/capacity-settings',
  EmployeeSchedule = '/admin/capacity-management/employee-schedule',
  AppointmentAllocation = '/admin/capacity-management/appointment-allocation',
  OptimizationWindows = '/admin/capacity-management/optimization-windows',
  PricingSettings = '/admin/capacity-management/pricing-settings',
  MobileService = '/admin/capacity-management/mobile-service',
  Pods = '/admin/capacity-management/pods',
  RequestDifferentiation = '/admin/capacity-management/request-differentiation',
  TimeDifferentiation = '/admin/capacity-management/time-differentiation',
  DemandManagement = '/admin/capacity-management/demand-management',
  PartsAvailability = '/admin/capacity-management/parts-availability',
}

export enum BookingFlowConfigRoutes {
  Base = '/admin/booking-flow-config',
  BookingFlowConfigDetails = '/admin/booking-flow-config/details',
  ServiceOpsCodesMapping = '/admin/booking-flow-config/service-codes-mapping',
  FirstScreen = '/admin/booking-flow-config/first-screen',
  ScreenSettings = '/admin/booking-flow-config/screen-settings',
}

export enum ReportingRoutes {
  Base = '/admin/reporting',
  BDCReports = '/admin/reporting/bdc-reports',
  ShopLoading = '/admin/reporting/shop-loading',
  ValetAppointments = '/admin/reporting/valet-appointments',
  AppointmentAssignments = '/admin/reporting/appointment-assignments',
  CustomerBehavior = '/admin/reporting/customer-behavior',
  RepairOrderPerformance = '/admin/reporting/repair-order-performance',
  OutboundOpportunities = '/admin/reporting/outbound-opportunities',
}

export enum PricingRoutes {
  Base = '/admin/pricing',
  ServicePricingSettings = '/admin/pricing/service-pricing-settings',
  MobileService = '/admin/pricing/mobile-service',
  ServiceValet = '/admin/pricing/service-valet',
  OfferManagement = '/admin/pricing/offer-management',
}

export enum EmployeeRoutes {
  Base = '/admin/employees',
  AddDelete = '/admin/employees/add-delete',
  ScheduleSetUp = '/admin/employees/schedule-set-up',
  ScheduleManagement = '/admin/employees/schedule-management',
  EmployeeCapacity = '/admin/employees/employee-capacity',
}

export enum EndUser {
  Base = '/welcome/:id',
  Welcome = '/welcome',
  CancelAppointment = '/appointment-cancel/:id',
  CancelAppointmentFromEmail = '/appointment-cancel/:id/by-key',
  EditAppointment = '/appointment-update/:id',
  EditAppointmentFromEmail = '/appointment-update/:id/by-key',
  CloneAppointmentFromEmail = '/appointment-clone/:id/by-key',
  Appointment = '/appointment/:id',
  AppointmentFrame = '/f/appointment/:id',
  ManageAppointmentFrame = '/f/appointment-manage/:id',
  AppointmentFrameBase = '/f/appointment',
  ValueService = '/f/appointment/:id/valueService',
  PaymentBill = '/f/appointment/:id/payment-bill',
}

export enum DealerRoutes {
  Base = '/admin/dealer-operations',
  DealerInternal = '/admin/dealer-operations/internal',
  DealerCustomer = '/admin/dealer-operations/customer',
}

export enum ServicesRoutes {
  Base = '/admin/services',
  VehicleServices = '/admin/services/vehicle-services',
  ServiceValet = '/admin/services/service-valet',
  MobileService = '/admin/services/mobile-service',
  OtherTransportation = '/admin/services/other-transportation',
}

export enum ServiceValetRoutes {
  GeographicZones = 'geographiczones',
  GeographicZonesMap = 'geographiczonesmap',
  CenterSettings = 'centersettings',
  ZoneRouting = 'zonerouting',
  TimeRangesCapacity = 'timerangescapacity',
  ConvinienceFees = 'conviniencefees',
}

export enum CenterProfileRoutes {
  Base = '/admin/center-profile',
  ServiceCenters = '/admin/center-profile/service-centers',
  FacilitySetUp = '/admin/center-profile/facility-set-up',
  Vehicles = '/admin/center-profile/vehicles',
  Integrations = '/admin/center-profile/integrations',
}

export enum QueryTypes {
  selectedTab = 'selectedTab',
}
