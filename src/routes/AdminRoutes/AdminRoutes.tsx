import React from "react";
import {Switch, Redirect} from "react-router-dom";
import {ServiceCenters} from "../../pages/admin/ServiceCenters/ServiceCenters";
import {Employees} from "../../pages/admin/Employees/Employees";
import {ContentContainer} from "../../components/wrappers/ContentContainer/ContentContainer";
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {AdminDashboard} from "../../pages/admin/Dashboard/Dashboard";
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

export const AdminRoutes = () => {
    const currentUser = useCurrentUser();
    const currentRoleIsRestricted = !!currentUser && ["Call Center Rep", "Advisor"].includes(currentUser?.role);

    if (!currentUser) return null;

    return <ContentContainer>
        <Switch>
            {currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Admin.DealershipGroups} exact component={DealershipGroups}/>
                : null}
            {currentUser.isSuperUser
                ? <PrivateRoute path={`${Routes.Admin.DealershipGroups}/:id`} component={DealershipGroupDetails} />
                : null}
            {!currentRoleIsRestricted && <PrivateRoute path={Routes.Admin.Employees} component={Employees}/>}
            {!currentUser.isSuperUser ?
                <PrivateRoute path={Routes.Admin.Appointments} component={AppointmentsPage} />
                : null}
            {!currentUser.isSuperUser && !currentRoleIsRestricted
                ? <PrivateRoute path={Routes.Admin.Base} exact component={AdminDashboard}/>
                : null}
            {!currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Admin.CapacityOptimization} component={CapacityRoutes}/>
                : null}
            {!currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Pricing.Base} component={PricingRoutes}/>
                : null}
            {!currentUser.isSuperUser
                ? <PrivateRoute path={Routes.BookingFlow.Base} component={BookingFlowSettingsRoutes}/>
                : null}
            {!currentUser.isSuperUser && !currentRoleIsRestricted
                ? <PrivateRoute path={Routes.Admin.Reporting} component={ReportingPage}/>
                : null}
            {!currentUser.isSuperUser && !currentRoleIsRestricted
                ? <PrivateRoute path={Routes.Optimizer.Base} component={CapacityRoutes} />
                : null}
            <PrivateRoute path={Routes.Admin.Profile} component={Profile} />
            <PrivateRoute path={Routes.Admin.ServiceCenters} component={ServiceCenters}/>
            {currentUser.isSuperUser
                ? <Redirect to={Routes.Admin.DealershipGroups} />
                : currentRoleIsRestricted
                    ? <Redirect to={Routes.Admin.Appointments} />
                    : <Redirect to={Routes.Admin.Base} />}
        </Switch>
    </ContentContainer>;
}