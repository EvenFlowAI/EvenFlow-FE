import { useCallback, useEffect, useState } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { IRecall } from '../../../../store/reducers/recall/types';
import {
  createEmptyGroup,
  mapRecallToGroups,
  moveItems,
  regroup,
  removeGroup,
  splitGroups,
} from './helpers';
import { EGroupingPanel, ERegroupMode, TGroupingGroup, TSplitOptions } from './types';

export const useRecallGrouping = (recall: IRecall | null, open: boolean) => {
  const [groups, setGroups] = useState<TGroupingGroup[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [panel, setPanel] = useState<EGroupingPanel>(EGroupingPanel.None);

  const reset = useCallback(() => {
    setGroups(recall ? mapRecallToGroups(recall) : []);
    setSelectedIds([]);
    setPanel(EGroupingPanel.None);
  }, [recall]);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const togglePanel = (next: EGroupingPanel) =>
    setPanel(prev => (prev === next ? EGroupingPanel.None : next));

  const closePanel = () => setPanel(EGroupingPanel.None);

  const addGroup = () => setGroups(prev => [...prev, createEmptyGroup(prev[prev.length - 1])]);

  const deleteGroup = (key: string) => setGroups(prev => removeGroup(prev, key));

  const toggleItem = (id: number) =>
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(el => el !== id) : [...prev, id]));

  const split = (options: TSplitOptions) => {
    setGroups(prev => splitGroups(prev, options));
    setSelectedIds([]);
    closePanel();
  };

  const merge = (mode: ERegroupMode) => {
    if (!recall) return;
    setGroups(prev => regroup(prev, mode, recall));
    setSelectedIds([]);
    closePanel();
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const draggedId = Number(draggableId.replace('item-', ''));
    setGroups(prev =>
      moveItems(prev, draggedId, selectedIds, destination.droppableId, destination.index)
    );
    setSelectedIds([]);
  };

  return {
    groups,
    selectedIds,
    panel,
    reset,
    togglePanel,
    closePanel,
    addGroup,
    deleteGroup,
    toggleItem,
    split,
    merge,
    onDragEnd,
  };
};
