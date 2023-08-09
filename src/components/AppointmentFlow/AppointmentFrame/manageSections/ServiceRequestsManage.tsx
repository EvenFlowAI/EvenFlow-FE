import React, {useMemo} from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {setCurrentFrameScreen} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {Edit} from "@material-ui/icons";
import {getMaintenanceDescription} from "../uiUtils";

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
    const {
        selectedRecalls,
        packagePriceTitles,
        selectedPackage,
        packagePricingType,
        packageEMenuType,
        valueService,
        categoriesIds
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {allCategories} = useSelector((state: RootState) => state.categories);
    const { serviceRequests: srList, selectedSR, scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const handleEditServiceRequests = () => {
        dispatch(setCurrentFrameScreen("serviceNeeds"));
    }

    const servicesList = useMemo(() => {
            return getMaintenanceDescription(
                srList,
                selectedRecalls,
                packagePriceTitles,
                selectedSR,
                selectedPackage,
                allCategories,
                categoriesIds,
                valueService,
                packagePricingType,
                packageEMenuType,
                scProfile?.maintenancePackageOptionTypes
            )
        },
        [srList, selectedSR, selectedRecalls, selectedPackage, allCategories, packagePriceTitles, categoriesIds,
            valueService, packagePricingType, packageEMenuType, scProfile])

    return servicesList?.length
        ? <div>
            <TitleWrapper>
                <ConfirmationTitle>{t("Service Requests")}</ConfirmationTitle>
                <Edit fontSize="small" style={{cursor: "pointer"}} onClick={handleEditServiceRequests}/>
            </TitleWrapper>
            <List>
                {servicesList.map(item => (
                    <li className="service-item" key={item}>{item}</li>
                ))}
            </List>
        </div>
        : null;
};

export default ServiceRequestsManage;