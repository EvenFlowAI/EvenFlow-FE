import React from "react";
import { ContentContainer } from "../../components/wrappers/ContentContainer/ContentContainer";
import { Redirect, Switch } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute/PrivateRoute";
import { Routes } from "../constants";
import { FacilitySetUp } from "../../pages/admin/FacilitySetUp/FacilitySetUp";
import { ServiceCenters } from "../../pages/admin/ServiceCenters/ServiceCenters";
import { Vehicles } from "../../pages/admin/Vehicles/Vehicles";
import Integrations from "../../pages/admin/Integrations/Integrations";

const CenterProfileRoutes = () => {
  return (
    <ContentContainer>
      <Switch>
        <PrivateRoute
          path={Routes.CenterProfile.ServiceCenters}
          component={ServiceCenters}
        />
        <PrivateRoute
          path={Routes.CenterProfile.FacilitySetUp}
          component={FacilitySetUp}
        />
        <PrivateRoute
          path={Routes.CenterProfile.Vehicles}
          component={Vehicles}
        />
        <PrivateRoute
          path={Routes.CenterProfile.Integrations}
          component={Integrations}
        />
        <Redirect to={Routes.CenterProfile.ServiceCenters} />
      </Switch>
    </ContentContainer>
  );
};

export default CenterProfileRoutes;
