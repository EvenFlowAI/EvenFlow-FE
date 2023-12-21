import React, {useMemo} from 'react';
import {AppointmentConfirmationTitle} from "../../../../../components/AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {List, TitleWrapper} from "./styles";

const Address = () => {
    const {address, zipCode, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    return address && (serviceType === EServiceType.MobileService || serviceType === EServiceType.PickUpDropOff)
        ? <div>
            <TitleWrapper>
                <AppointmentConfirmationTitle>
                    {serviceType === EServiceType.MobileService ? t("Service Address") : t("Pick Up Address")}
                </AppointmentConfirmationTitle>
            </TitleWrapper>
            <List>
                <li className="service-item">
                    <div>{typeof address === 'string' ? address : address?.label || ""}</div>
                    <div>{t("ZIP")}: {zipCode}</div>
                </li>
            </List>
        </div>
        : null;
};

export default Address;