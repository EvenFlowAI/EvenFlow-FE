enum AdminRoutes {
    Base = "/admin",
    DealershipGroups = "/admin/dealership-groups",
    Appointments = "/admin/appointments",
    Employees = "/admin/employees",
    Profile = "/admin/profile",
    ServiceCenters = "/admin/service-centers",
    ServiceRequests = "/admin/service-requests",
    BookingFlowConfig = "/admin/booking-flow-config",
    BookingFlowConfigDetails = "/admin/booking-flow-config/details",
    TransportationOptions = "/admin/booking-flow-config/transportation-options",
    ServiceOpsCodesMapping = "/admin/booking-flow-config/service-codes-mapping",
    VehicleDetails = "/admin/booking-flow-config/vehicle-details",
    CapacityOptimization = "/admin/capacity-optimization",
    Pricing = "/admin/pricing",
    ServicePriceSettings = "/admin/pricing/service-price-settings",
    MobileService = "/admin/pricing/mobile-service",
    ServiceValet = "/admin/pricing/service-valet",
    Reporting = "/admin/reporting",
}

enum AdminLogin {
    Base = "/admin-login",
    ForgotPassword = "/admin-login/forgot-password",
}
enum AccountRoutes {
    Base = "/account",
    Verification = "/account/email-verification",
    ResetPassword = "/account/reset-password"
}

enum OfferManagementRoutes {
    Base = "/offer-management"
}

enum OptimizerRoutes {
    Base = "/optimizer",

    ServiceRequests = "/optimizer/service-requests",
    AppointmentValue = "/optimizer/appointment-value",
    CapacitySettings = "/optimizer/capacity-settings",
    EmployeeSchedule = "/optimizer/employee-schedule",
    AppointmentSlotScoring = "/optimizer/appointment-slot-scoring",
    AppointmentAllocation = "/optimizer/appointment-allocation",
    OptimizationWindows = "/optimizer/optimization-windows",
    PricingSettings = "/optimizer/pricing-settings",
    MobileService = "/optimizer/mobile-service",
    Pods = "/optimizer/pods",
    ManageEXEvenFlowAppointments = "/optimizer/manage-ex-evenflow-appointments",
    PartsAvailability = "/optimizer/parts-availability",
    ServiceValet = "/optimizer/service-valet",
}

enum BookingFlowConfigRoutes {
    Base = "/admin/booking-flow-config",
    BookingFlowConfigDetails = "/admin/booking-flow-config/details",
    TransportationOptions = "/admin/booking-flow-config/transportation-options",
    ServiceOpsCodesMapping = "/admin/booking-flow-config/service-codes-mapping",
    VehicleDetails = "/admin/booking-flow-config/vehicle-details",
    FirstScreen = "/admin/booking-flow-config/first-screen",
    ScreenSettings = "/admin/booking-flow-config/screen-settings",
}

enum PricingRoutes {
    Base = "/admin/pricing",
    ServicePricingSettings = "/admin/pricing/service-pricing-settings",
    MobileService = "/admin/pricing/mobile-service",
    ServiceValet = "/admin/pricing/service-valet",
    OfferManagement = "/admin/pricing/offer-management",
}

enum EndUser {
    Base = "/welcome/:id",
    Welcome = "/welcome",
    CancelAppointment = "/appointment-cancel/:id",
    EditAppointment = "/appointment-update/:id",
    Appointment = "/appointment/:id",
    AppointmentFrame = "/f/appointment/:id",
    AppointmentFrameBase = "/f/appointment",
    AppointmentBase = "/appointment",
    Confirmation = "/confirmation/:id",
    ConfirmationBase = "/confirmation",
    ValueService = "/f/appointment/:id/valueService",
    PaymentBill = "/f/appointment/:id/payment-bill",
}

export const Routes = {
    Home: "/",
    Admin: AdminRoutes,
    Login: AdminLogin,
    EndUser: EndUser,
    Account: AccountRoutes,
    Optimizer: OptimizerRoutes,
    OfferManagement: OfferManagementRoutes,
    BookingFlow: BookingFlowConfigRoutes,
    Pricing: PricingRoutes,
}