import React from "react";
import {Switch, Redirect, Route} from "react-router-dom";
import {ServiceCenterProfiles} from "./ServiceCenterProfiles/ServiceCenterProfiles";
import {Locations} from "./Locations/Locations";
import {Employees} from "./Employees/Employees";
import {ContentContainer} from "../Content/ContentContainer/ContentContainer";

export const AdminPage = () => {
    return <ContentContainer>
        <Switch>
            <Route path="/admin/sc-profiles" component={ServiceCenterProfiles}/>
            <Route path="/admin/employees" component={Employees}/>
            <Route path="/admin/locations" component={Locations}/>
            <Redirect to="/admin/sc-profiles"/>
        </Switch>
    </ContentContainer>;
}