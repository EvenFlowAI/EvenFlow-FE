import React from "react";
import {Switch, Redirect} from "react-router-dom";
import {DealershipGroups} from "./DealershipGroups/DealershipGroups";
import {ServiceCenters} from "./ServiceCenters/ServiceCenters";
import {Employees} from "./Employees/Employees";
import {ContentContainer} from "../Content/ContentContainer/ContentContainer";
import {Routes} from "../../config/routes";
import {PrivateRoute} from "../../utils/Routes";

export const AdminPage = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Admin.DealershipGroups} component={DealershipGroups}/>
            <PrivateRoute path={Routes.Admin.Employees} component={Employees}/>
            <PrivateRoute path={Routes.Admin.ServiceCenters} component={ServiceCenters}/>
            <Redirect to={Routes.Admin.DealershipGroups} />
        </Switch>
    </ContentContainer>;
}