import {
    AccountRoutes,
    AdminLogin,
    AdminRoutes,
    BookingFlowConfigRoutes,
    EndUser,
    OfferManagementRoutes,
    CapacityManagementRoutes,
    PricingRoutes,
    ReportingRoutes
} from "./types";

export const Routes = {
    Home: "/",
    Admin: AdminRoutes,
    Login: AdminLogin,
    EndUser: EndUser,
    Account: AccountRoutes,
    CapacityManagement: CapacityManagementRoutes,
    OfferManagement: OfferManagementRoutes,
    BookingFlow: BookingFlowConfigRoutes,
    Pricing: PricingRoutes,
    Reporting: ReportingRoutes,
}