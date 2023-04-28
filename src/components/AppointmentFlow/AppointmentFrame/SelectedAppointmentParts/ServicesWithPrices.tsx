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
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {serviceRequests, selectedSR} = useSelector((state: RootState) => state.appointment);
    const { allCategories } = useSelector((state: RootState) => state.categories);

    const selectedServices = useMemo(() => getMaintenanceDescription(serviceRequests, selectedRecalls, packagePriceTitles, selectedSR, selectedPackage, allCategories, categoriesIds, valueService, packagePricingType),
        [serviceRequests, selectedSR, selectedPackage, allCategories, categoriesIds, valueService, packagePricingType])

    return (
        <div className="service-list">
            {selectedServices.map(item => <div key={item}>{item}</div>)}
        </div>
    );
};

export default ServicesList;