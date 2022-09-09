import React from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";

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
    const {appointment} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();

    return appointment?.serviceRequestPrices?.length
        ? <div>
            <TitleWrapper>
                <ConfirmationTitle>{t("Service Requests")}</ConfirmationTitle>
            </TitleWrapper>
            <List>
                {appointment?.serviceRequestPrices.map(item => (
                    <li className="service-item" key={item.requestName}>
                        {item.requestName.includes("Going") ? t("My Description of Needs") : item.requestName}
                    </li>
                ))}
            </List>
        </div>
        : null;
};

export default ServiceRequests;