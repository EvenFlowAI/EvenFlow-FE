import React from "react";
import { ContentContainer } from "../../components/wrappers/ContentContainer/ContentContainer";
import { Redirect, Switch } from "react-router-dom";
import { Routes } from "../constants";
import { PrivateRoute } from "../PrivateRoute/PrivateRoute";
import { VehicleServices } from "../../pages/admin/VehicleServices/VehicleServices";
import ServiceValet from "../../pages/admin/ServiceValet/ServiceValet";
import MobileService from "../../pages/admin/MobileService/MobileService";
import { Transportations } from "../../features/admin/Transportations/Transportations";

const ServicesRoutes = () => {
  return (
    <ContentContainer>
      <Switch>
        <PrivateRoute
          path={Routes.Services.VehicleServices}
          component={VehicleServices}
        />
        <PrivateRoute
          path={Routes.Services.ServiceValet}
          component={ServiceValet}
        />
        <PrivateRoute
          path={Routes.Services.MobileService}
          component={MobileService}
        />
        <PrivateRoute
          path={Routes.Services.OtherTransportation}
          component={Transportations}
        />
        <Redirect to={Routes.Services.VehicleServices} />
      </Switch>
    </ContentContainer>
  );
};

export default ServicesRoutes;
