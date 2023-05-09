import React, {useMemo} from 'react';
import {getMaintenanceDescription} from "../uiUtils";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

const ServicesList = () => {
    const {
        selectedPackage,
        packagePricingType,
        packagePriceTitles,
        categoriesIds,
        valueService,
        selectedRecalls,
        packageEMenuType,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {serviceRequests, selectedSR, scProfile} = useSelector((state: RootState) => state.appointment);
    const { allCategories } = useSelector((state: RootState) => state.categories);

    const selectedServices = useMemo(() => getMaintenanceDescription(serviceRequests, selectedRecalls, packagePriceTitles, selectedSR, 
            selectedPackage, allCategories, categoriesIds, valueService, packagePricingType, packageEMenuType, scProfile?.maintenancePackageOptionTypes),
        [serviceRequests, selectedSR, selectedRecalls, selectedPackage, packagePriceTitles, 
            allCategories, categoriesIds, valueService, packagePricingType, packageEMenuType, scProfile])

    return (
        <div className="service-list">
            {selectedServices.map(item => <div key={item}>{item}</div>)}
        </div>
    );
};

export default ServicesList;