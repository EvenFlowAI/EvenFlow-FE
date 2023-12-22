import {
    AccountRoutes,
    AdminLogin,
    AdminRoutes,
    BookingFlowConfigRoutes,
    EndUser,
    OfferManagementRoutes,
    OptimizerRoutes,
    PricingRoutes,
    ReportingRoutes
} from "./types";

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
    Reporting: ReportingRoutes,
}