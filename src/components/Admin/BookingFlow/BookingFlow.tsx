import React from "react";
import {ContentContainer} from "../../Content/ContentContainer/ContentContainer";
import {Switch} from "react-router-dom";
import {PrivateRoute} from "../../../utils/Routes";
import {Routes} from "../../../config/routes";
import BookingFlowConfig from "../BookingFlowConfig/BookingFlowConfig";
import {TransportationOptions} from "../../Modals/TransportationOptions/TransportationOptions";
import ServiceOpsCodesMapping from "../ServiceOpsCodesMapping/ServiceOpsCodesMapping";
import {VehicleDetails} from "../VehicleDetails/VehicleDetails";

export const BookingFlowPage = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.BookingFlow.BookingFlowConfigDetails} component={BookingFlowConfig} />
            <PrivateRoute path={Routes.BookingFlow.TransportationOptions} component={TransportationOptions} />
            <PrivateRoute path={Routes.BookingFlow.ServiceOpsCodesMapping} component={ServiceOpsCodesMapping} />
            <PrivateRoute path={Routes.BookingFlow.VehicleDetails} component={VehicleDetails} />
        </Switch>
    </ContentContainer>
}