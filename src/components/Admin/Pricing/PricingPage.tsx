import React from "react";
import {ContentContainer} from "../../Content/ContentContainer/ContentContainer";
import {Redirect, Switch} from "react-router-dom";
import {PrivateRoute} from "../../../utils/Routes";
import {Routes} from "../../../config/routes";
import {PricingSettingsPage} from "../../Optimizer/PricingSettings/PricingSettingsPage";
import MobileServicePage from "../../Optimizer/MobileService/MobileServicePage";
import ServiceValetPage from "../../Optimizer/ServiceValet/ServiceValetPage";
import {OfferManagementPage} from "../../OfferManagement/OfferManagementPage";

const PricingPage = () => {
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Pricing.MobileService} component={MobileServicePage} />
            <PrivateRoute path={Routes.Pricing.ServiceValet} component={ServiceValetPage} />
            <PrivateRoute path={Routes.Pricing.OfferManagement} component={OfferManagementPage} />
            <PrivateRoute path={Routes.Pricing.ServicePricingSettings} component={PricingSettingsPage} />
            <Redirect to={Routes.Pricing.ServicePricingSettings} />
        </Switch>
    </ContentContainer>
}

export default PricingPage;