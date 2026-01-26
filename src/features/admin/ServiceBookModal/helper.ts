import { IMake, IModel } from '../../../api/types';
import { IPodVehicleModel } from '../../../store/reducers/pods/types';
import { TOption } from './types';

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
