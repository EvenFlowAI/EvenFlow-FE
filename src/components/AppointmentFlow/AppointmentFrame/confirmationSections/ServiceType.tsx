import React from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";

const TitleWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: '8px 0',
});

const ServiceType = () => {
    const {serviceType, isMobileServiceOn, isPickUpDropOffServiceOn} = useSelector((state: RootState) => state.appointmentFrame);
    const getServiceName = () => {
        switch (serviceType) {
            case EServiceType.MobileService:
                return "Mobile Service";
            case EServiceType.PikUpDropOff:
                return "Pick Up / Drop Off";
            default:
                return "Visit Center";
        }
    }
    return isMobileServiceOn || isPickUpDropOffServiceOn
        ? <div>
            <TitleWrapper>
                <ConfirmationTitle>Location Of Service</ConfirmationTitle>
            </TitleWrapper>
            {getServiceName()}
        </div>
        : null;
};

export default ServiceType;