import React, {useMemo} from 'react';
import {ConfirmationTitle} from "../../AppointmentFrame/Title";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {List, TitleWrapper} from "./styles";

const ServiceRequests = () => {
    const {appointment, serviceValetAppointment} = useSelector((state: RootState) => state.appointment);
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const currentAppointment = useMemo(() => {
        return serviceTypeOption?.type === EServiceType.PickUpDropOff ? serviceValetAppointment : appointment
    }, [serviceTypeOption, serviceValetAppointment, appointment])

    return currentAppointment?.serviceRequestPrices?.length
        ? <div>
            <TitleWrapper>
                <ConfirmationTitle>{t("Service Requests")}</ConfirmationTitle>
            </TitleWrapper>
            <List>
                {
                    serviceTypeOption?.type === EServiceType.PickUpDropOff
                        ? serviceValetAppointment?.serviceRequestPrices?.map(item => (
                            <li className="service-item" key={item.requestName}>
                                {item.requestName.includes("Going") ? t("My Description of Needs") : item.requestName}
                            </li>
                        ))
                        : appointment?.serviceRequestPrices?.map(item => (
                            <li className="service-item" key={item.requestName}>
                                {item.requestName.includes("Going") ? t("My Description of Needs") : item.requestName}
                            </li>
                        ))
                }
            </List>
        </div>
        : null;
};

export default ServiceRequests;