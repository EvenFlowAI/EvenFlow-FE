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

export const AdminPage = () => {
    const currentUser = useCurrentUser();
    if (!currentUser) return null;
    return <ContentContainer>
        <Switch>
            {currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Admin.DealershipGroups} exact component={DealershipGroups}/>
                : null}
            {currentUser.isSuperUser
                ? <PrivateRoute path={`${Routes.Admin.DealershipGroups}/:id`} component={DealershipGroupDetail} />
                : null}
            <PrivateRoute path={Routes.Admin.Employees} component={Employees}/>
            {!currentUser.isSuperUser
                ? <PrivateRoute path={Routes.Admin.Base} exact component={AdminDashboard}/>
                : null}
            <PrivateRoute path={Routes.Admin.ServiceCenters} component={ServiceCenters}/>
            {currentUser.isSuperUser
                ? <Redirect to={Routes.Admin.DealershipGroups} />
                : <Redirect to={Routes.Admin.Base} />}
        </Switch>
    </ContentContainer>;
}