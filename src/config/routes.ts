enum AdminRoutes {
    Base = "/admin",
    DealershipGroups = "/admin/dealership-groups",
    Employees = "/admin/employees",
    ServiceCenters = "/admin/service-centers"
}

enum LoginRoutes {
    Base = "/login",
}

enum EmailVerificationRoutes {
    Base= "/email-verification"
}

export const Routes = {
    Home: "/",
    Admin: AdminRoutes,
    Login: LoginRoutes,
    EmailVerification: EmailVerificationRoutes,
}