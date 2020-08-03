import React from "react";
import {Switch, Redirect, Route} from "react-router-dom";
import {ServiceCenterProfiles} from "./ServiceCenterProfiles/ServiceCenterProfiles";
import {Locations} from "./Locations/Locations";
import {Employees} from "./Employees/Employees";
import {ContentContainer} from "../Content/ContentContainer/ContentContainer";
import {Routes} from "../../config/routes";

export const AdminPage = () => {
    return <ContentContainer>
        <Switch>
            <Route path={Routes.Admin.ServiceCenter} component={ServiceCenterProfiles}/>
            <Route path={Routes.Admin.Employees} component={Employees}/>
            <Route path={Routes.Admin.Locations} component={Locations}/>
            <Redirect to={Routes.Admin.ServiceCenter} />
        </Switch>
    </ContentContainer>;
}