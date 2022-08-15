import React from "react";
import {Switch, Redirect} from "react-router-dom";
import {DealershipGroups} from "./DealershipGroups/DealershipGroups";
import {ServiceCenters} from "./ServiceCenters/ServiceCenters";
import {Employees} from "./Employees/Employees";
import {ContentContainer} from "../Content/ContentContainer/ContentContainer";
import {Routes} from "../../config/routes";
import {PrivateRoute} from "../../utils/Routes";
import {useCurrentUser} from "../../utils/hooks";
import {AdminDashboard} from "./Dashboard/Dashboard";
import {DealershipGroupDetail} from "./DealershipGroups/Detail/DealershipGroupDetail";
import {Roles} from "../../config/constants";
import {Profile} from "./Profile/Profile";
import {ServiceRequests} from "./ServiceRequets/ServiceRequets";
import {Appointments} from "../Appointments/Appointments";
import PricingPage from "./Pricing/PricingPage";
import Reporting from "./Reporting/Reporting";
import {OptimizerPage} from "../Optimizer/OptimizerPage";
import {BookingFlowPage} from "./BookingFlow/BookingFlow";

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
                ? <PrivateRoute path={`${Routes.Admin.DealershipGroups}/:id`} component={DealershipGroupDetail} />
                : null}
            {currentUser.isSuperUser
                ? <PrivateRoute
                    path={`${Routes.Admin.ServiceRequests}`} component={ServiceRequests} />
                : null}
            {!hideDashboard && <PrivateRoute path={Routes.Admin.Employees} component={Employees}/>}
            {!currentUser.isSuperUser ?
                <PrivateRoute path={Routes.Admin.Appointments} component={Appointments} />
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
                ? <PrivateRoute path={Routes.Admin.Reporting} exact component={Reporting}/>
                : null}
            {currentUser.role === Roles.Owner
                ? <PrivateRoute path={Routes.Admin.Profile} component={Profile} />
                : null}
            <PrivateRoute path={Routes.Admin.ServiceCenters} component={ServiceCenters}/>
            {currentUser.isSuperUser
                ? <Redirect to={Routes.Admin.DealershipGroups} />
                : hideDashboard
                    ? <Redirect to={Routes.Admin.Appointments} />
                    : <Redirect to={Routes.Admin.Base} />}
        </Switch>
    </ContentContainer>;
}