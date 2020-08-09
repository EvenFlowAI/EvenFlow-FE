enum AdminRoutes {
    Base = "/admin",
    DealershipGroups = "/admin/dealership-groups",
    Employees = "/admin/employees",
    ServiceCenters = "/admin/service-centers"
}

enum LoginRoutes {
    Base = "/login",
}

export const Routes = {
    Home: "/",
    Admin: AdminRoutes,
    Login: LoginRoutes
}