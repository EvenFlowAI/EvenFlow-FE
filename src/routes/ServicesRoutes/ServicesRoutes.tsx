import React from 'react';
import {ContentContainer} from "../../components/wrappers/ContentContainer/ContentContainer";
import {Redirect, Switch} from "react-router-dom";
import {Routes} from "../constants";
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {ServiceRequests} from "../../pages/admin/ServiceRequests/ServiceRequests";

const ServicesRoutes = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Services.VehicleServices} component={ServiceRequests} />
            <Redirect to={Routes.Services.VehicleServices}/>
        </Switch>
    </ContentContainer>
};

export default ServicesRoutes;