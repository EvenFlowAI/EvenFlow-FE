import React, { useEffect, useState } from 'react';
import { EServiceCategoryType } from '../../store/reducers/categories/types';
import { collectServiceRequestIds, mapRecallsForRequest } from '../../utils/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { TTransportationData } from '../../features/booking/AppointmentFlow/Screens/TransportationNeeds/types';

const useGetTransportationsData = () => {
  const {
    categoriesIds,
    selectedVehicle,
    selectedPackage,
    packagePricingType,
    packageEMenuType,
    selectedRecalls,
    hashKey,
    service,
    subService,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { allCategories } = useSelector((state: RootState) => state.categories);
  const { selectedSR, scProfile, selectedSRComments } = useSelector(
    (state: RootState) => state.appointment
  );
  const [data, setData] = useState<TTransportationData | null>(null);

  useEffect(() => {
    if (selectedVehicle && scProfile) {
      const maintenancePackageOption = selectedPackage
        ? { id: selectedPackage?.id, priceType: packagePricingType }
        : packageEMenuType !== null
          ? { optionType: packageEMenuType }
          : null;

      const serviceCategoryIds = allCategories
        .filter(category => {
          return (
            category.type === EServiceCategoryType.GeneralCategory &&
            categoriesIds.includes(category.id)
          );
        })
        .map(item => item.id);

      const request: TTransportationData = {
        serviceCenterId: scProfile.id,
        serviceRequests: collectServiceRequestIds(
          service,
          subService,
          null,
          selectedSR,
          undefined,
          selectedSRComments
        ),
        serviceCategoryIds,
        recalls: mapRecallsForRequest(selectedRecalls),
        maintenancePackageOption,
        vehicle: {
          vin: selectedVehicle.vin,
          year: selectedVehicle.year,
          make: selectedVehicle.make,
          model: selectedVehicle.model,
          mileage: selectedVehicle.mileage,
          engineTypeId: selectedVehicle.engineTypeId,
        },
      };
      if (hashKey) request.appointmentHashKey = hashKey;
      setData(request);
    }
  }, []);
  return data;
};

export default useGetTransportationsData;
