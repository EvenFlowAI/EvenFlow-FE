import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { EServiceType } from '../../store/reducers/appointmentFrameReducer/types';

const useTransportationVisibility = () => {
  const { serviceTypeOption, transportation, transportations } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);

  const someServicesHaveDefaultTransportation = useMemo(() => {
    const someOptionHasDefaultTransportation = firstScreenOptions.some(
      el => el.transportationOption
    );
    const someOptionHasNotDefaultTransportation = firstScreenOptions.some(
      el => !el.transportationOption
    );
    return someOptionHasDefaultTransportation && someOptionHasNotDefaultTransportation;
  }, [firstScreenOptions]);

  const noOneServiceHasTransportation =
    firstScreenOptions.filter(el => !el.transportationOption).length === firstScreenOptions.length;

  const isTransportationsVisible = useMemo(() => {
    const transportationExists = transportations.find(
      el => el.id === transportation?.id || el.id === serviceTypeOption?.transportationOption?.id
    );
    const isDefaultTransportationOfTheUniqueServiceOption =
      firstScreenOptions.length === 1 && serviceTypeOption?.transportationOption;

    return (
      ((someServicesHaveDefaultTransportation &&
        (serviceTypeOption?.transportationOption || isTransportationAvailable)) ||
        (noOneServiceHasTransportation && isTransportationAvailable)) &&
      serviceTypeOption?.type !== EServiceType.MobileService &&
      transportationExists &&
      (transportation || serviceTypeOption?.transportationOption) &&
      !isDefaultTransportationOfTheUniqueServiceOption
    );
  }, [
    someServicesHaveDefaultTransportation,
    serviceTypeOption,
    isTransportationAvailable,
    noOneServiceHasTransportation,
    transportations,
    transportation,
  ]);

  return { isTransportationsVisible };
};

export default useTransportationVisibility;
