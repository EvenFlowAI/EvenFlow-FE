enum AdminRoutes {
    Base = "/admin",
    DealershipGroups = "/admin/dealership-groups",
    Appointments = "/admin/appointments",
    Employees = "/admin/employees",
    Profile = "/admin/profile",
    ServiceCenters = "/admin/service-centers",
    ServiceRequests = "/admin/service-requests"
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
}

enum EndUser {
    Base = "/welcome/:id",
    Welcome = "/welcome",
    CancelAppointment = "/appointment-cancel/:id",
    EditAppointment = "/appointment-update/:id",
    Appointment = "/appointment/:id",
    AppointmentFrame = "/f/appointment/:id",
    AppointmentFrameBase = "/f/appointment/:id",
    AppointmentBase = "/appointment",
    Confirmation = "/confirmation/:id",
    ConfirmationBase = "/confirmation"
}

export const Routes = {
    Home: "/",
    Admin: AdminRoutes,
    Login: AdminLogin,
    EndUser: EndUser,
    Account: AccountRoutes,
    Optimizer: OptimizerRoutes,
    OfferManagement: OfferManagementRoutes
}