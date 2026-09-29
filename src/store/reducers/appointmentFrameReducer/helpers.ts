import { TNewVehicleForRequest, TVehicleForRequest } from './types';

/** Returns a numeric id of an already existing customer, or null for a new one. */
export const getExistingCustomerId = (id: string | number | null | undefined): number | null => {
  if (id === null || id === undefined || id === '') return null;
  const numericId = Number(id);
  return Number.isFinite(numericId) && numericId > 0 ? numericId : null;
};

/** Existing vehicle (has id) -> only id, mileage and engineTypeId are sent. */
export const buildVehicleForRequest = (vehicle: TNewVehicleForRequest): TVehicleForRequest =>
  vehicle.id
    ? { id: vehicle.id, mileage: vehicle.mileage, engineTypeId: vehicle.engineTypeId }
    : vehicle;
