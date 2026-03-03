import { IUserAccount } from './types';

export function convertUserAccountToEditedItem(el: IUserAccount) {
  return {
    id: el.id,
    status: el.status,
    emailConfirmed: el.emailConfirmed,
    avatarPath: el.avatarPath,
    firstName: el.firstName,
    email: el.email,
    role: el.role,
    lastName: el.lastName,
    dealerships: el.dealerships.map(d => ({
      name: d.name,
      value: d.id,
    })),
    serviceCenters: el.dealerships.flatMap(d =>
      d.serviceCenters.map(sc => ({
        name: sc.name,
        value: sc.id,
        categoryName: d.name,
        categoryId: d.id,
        dmsId: sc.dmsId ?? null,
        position: sc.position ?? '',
        displayOnBookingTypes: sc.displayOnBookingTypes,
        type: sc.type ?? null,
        hourlyRate: sc.details?.hourlyRate,
        overtimeRate: sc.details?.overtimeRate,
        technicianLevel: sc.details?.skillLevel,
      }))
    ),
  };
}
