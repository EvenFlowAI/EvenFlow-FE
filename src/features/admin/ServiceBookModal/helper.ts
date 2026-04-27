import { IMake, IModel } from '../../../api/types';
import { IPodVehicleModel } from '../../../store/reducers/pods/types';
import { ServiceBookState, TForm, TOption } from './types';

export function mapJobTypeOption(
  options: TOption[],
  jobTypeValue: string | number | undefined
): TOption | null {
  if (typeof jobTypeValue === 'undefined') return null;
  return options.find(opt => opt.value === jobTypeValue) ?? null;
}

export function mapAppointmentTypeOption(
  options: TOption[],
  appointmentTypeValue: string | number | undefined
): TOption | null {
  if (typeof appointmentTypeValue === 'undefined') return null;
  return options.find(opt => opt.value === appointmentTypeValue) ?? null;
}

export function mapSelectedItems<T extends { id: number }>(
  items: T[],
  selected?: { id: number }[]
): T[] {
  if (!selected) return [];
  return items.filter(item => selected.find(sel => sel.id === item.id));
}

export function getFilteredMakes(makes: IMake[], vehicleMakes?: { id: number }[]) {
  if (!vehicleMakes) return [];
  return makes.filter(make => vehicleMakes.find(vm => vm.id === make.id));
}

export function getModelsFromMakes(makes: IMake[], vehicleMakes?: { id: number }[]) {
  if (!vehicleMakes) return [];
  return makes
    .filter(make => vehicleMakes.find(vm => vm.id === make.id))
    .map(make => make.models)
    .flat();
}

export function getSelectedModels(modelsOptions: IModel[], vehicleModels?: IPodVehicleModel[]) {
  if (!vehicleModels?.length) return [];
  const modelsIDs = modelsOptions.map(m => m.id);
  const filteredModels = vehicleModels.filter(vm => modelsIDs.includes(vm.id));
  return filteredModels.map(item => {
    const sourceModel = modelsOptions.find(m => m.id === item.id)!;
    return {
      id: item.id,
      name: item.name,
      globalId: sourceModel.globalId,
      isReadOnly: sourceModel.isReadOnly,
      orderIndex: sourceModel.orderIndex,
      code: sourceModel.code,
    };
  });
}

export const validateName = (form: TForm, showError: (error: string) => void): boolean => {
  if (!form.name.length) {
    showError('"Name" must not be empty');
    return false;
  }
  return true;
};

export const validateTechnicians = (form: TForm, showError: (error: string) => void): boolean => {
  if (!form.technicians.length) {
    showError('"Technicians" must not be empty');
    return false;
  }
  return true;
};

export const validateMileage = (
  state: ServiceBookState,
  showError: (error: string) => void
): boolean => {
  let valid = true;

  if (state.mileageFrom) {
    if (!Number.isInteger(+state.mileageFrom)) {
      showError('"Mileage From" must be a whole number');
      valid = false;
    }
    if (+state.mileageFrom <= 0) {
      showError('"Mileage From" must be a positive number');
      valid = false;
    }
  }

  if (state.mileageTo) {
    if (!Number.isInteger(+state.mileageTo)) {
      showError('"Mileage To" must be a whole number');
      valid = false;
    }
    if (+state.mileageTo <= 0) {
      showError('"Mileage To" must be a positive number');
      valid = false;
    }
  }

  if (state.mileageTo && state.mileageFrom && +state.mileageTo < +state.mileageFrom) {
    showError('"Mileage To" must be more than the "Mileage From"');
    valid = false;
  }

  return valid;
};

export const validateZones = (
  state: ServiceBookState,
  form: TForm,
  showError: (error: string) => void
): boolean => {
  let valid = true;

  if (state.mobileZones.length && state.selectedServiceValetZones.length) {
    showError('"Mobile Zone" and "Service Valet Zone" cannot be selected at the same time');
    valid = false;
  }

  if (state.mobileZones.length && !state.selectedServiceValetZones.length) {
    showError('Visit Center option can not be selected as Mobile Service zones were added');
    valid = false;
  }

  return valid;
};

export const hasMobileZones = (state: ServiceBookState): boolean => !!state.mobileZones.length;
export const hasServiceValetZones = (state: ServiceBookState): boolean =>
  !!state.selectedServiceValetZones.length;
