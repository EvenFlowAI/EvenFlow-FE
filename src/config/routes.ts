enum AdminRoutes {
    Base = "/admin",
    DealershipGroups = "/admin/dealership-groups",
    Employees = "/admin/employees",
    ServiceCenters = "/admin/service-centers"
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

export const Routes = {
    Home: "/",
    Admin: AdminRoutes,
    Login: LoginRoutes,
    Account: AccountRoutes
}