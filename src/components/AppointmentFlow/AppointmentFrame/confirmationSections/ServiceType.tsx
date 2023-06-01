import React, {useMemo} from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";

const TitleWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: '8px 0',
});

const ServiceType = () => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    const getServiceName = (serviceTypeOption: IFirstScreenOption|null, serviceType: EServiceType) => {
        if (serviceTypeOption?.note) return serviceTypeOption.note;
        if (serviceTypeOption?.name) return serviceTypeOption.name;
        switch (serviceType) {
            case EServiceType.MobileService:
                return t("Mobile Service");
            case EServiceType.PickUpDropOff:
                return t("Pick Up / Drop Off");
            default:
                return t("Visit Center");
        }
    }
    return <div>
        <TitleWrapper>
            <ConfirmationTitle>{serviceTypeOption?.note || serviceTypeOption?.name ? t("Service Option") : t("Location Of Service")}</ConfirmationTitle>
        </TitleWrapper>
        {getServiceName(serviceTypeOption, serviceType)}
    </div>
};

export default ServiceType;