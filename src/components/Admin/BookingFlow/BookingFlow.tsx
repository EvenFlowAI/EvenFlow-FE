import React from "react";
import {ContentContainer} from "../../Content/ContentContainer/ContentContainer";
import {Redirect, Switch} from "react-router-dom";
import {PrivateRoute} from "../../../utils/Routes";
import {Routes} from "../../../config/routes";
import BookingFlowConfig from "../BookingFlowConfig/BookingFlowConfig";
import {TransportationOptions} from "../TransportationOptions/TransportationOptions";
import ServiceOpsCodesMapping from "../ServiceOpsCodesMapping/ServiceOpsCodesMapping";
import {VehicleDetails} from "../VehicleDetails/VehicleDetails";
import FirstScreen from "../FirstScreen/FirstScreen";
import ScreenSettings from "../ScreenSettings/ScreenSettings";

export const BookingFlowPage = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.BookingFlow.TransportationOptions} component={TransportationOptions} />
            <PrivateRoute path={Routes.BookingFlow.ServiceOpsCodesMapping} component={ServiceOpsCodesMapping} />
            <PrivateRoute path={Routes.BookingFlow.VehicleDetails} component={VehicleDetails} />
            <PrivateRoute path={Routes.BookingFlow.BookingFlowConfigDetails} component={BookingFlowConfig} />
            <PrivateRoute path={Routes.BookingFlow.FirstScreen} component={FirstScreen} />
            <PrivateRoute path={Routes.BookingFlow.ScreenSettings} component={ScreenSettings} />
            <Redirect to={Routes.BookingFlow.BookingFlowConfigDetails} />
        </Switch>
    </ContentContainer>
}