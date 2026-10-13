import { IRecall, TIdName } from '../../../store/reducers/recall/types';

export type TRecallVehicleLine = {
  key: string;
  make: TIdName | null;
  model: TIdName | null;
  yearFrom: number | null;
  yearTo: number | null;
};

export type TRecallModelYears = {
  key: string;
  name: string;
  years: number[];
};

/**
 * Builds one line per unique make + model inside every recall group
 * (ordered by groupIndex / itemIndex) with min-max year range.
 */
export const getRecallVehicleLines = (recall: IRecall): TRecallVehicleLine[] => {
  const groups = [...(recall.groups ?? [])].sort((a, b) => a.groupIndex - b.groupIndex);

  return groups.flatMap(group => {
    const items = [...(group.items ?? [])].sort((a, b) => a.itemIndex - b.itemIndex);
    const lines = new Map<string, TRecallVehicleLine>();

    items.forEach(item => {
      const key = `${group.id}-${item.make?.id ?? 'none'}-${item.model?.id ?? 'none'}`;
      const existing = lines.get(key);

      if (!existing) {
        lines.set(key, {
          key,
          make: item.make,
          model: item.model,
          yearFrom: item.year,
          yearTo: item.year,
        });
        return;
      }

      if (item.year !== null && item.year !== undefined) {
        existing.yearFrom =
          existing.yearFrom === null ? item.year : Math.min(existing.yearFrom, item.year);
        existing.yearTo =
          existing.yearTo === null ? item.year : Math.max(existing.yearTo, item.year);
      }
    });

    return Array.from(lines.values());
  });
};

export const formatYearRange = (yearFrom: number | null, yearTo: number | null): string => {
  if (yearFrom === null && yearTo === null) return '-';
  if (yearFrom === null || yearTo === null || yearFrom === yearTo) {
    return String(yearFrom ?? yearTo);
  }
  return `${yearFrom}-${yearTo}`;
};

const getSortedItems = (recall: IRecall) =>
  [...(recall.groups ?? [])]
    .sort((a, b) => a.groupIndex - b.groupIndex)
    .flatMap(group => [...(group.items ?? [])].sort((a, b) => a.itemIndex - b.itemIndex));

export const getRecallMakes = (recall: IRecall): string[] =>
  Array.from(
    new Set(
      getSortedItems(recall)
        .map(item => item.make?.name)
        .filter((name): name is string => Boolean(name))
    )
  );

export const getRecallModelsWithYears = (recall: IRecall): TRecallModelYears[] => {
  const models = new Map<string, TRecallModelYears>();

  getSortedItems(recall).forEach(item => {
    if (!item.model) return;
    const key = `${item.make?.id ?? 'none'}-${item.model.id}`;
    const existing = models.get(key) ?? { key, name: item.model.name, years: [] };
    if (item.year !== null && item.year !== undefined && !existing.years.includes(item.year)) {
      existing.years.push(item.year);
    }
    models.set(key, existing);
  });

  return Array.from(models.values());
};
/**
 * Total DMS vehicles for a recall: sum of group-level counts,
 * falling back to the sum of item-level counts when the group value is absent.
 */
export const getRecallDmsVehicles = (recall: IRecall): number | null => {
  const groups = recall.groups ?? [];
  if (!groups.length) return null;
  return groups.reduce((total, group) => {
    if (typeof group.numberOfVehiclesInDms === 'number') {
      return total + group.numberOfVehiclesInDms;
    }
    return (
      total + (group.items ?? []).reduce((sum, item) => sum + (item.numberOfVehiclesInDms ?? 0), 0)
    );
  }, 0);
};
