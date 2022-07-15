import React from "react";
import {ContentContainer} from "../../Content/ContentContainer/ContentContainer";
import {Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from "../../../utils/Routes";
import {Routes} from "../../../config/routes";
import {useCurrentUser} from "../../../utils/hooks";
import {Roles} from "../../../config/constants";
import BookingFlowConfig from "../BookingFlowConfig/BookingFlowConfig";
import {TransportationOptions} from "../../Modals/TransportationOptions/TransportationOptions";
import ServiceOpsCodesMapping from "../ServiceOpsCodesMapping/ServiceOpsCodesMapping";
import {VehicleDetails} from "../VehicleDetails/VehicleDetails";

export const BookingFlowPage = () => {
    const currentUer = useCurrentUser();
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.BookingFlow.BookingFlowConfigDetails} component={BookingFlowConfig} />
            <PrivateRoute path={Routes.BookingFlow.TransportationOptions} component={TransportationOptions} />
            <PrivateRoute path={Routes.BookingFlow.ServiceOpsCodesMapping} component={ServiceOpsCodesMapping} />
            <PrivateRoute path={Routes.BookingFlow.VehicleDetails} component={VehicleDetails} />
            <Redirect to={currentUer?.role === Roles.Advisor ? Routes.Optimizer.EmployeeSchedule : Routes.Optimizer.ServiceRequests} />
        </Switch>
    </ContentContainer>
}