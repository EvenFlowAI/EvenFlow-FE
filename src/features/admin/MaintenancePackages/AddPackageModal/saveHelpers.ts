import { ECustomerCriteria, IPackageByQuery } from '../../../../api/types';
import {
  INewPackage,
  IUpdatedPackage,
  TAssignedRequest,
} from '../../../../store/reducers/packages/types';
import {
  IAssignedServiceRequest,
  IUpsellServiceRequest,
} from '../../../../store/reducers/serviceRequests/types';
import { IEngineType } from '../../../../store/reducers/vehicleDetails/types';
import { IVehiclesData } from './types';

type TValidateBusinessRulesArgs = {
  vehiclesData: IVehiclesData;
  selectedModels: number[];
  selectedMakes: number[];
  selectedMileages: string[];
  selectedEngineTypes: IEngineType[];
  showError: (message: string) => void;
};

type TBuildPackagePayloadArgs = {
  packageName: string;
  serviceCenterId: number;
  serviceRequests: number[];
  complimentary: number[];
  assignedOpsCodes: TAssignedRequest[];
  isApplyBusinessRules: boolean;
  selectedEngineTypes: IEngineType[];
  upsellCodes: IUpsellServiceRequest[];
  selectedMakes: number[];
  selectedModels: number[];
  vehiclesData: IVehiclesData;
  selectedMileages: string[];
  isEditing?: boolean;
  currentBusinessRules?: IUpdatedPackage['businessRules'];
};

export const getRequestsFromSelectedPackages = (
  ids: number[],
  opsCodes: IAssignedServiceRequest[],
  packages: IPackageByQuery[]
): number[] => {
  let serviceRequests = opsCodes.map(item => item.id);

  ids.forEach(id => {
    const packData = packages.find(item => item.id === id);
    if (packData?.serviceRequests) {
      serviceRequests = serviceRequests.concat(packData.serviceRequests.map(request => request.id));
    }
  });

  return Array.from(new Set(serviceRequests));
};

export const validateBusinessRules = ({
  vehiclesData,
  selectedModels,
  selectedMakes,
  selectedMileages,
  selectedEngineTypes,
  showError,
}: TValidateBusinessRulesArgs): boolean => {
  const { yearFrom, yearTo } = vehiclesData;
  if (yearFrom && yearTo && +yearFrom > +yearTo) {
    showError('"From" must be less than or equal to "To"');
    return false;
  }

  const hasAtLeastOneRule =
    selectedModels.length ||
    selectedMakes.length ||
    selectedMileages.length ||
    yearFrom ||
    yearTo ||
    selectedEngineTypes.length;

  if (!hasAtLeastOneRule) {
    showError('At least one Business Rule is required');
  }

  return Boolean(hasAtLeastOneRule);
};

export const buildPackagePayload = ({
  packageName,
  serviceCenterId,
  serviceRequests,
  complimentary,
  assignedOpsCodes,
  isApplyBusinessRules,
  selectedEngineTypes,
  upsellCodes,
  selectedMakes,
  selectedModels,
  vehiclesData,
  selectedMileages,
  isEditing,
  currentBusinessRules,
}: TBuildPackagePayloadArgs): INewPackage | IUpdatedPackage => {
  const data: INewPackage | IUpdatedPackage = {
    name: packageName,
    serviceRequests,
    complimentaryServices: complimentary,
    serviceRequestsAssigned: assignedOpsCodes,
    serviceCenterId,
    isApplyBusinessRules,
    engineTypes: selectedEngineTypes.map(item => item.id),
    intervalUpsells: upsellCodes.map(item => item.id),
  };

  if (isApplyBusinessRules) {
    data.businessRules = {
      vehicleMakes: selectedMakes,
      vehicleModels: selectedModels,
      vehicleYearRange: {
        from: +vehiclesData.yearFrom,
        to: +vehiclesData.yearTo,
      },
      vehicleMileageValues: selectedMileages,
      customerCriteria: vehiclesData.customerCriteria || ECustomerCriteria.Any,
      engineTypeIds: [],
    };
  } else if (isEditing) {
    data.businessRules = currentBusinessRules;
  }

  return data;
};
