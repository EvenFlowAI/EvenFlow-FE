import React from "react";
import {ContentContainer} from "../Content/ContentContainer/ContentContainer";
import {Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from "../../utils/Routes";
import {Routes} from "../../config/routes";
import {CapacitySettings} from "./CapacitySettings/CapacitySettings";
import {AppointmentValue} from "./AppointmentValue/AppointmentValue";
import {OPsCodesPage} from "./OPsCodes/OPsCodesPage";

export const OptimizerPage = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Optimizer.ServiceRequests} component={OPsCodesPage} />
            <PrivateRoute path={Routes.Optimizer.AppointmentValue} component={AppointmentValue} />
            <PrivateRoute path={Routes.Optimizer.CapacitySettings} component={CapacitySettings} />
            <Redirect to={Routes.Optimizer.CapacitySettings} />
        </Switch>
    </ContentContainer>
}