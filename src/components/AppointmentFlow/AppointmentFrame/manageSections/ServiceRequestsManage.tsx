import React, {useMemo} from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {setCurrentFrameScreen} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {Edit} from "@material-ui/icons";

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

const ServiceRequestsManage = () => {
    const {appointmentByKey} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const handleEditServiceRequests = () => {
        dispatch(setCurrentFrameScreen("serviceNeeds"));
    }

    return appointmentByKey?.serviceRequests?.length
        ? <div>
            <TitleWrapper>
                <ConfirmationTitle>{t("Service Requests")}</ConfirmationTitle>
                <Edit fontSize="small" style={{cursor: "pointer"}} onClick={handleEditServiceRequests}/>
            </TitleWrapper>
            <List>
                {appointmentByKey.serviceRequests.map(item => (
                    <li className="service-item" key={item.description}>
                        {item.description.includes("Going") ? t("My Description of Needs") : item.description}
                    </li>
                ))}
            </List>
        </div>
        : null;
};

export default ServiceRequestsManage;