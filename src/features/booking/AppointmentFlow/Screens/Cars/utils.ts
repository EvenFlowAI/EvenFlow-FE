import { ILoadedVehicle } from "../../../../../api/types";

export const checkSelectedCar = (
  vehicle: ILoadedVehicle | null,
  vehicles?: ILoadedVehicle[],
): boolean => {
  if (!vehicles || !vehicle) {
    return false;
  }
  return Boolean(
    vehicles.find((v) => {
      if (vehicle.vin && v.vin) {
        return vehicle?.mileage && vehicle.vin === v.vin;
      }
      return (
        vehicle?.mileage &&
        vehicle.year === v.year &&
        vehicle.make === v.make &&
        vehicle.model === v.model
      );
    }),
  );
};
