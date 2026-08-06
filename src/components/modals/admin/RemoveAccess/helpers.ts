import { TUserAccountForm } from '../AddUserAccount/types';
import { IUserAccount } from '../../../../pages/admin/RoleManagement/types';
import { Roles, TOptionForUserAccountServiceCenters } from '../../../../types/types';

export interface IGroupedDealership {
  dealership: TUserAccountForm['dealerships'][number];
  serviceCenters: TOptionForUserAccountServiceCenters[];
}

export const getGroupedDealerships = (
  payload: TUserAccountForm | null,
  searchTerm: string
): IGroupedDealership[] => {
  if (!payload) return [];

  const term = searchTerm.trim().toLowerCase();

  return payload.dealerships
    .map(dealership => {
      const serviceCenters = payload.serviceCenters.filter(
        sc => sc.categoryId === dealership.value
      );

      if (!term) {
        return { dealership, serviceCenters };
      }

      const dealershipMatches = dealership.name.toLowerCase().includes(term);
      const filteredServiceCenters = dealershipMatches
        ? serviceCenters
        : serviceCenters.filter(sc => sc.name.toLowerCase().includes(term));

      return {
        dealership,
        serviceCenters: filteredServiceCenters,
      };
    })
    .filter(group => group.serviceCenters.length > 0);
};

const mapServiceCenterForUserUpdate = (
  serviceCenter: TOptionForUserAccountServiceCenters,
  role: TUserAccountForm['role']
): IUserAccount['dealerships'][number]['serviceCenters'][number] => {
  const isTechnician = role === Roles.Technician;
  const hasDetails =
    Boolean(serviceCenter.hourlyRate) || Boolean(serviceCenter.overtimeRate) || isTechnician;

  return {
    id: serviceCenter.value,
    name: serviceCenter.name,
    dmsId: serviceCenter.dmsId ?? undefined,
    type: serviceCenter.type ?? undefined,
    displayOnBookingTypes: serviceCenter.displayOnBookingTypes,
    ...(hasDetails && {
      details: {
        ...(serviceCenter.hourlyRate && { hourlyRate: serviceCenter.hourlyRate }),
        ...(serviceCenter.overtimeRate && { overtimeRate: serviceCenter.overtimeRate }),
        ...(isTechnician && {
          skillLevel: serviceCenter.technicianLevel || 1,
        }),
      },
    }),
  };
};

export const buildUpdatedUserAfterRemovingAccess = (
  payload: TUserAccountForm & { id: string },
  selectedServiceCenterIds: number[]
): IUserAccount => {
  const selectedIds = new Set(selectedServiceCenterIds);
  const remainingServiceCenters = payload.serviceCenters.filter(sc => !selectedIds.has(sc.value));

  const dealerships = payload.dealerships
    .map(dealership => {
      const serviceCenters = remainingServiceCenters
        .filter(sc => sc.categoryId === dealership.value)
        .map(serviceCenter => mapServiceCenterForUserUpdate(serviceCenter, payload.role));

      return {
        id: dealership.value,
        name: dealership.name,
        hasFullAccess: null,
        serviceCenters,
      };
    })
    .filter(dealership =>
      payload.role === Roles.ServiceDirector ||
      payload.role === Roles.BDCAgent ||
      payload.role === Roles.BDCManager
        ? true
        : dealership.serviceCenters.length > 0
    );

  return {
    id: payload.id,
    status: payload.status || 0,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    fullName: `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim(),
    userName: payload.email.trim(),
    email: payload.email.trim(),
    role: payload.role || Roles.EvenFlowAdmin,
    avatarPath: payload.avatarPath ?? '',
    emailConfirmed: payload.emailConfirmed || false,
    dealerships,
  };
};
