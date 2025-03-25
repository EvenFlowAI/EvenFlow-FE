import { useEffect, useState } from 'react';
import { collectServiceRequestIds, getCategories, mapRecallsForRequest } from '../../utils/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { TTransportationData } from '../../features/booking/AppointmentFlow/Screens/TransportationNeeds/types';

const useGetTransportationsData = () => {
  const {
    serviceCategories,
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
        serviceCategories: getCategories(allCategories, serviceCategories),
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
