import React from "react";
import {ContentContainer} from "../../../components/UI/ContentContainer";
import {Redirect, Switch} from "react-router-dom";
import {PrivateRoute} from "../../../utils/Routes";
import {Routes} from "../../../config/routes";
import {PricingSettingsPage} from "../PricingSettings/PricingSettingsPage";
import PricingMobileService from "../PricingMobileService/PricingMobileService";
import PricingServiceValet from "../PricingServiceValet/PricingServiceValet";
import {OfferManagementPage} from "../OfferManagement/OfferManagementPage";
import {useCurrentUser} from "../../../utils/hooks";

const PricingPage = () => {
    const currentUser = useCurrentUser();
    return <ContentContainer>
        <Switch>
            <PrivateRoute path={Routes.Pricing.MobileService} component={PricingMobileService} />
            <PrivateRoute path={Routes.Pricing.ServiceValet} component={PricingServiceValet} />
            <PrivateRoute path={Routes.Pricing.OfferManagement} component={OfferManagementPage} />
            <PrivateRoute path={Routes.Pricing.ServicePricingSettings} component={PricingSettingsPage} />
            <Redirect
                to={currentUser && ["Advisor", "Call Center Rep"].includes(currentUser?.role)
                ? Routes.Pricing.OfferManagement
                    : Routes.Pricing.ServicePricingSettings}
            />
        </Switch>
    </ContentContainer>
}

export default PricingPage;