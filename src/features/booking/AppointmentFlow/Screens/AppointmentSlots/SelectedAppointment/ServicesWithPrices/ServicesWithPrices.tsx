import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import { getMaintenanceDescription } from '../../../../../../../utils/getMaintenanceDescription';

const ServicesList = () => {
  const {
    selectedPackage,
    packagePricingType,
    packagePriceTitles,
    serviceCategories,
    valueService,
    selectedRecalls,
    packageEMenuType,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { serviceRequests, selectedSR, scProfile } = useSelector(
    (state: RootState) => state.appointment
  );
  const { allCategories } = useSelector((state: RootState) => state.categories);

  const selectedServices = useMemo(
    () =>
      getMaintenanceDescription(
        serviceRequests,
        selectedRecalls,
        packagePriceTitles,
        selectedSR,
        selectedPackage,
        allCategories,
        serviceCategories,
        valueService,
        packagePricingType,
        packageEMenuType,
        scProfile?.maintenancePackageOptionTypes
      ),
    [
      serviceRequests,
      selectedSR,
      selectedRecalls,
      selectedPackage,
      packagePriceTitles,
      allCategories,
      serviceCategories,
      valueService,
      packagePricingType,
      packageEMenuType,
      scProfile,
    ]
  );

  return (
    <div className="service-list">
      {selectedServices.map(item => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

export default ServicesList;
