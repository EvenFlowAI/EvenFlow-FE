enum AdminRoutes {
    Base = "/admin",
    DealershipGroups = "/admin/dealership-groups",
    Employees = "/admin/employees",
    Profile = "/admin/profile",
    ServiceCenters = "/admin/service-centers",
    ServiceRequests = "/admin/service-requests"
}

enum AdminLogin {
    Base = "/admin-login",
    ForgotPassword = "/admin-login/forgot-password",
    ResetPassword = "/admin-login/reset-password"
}
enum AccountRoutes {
    Base = "/account",
    Verification = "/account/email-verification"
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
    OptimizationWindows = "/optimizer/optimization-windows"
}

enum EndUser {
    Base = "/welcome",
    Appointment = "/appointment"
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