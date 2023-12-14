import React from "react";
import {ContentContainer} from "../../../components/Content/ContentContainer/ContentContainer";
import {Redirect, Switch} from "react-router-dom";
import {PrivateRoute} from "../../../utils/Routes";
import {Routes} from "../../../config/routes";
import {BookingFlowConfigPage} from "../BookingFlowConfig/BookingFlowConfigPage";
import {TransportationOptions} from "../TransportationOptions";
import {ServiceCategoriesPage} from "../ServiceCategories/ServiceCategoriesPage";
import {VehicleDetails} from "../VehicleDetails/VehicleDetails";
import {FirstScreenOptionsPage} from "../FirstScreenOptions/FirstScreenOptionsPage";
import {ScreenSettings} from "../../../features/ScreenSettings";

export const BookingFlowPage = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.BookingFlow.TransportationOptions} component={TransportationOptions} />
            <PrivateRoute path={Routes.BookingFlow.ServiceOpsCodesMapping} component={ServiceCategoriesPage} />
            <PrivateRoute path={Routes.BookingFlow.VehicleDetails} component={VehicleDetails} />
            <PrivateRoute path={Routes.BookingFlow.BookingFlowConfigDetails} component={BookingFlowConfigPage} />
            <PrivateRoute path={Routes.BookingFlow.FirstScreen} component={FirstScreenOptionsPage} />
            <PrivateRoute path={Routes.BookingFlow.ScreenSettings} component={ScreenSettings} />
            <Redirect to={Routes.BookingFlow.BookingFlowConfigDetails} />
        </Switch>
    </ContentContainer>
}