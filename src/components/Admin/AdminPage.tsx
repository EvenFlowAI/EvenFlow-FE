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
import {VehicleDetails} from "./VehicleDetails/VehicleDetails";
import {Appointments} from "../Appointments/Appointments";
import ServiceOpsCodesMapping from "./ServiceOpsCodesMapping/ServiceOpsCodesMapping";

export const AdminPage = () => {
    const currentUser = useCurrentUser();
    if (!currentUser) return null;
    const hideDashboard = ["Call Center Rep", "Advisor"].includes(currentUser?.role);

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
                ? <PrivateRoute path={Routes.Admin.VehicleDetails} exact component={VehicleDetails}/>
                : null}
            {!currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Admin.ServiceOpsCodesMapping} exact component={ServiceOpsCodesMapping}/>
                : null}
            {currentUser.role === Roles.Owner
                ? <PrivateRoute path={Routes.Admin.Profile} component={Profile} />
                : null}
            <PrivateRoute path={Routes.Admin.ServiceCenters} component={ServiceCenters}/>
            {currentUser.isSuperUser
                ? <Redirect to={Routes.Admin.DealershipGroups} />
                : <Redirect to={Routes.Admin.Base} />}
        </Switch>
    </ContentContainer>;
}