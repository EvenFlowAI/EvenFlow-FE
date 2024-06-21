import React from "react";
import {Switch, Redirect} from "react-router-dom";
import {ContentContainer} from "../../components/wrappers/ContentContainer/ContentContainer";
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {DealershipGroupDetails} from "../../pages/admin/DealerShipGroupDetails/DealershipGroupDetails";
import {Profile} from "../../pages/admin/Profile/Profile";
import AppointmentsPage from "../../pages/admin/Appointments/AppointmentsPage";
import PricingRoutes from "../PricingRoutes/PricingRoutes";
import ReportingPage from "../../pages/admin/Reporting/ReportingPage";
import {CapacityRoutes} from "../CapacityRoutes/CapacityRoutes";
import {BookingFlowSettingsRoutes} from "../BookingFlowSettingsRoutes/BookingFlowSettingsRoutes";
import DealershipGroups from "../../pages/admin/DealershipGroups/DealershipGroups";
import {useCurrentUser} from "../../hooks/useCurrentUser/useCurrentUser";
import {Routes} from "../constants";
import EmployeesRoutes from "../EmployeesRoutes/EmployeesRoutes";
import {DealerOperations} from "../../pages/admin/DealerOperations/DealerOperations";
import ServicesRoutes from "../ServicesRoutes/ServicesRoutes";
import CenterProfileRoutes from "../CenterProfileRoutes/CenterProfileRoutes";
import {ServiceCenters} from "../../pages/admin/ServiceCenters/ServiceCenters";

export const AdminRoutes = () => {
    const currentUser = useCurrentUser();
    const currentRoleIsRestricted = !!currentUser && ["Call Center Rep", "Advisor", "Technician"].includes(currentUser?.role);

    if (!currentUser) return null;

    return <ContentContainer>
        <Switch>
            {currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Admin.DealershipGroups} exact component={DealershipGroups}/>
                : null}
            {currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Admin.ServiceCenters} exact component={ServiceCenters}/>
                : null}
            {currentUser.isSuperUser
                ? <PrivateRoute path={`${Routes.Admin.DealershipGroups}/:id`} component={DealershipGroupDetails} />
                : null}
            {!currentRoleIsRestricted && <PrivateRoute path={Routes.Employees.Base} component={EmployeesRoutes}/>}
            {!currentUser.isSuperUser ? <PrivateRoute path={Routes.CenterProfile.Base} component={CenterProfileRoutes}/>
                : null}
            {!currentUser.isSuperUser ?
                <PrivateRoute path={Routes.Admin.Appointments} component={AppointmentsPage} />
                : null}
            {!currentUser.isSuperUser && !currentRoleIsRestricted
                ? <PrivateRoute path={Routes.Dealer.Base} exact component={DealerOperations}/>
                : null}
            {!currentUser.isSuperUser && !currentRoleIsRestricted
                ? <PrivateRoute path={Routes.Pricing.Base} component={PricingRoutes}/>
                : null}
            {!currentUser.isSuperUser && !currentRoleIsRestricted
                ? <PrivateRoute path={Routes.BookingFlow.Base} component={BookingFlowSettingsRoutes}/>
                : null}
            {!currentUser.isSuperUser && !currentRoleIsRestricted
                ? <PrivateRoute path={Routes.Admin.Reporting} component={ReportingPage}/>
                : null}
            {!currentUser.isSuperUser && !currentRoleIsRestricted
                ? <PrivateRoute path={Routes.CapacityManagement.Base} component={CapacityRoutes} />
                : null}
            {!currentUser.isSuperUser && !currentRoleIsRestricted
                ? <PrivateRoute path={Routes.Services.Base} component={ServicesRoutes} />
                : null}
            <PrivateRoute path={Routes.Admin.Profile} component={Profile} />
            {currentUser.isSuperUser
                ? <Redirect to={Routes.Admin.DealershipGroups} />
                : currentRoleIsRestricted
                    ? <Redirect to={Routes.Admin.Appointments} />
                    : <Redirect to={Routes.Admin.Appointments} />}
        </Switch>
    </ContentContainer>;
}