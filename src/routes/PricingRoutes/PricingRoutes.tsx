import React from "react";
import { ContentContainer } from "../../components/wrappers/ContentContainer/ContentContainer";
import { Redirect, Switch } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute/PrivateRoute";
import { ServicePricingSettings } from "../../pages/admin/ServicePricingSettings/ServicePricingSettings";
import { OfferManagementPage } from "../../pages/admin/OfferManagement/OfferManagementPage";

import { useCurrentUser } from "../../hooks/useCurrentUser/useCurrentUser";
import { Routes } from "../constants";

const PricingRoutes = () => {
  const currentUser = useCurrentUser();
  return (
    <ContentContainer>
      <Switch>
        <PrivateRoute
          path={Routes.Pricing.OfferManagement}
          component={OfferManagementPage}
        />
        <PrivateRoute
          path={Routes.Pricing.ServicePricingSettings}
          component={ServicePricingSettings}
        />
        <Redirect
          to={
            currentUser &&
            ["Advisor", "Call Center Rep"].includes(currentUser?.role)
              ? Routes.Pricing.OfferManagement
              : Routes.Pricing.ServicePricingSettings
          }
        />
      </Switch>
    </ContentContainer>
  );
};

export default PricingRoutes;
