import { useEffect, useState } from 'react';
import { EServiceCategoryType } from '../../store/reducers/categories/types';
import { getCategories, decodeSCID, mapRecallsForRequest } from '../../utils/utils';
import { collectServiceRequestIds } from '../../utils/collectServiceRequestIds';
import { IConsultantsRequestData } from '../../api/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { useParams } from 'react-router-dom';
import { IFirstScreenOption } from '../../store/reducers/serviceTypes/types';
import { EServiceType } from '../../store/reducers/appointmentFrameReducer/types';

const getServiceCategoryIds = (
  allCategories: RootState['categories']['allCategories'],
  serviceCategories: RootState['appointmentFrame']['serviceCategories']
) =>
  allCategories
    .filter(category => {
      return (
        category.type === EServiceCategoryType.GeneralCategory &&
        serviceCategories.map(item => item.id).includes(category.id)
      );
    })
    .map(item => item.id);

const getMaintenancePackageOption = (
  selectedPackage: RootState['appointmentFrame']['selectedPackage'],
  packagePricingType: RootState['appointmentFrame']['packagePricingType'],
  packageEMenuType: RootState['appointmentFrame']['packageEMenuType']
) => {
  if (selectedPackage) return { id: selectedPackage.id, priceType: packagePricingType };
  if (packageEMenuType !== null) return { optionType: packageEMenuType };

  return null;
};

const isValidForServiceType = (
  serviceTypeOption: IFirstScreenOption | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  address?: any,
  zipCode?: string
) => serviceTypeOption?.type !== EServiceType.PickUpDropOff || (address && zipCode?.length === 5);

const useGetConsultantsData = (
  serviceTypeOption: IFirstScreenOption | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  address?: any,
  zipCode?: string
) => {
  const {
    selectedPackage,
    packagePricingType,
    packageEMenuType,
    selectedRecalls,
    selectedVehicle,
    service,
    subService,
    serviceCategories,
    appointmentByKey,
    transportation,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { selectedSR, selectedSRComments } = useSelector((state: RootState) => state.appointment);
  const { allCategories } = useSelector((state: RootState) => state.categories);
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<IConsultantsRequestData | null>(null);

  useEffect(() => {
    if (!selectedVehicle) return;

    const serviceCategoryIds = getServiceCategoryIds(allCategories, serviceCategories);
    const maintenancePackageOption = getMaintenancePackageOption(
      selectedPackage,
      packagePricingType,
      packageEMenuType
    );
    const recalls = mapRecallsForRequest(selectedRecalls);
    const serviceRequestIds = collectServiceRequestIds(
      service,
      subService,
      null,
      selectedSR,
      undefined,
      selectedSRComments
    );

    const hasRequestSelected =
      serviceRequestIds.length ||
      maintenancePackageOption ||
      serviceCategoryIds.length ||
      recalls.length;

    if (!isValidForServiceType(serviceTypeOption, address, zipCode) || !hasRequestSelected) return;

    const requestData: IConsultantsRequestData = {
      serviceCenterId: decodeSCID(id),
      pageIndex: 0,
      pageSize: 0,
      serviceRequests: serviceRequestIds,
      recalls,
      serviceCategories: getCategories(allCategories, serviceCategories),
      maintenancePackageOption,
      serviceTypeOptionId: serviceTypeOption?.id ?? null,
      searchTerm: '',
      vehicle: {
        vin: selectedVehicle.vin,
        year: selectedVehicle.year,
        make: selectedVehicle.make,
        model: selectedVehicle.model,
        mileage: selectedVehicle.mileage,
        engineTypeId: selectedVehicle.engineTypeId,
      },
      address: typeof address === 'string' ? address : (address?.label ?? ''),
      zipCode,
      transportationOptionId:
        serviceTypeOption?.transportationOption?.id ?? transportation?.id ?? null,
    };

    if (appointmentByKey?.hashKey) {
      requestData.appointmentHashKey = appointmentByKey.hashKey;
    }

    setData(requestData);
  }, [serviceTypeOption, address, zipCode]);

  return data;
};

export default useGetConsultantsData;
