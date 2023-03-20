import React, {useMemo} from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";

const TitleWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: '8px 0',
})

const List = styled('ul')({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: "12px",
    margin: "12px 0 0",
    padding: 0,
    listStyle: "none",
    "& .service-item": {
        textTransform: "capitalize"
    }
});

const ServiceRequests = () => {
    const {appointment, serviceValetAppointment} = useSelector((state: RootState) => state.appointment);
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const currentAppointment = useMemo(() => {
        return serviceTypeOption?.type === EServiceType.PikUpDropOff ? serviceValetAppointment : appointment
    }, [serviceTypeOption, serviceValetAppointment, appointment])

    return currentAppointment?.serviceRequestPrices?.length
        ? <div>
            <TitleWrapper>
                <ConfirmationTitle>{t("Service Requests")}</ConfirmationTitle>
            </TitleWrapper>
            <List>
                {
                    serviceTypeOption?.type === EServiceType.PikUpDropOff
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