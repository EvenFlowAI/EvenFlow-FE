import React, {useMemo} from 'react';
import {AppointmentConfirmationTitle} from "../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {
    setCurrentFrameScreen,
    setEditingPosition,
    setServiceOptionChanged
} from "../../../../../../store/reducers/appointmentFrameReducer/actions";
import {Edit} from "@mui/icons-material";
import {List, TitleWrapper} from "./styles";
import {getMaintenanceDescription} from "../../../../../../utils/utils";
import {ConfirmationItemWrapper} from "../../../../../../components/styled/ConfirmationItemWrapper";

const ServiceRequestsManaging = () => {
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
        dispatch(setServiceOptionChanged(false))
        dispatch(setEditingPosition('serviceRequests'));
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
        ? <ConfirmationItemWrapper>
            <TitleWrapper>
                <AppointmentConfirmationTitle>{t("Service Requests")}</AppointmentConfirmationTitle>
                <Edit htmlColor="#142EA1" fontSize="small" style={{cursor: "pointer"}} onClick={handleEditServiceRequests}/>
            </TitleWrapper>
            <List>
                {servicesList.map(item => (
                    <li className="service-item" key={item}>{item}</li>
                ))}
            </List>
        </ConfirmationItemWrapper>
        : null;
};

export default ServiceRequestsManaging;