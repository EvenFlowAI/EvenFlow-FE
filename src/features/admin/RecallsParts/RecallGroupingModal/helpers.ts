import {
  IRecall,
  IRecallGroupingRequest,
  IRecallPartGroupItem,
} from '../../../../store/reducers/recall/types';
import { ERegroupMode, TGroupingGroup, TSplitOptions } from './types';

let keyCounter = 0;
export const createGroupKey = (): string => {
  keyCounter += 1;
  return `group-${Date.now()}-${keyCounter}`;
};

export const getItemDraggableId = (item: IRecallPartGroupItem): string => `item-${item.id}`;

const sortItems = (items: IRecallPartGroupItem[]) =>
  [...(items ?? [])].sort((a, b) => a.itemIndex - b.itemIndex);

export const mapRecallToGroups = (recall: IRecall): TGroupingGroup[] =>
  [...(recall.groups ?? [])]
    .sort((a, b) => a.groupIndex - b.groupIndex)
    .map(group => ({
      key: `group-${group.id}`,
      groupId: group.id,
      recallComponent: group.recallComponent ?? recall.recallComponent ?? '',
      serviceRequest: group.serviceRequest ?? recall.serviceRequest ?? null,
      items: sortItems(group.items),
    }));

export const createEmptyGroup = (source?: TGroupingGroup): TGroupingGroup => ({
  key: createGroupKey(),
  recallComponent: source?.recallComponent ?? '',
  serviceRequest: source?.serviceRequest ?? null,
  items: [],
});

const getSplitKey = (item: IRecallPartGroupItem, { byModel, byYear }: TSplitOptions): string => {
  const parts: string[] = [];
  if (byModel) parts.push(`${item.make?.id ?? 'none'}|${item.model?.id ?? 'none'}`);
  if (byYear) parts.push(String(item.year ?? ''));
  return parts.join('#');
};

type TItemComparator = (a: IRecallPartGroupItem, b: IRecallPartGroupItem) => number;

const compareMakeModel: TItemComparator = (a, b) =>
  (a.make?.name ?? '').localeCompare(b.make?.name ?? '') ||
  (a.model?.name ?? '').localeCompare(b.model?.name ?? '');

const compareYear: TItemComparator = (a, b) => (a.year ?? 0) - (b.year ?? 0);

const compareSplitKeys = (a: IRecallPartGroupItem, b: IRecallPartGroupItem, o: TSplitOptions) =>
  (o.byModel ? compareMakeModel(a, b) : 0) ||
  (o.byYear ? compareYear(a, b) : 0) ||
  // tiebreaker: keep records inside a group ordered by make, model, year
  compareMakeModel(a, b) ||
  compareYear(a, b);

/**
 * Splits ALL records (across every group) into groups by model and/or year.
 * Each resulting group inherits settings from the group that held its first record,
 * and reuses that group's backend id / key if it has not been taken yet.
 */
export const splitGroups = (groups: TGroupingGroup[], options: TSplitOptions): TGroupingGroup[] => {
  if (!options.byModel && !options.byYear) return groups;

  const sourceByItemId = new Map<number, TGroupingGroup>();
  groups.forEach(group => group.items.forEach(item => sourceByItemId.set(item.id, group)));

  const allItems = groups.flatMap(group => group.items);
  if (!allItems.length) return groups;

  const sorted = [...allItems].sort((a, b) => compareSplitKeys(a, b, options));
  const buckets = new Map<string, IRecallPartGroupItem[]>();
  sorted.forEach(item => {
    const key = getSplitKey(item, options);
    buckets.set(key, [...(buckets.get(key) ?? []), item]);
  });

  const usedSources = new Set<string>();

  return Array.from(buckets.values()).map(items => {
    const source = sourceByItemId.get(items[0].id) ?? groups[0];
    const canReuse = !usedSources.has(source.key);
    usedSources.add(source.key);

    return {
      ...source,
      key: canReuse ? source.key : createGroupKey(),
      groupId: canReuse ? source.groupId : undefined,
      items,
    };
  });
};

/** Merges all groups into a single one. */
export const regroup = (
  groups: TGroupingGroup[],
  mode: ERegroupMode,
  recall: IRecall
): TGroupingGroup[] => {
  const [first] = groups;
  const items = groups.flatMap(group => group.items);

  if (mode === ERegroupMode.UseFirstGroup && first) {
    return [{ ...first, items }];
  }

  return [
    {
      key: createGroupKey(),
      recallComponent: recall.recallComponent ?? '',
      serviceRequest: recall.serviceRequest ?? null,
      items,
    },
  ];
};

/**
 * Moves the dragged item (or all selected items, when the dragged one is selected)
 * into the destination group at the given index.
 */
export const moveItems = (
  groups: TGroupingGroup[],
  draggedId: number,
  selectedIds: number[],
  destinationKey: string,
  destinationIndex: number
): TGroupingGroup[] => {
  const idsToMove = selectedIds.includes(draggedId) ? selectedIds : [draggedId];
  const allItems = groups.flatMap(group => group.items);
  const moving = idsToMove
    .map(id => allItems.find(item => item.id === id))
    .filter((item): item is IRecallPartGroupItem => Boolean(item));

  // keep the dragged item first so it lands exactly at the drop position
  moving.sort((a, b) => (a.id === draggedId ? -1 : b.id === draggedId ? 1 : 0));

  const destination = groups.find(group => group.key === destinationKey);
  if (!destination) return groups;

  // destinationIndex is relative to the destination list without the dragged item;
  // translate it to an index in the list without all moved items
  const destinationWithoutDragged = destination.items.filter(item => item.id !== draggedId);
  const adjustedIndex = destinationWithoutDragged
    .slice(0, destinationIndex)
    .filter(item => !idsToMove.includes(item.id)).length;

  return groups.map(group => {
    const remaining = group.items.filter(item => !idsToMove.includes(item.id));
    if (group.key !== destinationKey) return { ...group, items: remaining };
    const next = [...remaining];
    next.splice(adjustedIndex, 0, ...moving);
    return { ...group, items: next };
  });
};

/** Removes a group, moving its records to the neighbouring group. */
export const removeGroup = (groups: TGroupingGroup[], key: string): TGroupingGroup[] => {
  if (groups.length < 2) return groups;
  const index = groups.findIndex(group => group.key === key);
  if (index < 0) return groups;

  const targetIndex = index === 0 ? 1 : index - 1;
  const removed = groups[index];

  return groups
    .map((group, i) =>
      i === targetIndex ? { ...group, items: [...group.items, ...removed.items] } : group
    )
    .filter(group => group.key !== key);
};

export const buildGroupingPayload = (
  groups: TGroupingGroup[],
  serviceCenterId: number
): IRecallGroupingRequest => ({
  serviceCenterId,
  groups: groups
    .filter(group => group.items.length)
    .map((group, groupIndex) => ({
      ...(group.groupId !== undefined ? { groupId: group.groupId } : {}),
      groupIndex,
      serviceRequestId: group.serviceRequest?.id ?? null,
      recallComponent: group.recallComponent,
      items: group.items.map((item, itemIndex) => ({ id: item.id, itemIndex })),
    })),
});
