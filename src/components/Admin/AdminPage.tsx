import React from "react";
import {Switch, Redirect, Route} from "react-router-dom";
import {DealershipGroups} from "./DealershipGroups/DealershipGroups";
import {ServiceCenters} from "./ServiceCenters/ServiceCenters";
import {Employees} from "./Employees/Employees";
import {ContentContainer} from "../Content/ContentContainer/ContentContainer";
import {Routes} from "../../config/routes";

export const AdminPage = () => {
    return <ContentContainer>
        <Switch>
            <Route path={Routes.Admin.DealershipGroups} component={DealershipGroups}/>
            <Route path={Routes.Admin.Employees} component={Employees}/>
            <Route path={Routes.Admin.ServiceCenters} component={ServiceCenters}/>
            <Redirect to={Routes.Admin.DealershipGroups} />
        </Switch>
    </ContentContainer>;
}