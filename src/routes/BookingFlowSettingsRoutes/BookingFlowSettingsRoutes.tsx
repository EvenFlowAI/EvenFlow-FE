import React from "react";
import {ContentContainer} from "../../components/wrappers/ContentContainer/ContentContainer";
import {Redirect, Switch} from "react-router-dom";
import {PrivateRoute} from "../PrivateRoute/PrivateRoute";
import {BookingFlowConfigPage} from "../../pages/admin/BookingFlowConfig/BookingFlowConfigPage";
import {TransportationOptions} from "../../pages/admin/TransportationOptions/TransportationOptions";
import {ServiceCategoriesPage} from "../../pages/admin/ServiceCategories/ServiceCategoriesPage";
import {VehicleDetails} from "../../pages/admin/VehicleDetails/VehicleDetails";
import {FirstScreenOptionsPage} from "../../pages/admin/FirstScreenOptions/FirstScreenOptionsPage";
import ScreenSettingsPage from "../../pages/admin/ScreenSettings/ScreenSettingsPage";
import {Routes} from "../constants";

export const BookingFlowSettingsRoutes = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.BookingFlow.TransportationOptions} component={TransportationOptions} />
            <PrivateRoute path={Routes.BookingFlow.ServiceOpsCodesMapping} component={ServiceCategoriesPage} />
            <PrivateRoute path={Routes.BookingFlow.VehicleDetails} component={VehicleDetails} />
            <PrivateRoute path={Routes.BookingFlow.BookingFlowConfigDetails} component={BookingFlowConfigPage} />
            <PrivateRoute path={Routes.BookingFlow.FirstScreen} component={FirstScreenOptionsPage} />
            <PrivateRoute path={Routes.BookingFlow.ScreenSettings} component={ScreenSettingsPage} />
            <Redirect to={Routes.BookingFlow.BookingFlowConfigDetails} />
        </Switch>
    </ContentContainer>
}