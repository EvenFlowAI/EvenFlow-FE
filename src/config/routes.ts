enum AdminRoutes {
    Base = "/admin",
    DealershipGroups = "/admin/dealership-groups",
    Employees = "/admin/employees",
    Profile = "/admin/profile",
    ServiceCenters = "/admin/service-centers",
    ServiceRequests = "/admin/service-requests"
}

enum LoginRoutes {
    Base = "/login",
    ForgotPassword = "/login/forgot-password",
    ResetPassword = "/login/reset-password"
}
enum AccountRoutes {
    Base = "/account",
    Verification = "/account/email-verification"
}

enum OptimizerRoutes {
    Base = "/optimizer",

    ServiceRequests = "/optimizer/service-requests",
    AppointmentValue = "/optimizer/appointment-value",
    CapacitySettings = "/optimizer/capacity-settings",
    AppointmentSlotScoring = "/optimizer/appointment-slot-scoring",
    AppointmentAllocation = "/optimizer/appointment-allocation",
    OptimizationWindows = "/optimizer/optimization-windows"
}

export const Routes = {
    Home: "/",
    Admin: AdminRoutes,
    Login: LoginRoutes,
    Account: AccountRoutes,
    Optimizer: OptimizerRoutes,
}