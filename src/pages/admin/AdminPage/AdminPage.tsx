import React from "react";
import {Switch, Redirect} from "react-router-dom";
import {ServiceCenters} from "../../../features/ServiceCenters/ServiceCenters";
import {Employees} from "../../../features/Employees/Employees";
import {ContentContainer} from "../../../components/Content/ContentContainer/ContentContainer";
import {Routes} from "../../../config/routes";
import {PrivateRoute} from "../../../utils/Routes";
import {useCurrentUser} from "../../../utils/hooks";
import {AdminDashboard} from "../Dashboard/Dashboard";
import {DealershipGroupDetails} from "../DealerShipGroupDetails/DealershipGroupDetails";
import {Profile} from "../../../components/Admin/Profile/Profile";
import AppointmentsPage from "../Appointments/AppointmentsPage";
import PricingPage from "../Pricing/PricingPage";
import ReportingPage from "../Reporting/ReportingPage";
import {OptimizerPage} from "../../../components/Optimizer/OptimizerPage";
import {BookingFlowPage} from "../BookingFlow/BookingFlowPage";
import DealershipGroups from "../DealershipGroups/DealershipGroups";

export const AdminPage = () => {
    const currentUser = useCurrentUser();
    const hideDashboard = !!currentUser && ["Call Center Rep", "Advisor"].includes(currentUser?.role);

    if (!currentUser) return null;

    return <ContentContainer>
        <Switch>
            {currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Admin.DealershipGroups} exact component={DealershipGroups}/>
                : null}
            {currentUser.isSuperUser
                ? <PrivateRoute path={`${Routes.Admin.DealershipGroups}/:id`} component={DealershipGroupDetails} />
                : null}
            {!hideDashboard && <PrivateRoute path={Routes.Admin.Employees} component={Employees}/>}
            {!currentUser.isSuperUser ?
                <PrivateRoute path={Routes.Admin.Appointments} component={AppointmentsPage} />
                : null}
            {!currentUser.isSuperUser && !hideDashboard
                ? <PrivateRoute path={Routes.Admin.Base} exact component={AdminDashboard}/>
                : null}
            {!currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Admin.CapacityOptimization} component={OptimizerPage}/>
                : null}
            {!currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Pricing.Base} component={PricingPage}/>
                : null}
            {!currentUser.isSuperUser
                ? <PrivateRoute path={Routes.BookingFlow.Base} component={BookingFlowPage}/>
                : null}
            {!currentUser.isSuperUser && !hideDashboard
                ? <PrivateRoute path={Routes.Admin.Reporting} component={ReportingPage}/>
                : null}
            <PrivateRoute path={Routes.Admin.Profile} component={Profile} />
            <PrivateRoute path={Routes.Admin.ServiceCenters} component={ServiceCenters}/>
            {currentUser.isSuperUser
                ? <Redirect to={Routes.Admin.DealershipGroups} />
                : hideDashboard
                    ? <Redirect to={Routes.Admin.Appointments} />
                    : <Redirect to={Routes.Admin.Base} />}
        </Switch>
    </ContentContainer>;
}