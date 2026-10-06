import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material';
import { RootState } from '../../../../store/rootReducer';
import { TIdName } from '../../../../store/reducers/recall/types';
import { syncRecallMakes } from '../../../../store/reducers/recall/actions';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../hooks/useException/useException';
import { getAppliedMakes, hasNewMakes, isSelectAll, mapMakesToOptions } from './helpers';

type TParams = {
  hasDefaultRecallOpsCode: boolean;
  clearSelectionErrorTrigger: number;
};

export const useMakesForm = ({ hasDefaultRecallOpsCode, clearSelectionErrorTrigger }: TParams) => {
  const dispatch = useDispatch();
  const showError = useException();
  const { selectedSC } = useSCs();
  const { allMakes } = useSelector((state: RootState) => state.vehicleDetails);

  const options = useMemo(() => mapMakesToOptions(allMakes), [allMakes]);
  const appliedMakes = useMemo(() => getAppliedMakes(allMakes, options), [allMakes, options]);
  // already supported makes are locked: the user can't uncheck them
  const lockedIds = useMemo(() => new Set(appliedMakes.map(make => make.id)), [appliedMakes]);
  const isLocked = (option: TIdName): boolean => lockedIds.has(option.id);

  const [draft, setDraft] = useState<TIdName[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelectionBlockedError, setIsSelectionBlockedError] = useState(false);

  // keep the draft in sync with supported makes while the dropdown is closed
  useEffect(() => {
    if (!isOpen) setDraft(appliedMakes);
  }, [appliedMakes, isOpen]);

  useEffect(() => {
    if (hasDefaultRecallOpsCode) setIsSelectionBlockedError(false);
  }, [hasDefaultRecallOpsCode]);

  useEffect(() => {
    setIsSelectionBlockedError(false);
  }, [clearSelectionErrorTrigger]);

  const allSelected = options.length > 0 && draft.length === options.length;
  const someSelected = draft.length > 0 && !allSelected;

  const onOpen = () => {
    setIsOpen(true);
    setIsSelectionBlockedError(false);
  };

  const onCancel = () => {
    setDraft(appliedMakes);
    setIsOpen(false);
  };

  const onAdd = () => {
    if (!selectedSC) return;
    if (!hasDefaultRecallOpsCode && hasNewMakes(draft, appliedMakes)) {
      setIsSelectionBlockedError(true);
      onCancel();
      return;
    }
    setLoading(true);
    dispatch(
      syncRecallMakes(
        { serviceCenterId: selectedSC.id, makeIds: draft.map(make => make.id) },
        err => {
          setLoading(false);
          showError(err);
        },
        () => {
          setLoading(false);
          setIsOpen(false);
        }
      )
    );
  };

  const onChange = (
    e: SyntheticEvent,
    value: TIdName[],
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<TIdName>
  ) => {
    if (isSelectAll(details?.option)) {
      // "deselect all" keeps the locked makes selected
      setDraft(allSelected ? appliedMakes : options);
      return;
    }
    const valueIds = new Set(value.filter(option => !isSelectAll(option)).map(o => o.id));
    const next = options.filter(option => isLocked(option) || valueIds.has(option.id));
    setDraft(next);
    // removing a chip / clearing changes the draft, so open the dropdown to confirm via Add
    if ((reason === 'removeOption' || reason === 'clear') && next.length !== draft.length) {
      setIsOpen(true);
    }
  };

  return {
    options,
    draft,
    isOpen,
    loading,
    allSelected,
    someSelected,
    isSelectionBlockedError,
    isLocked,
    onOpen,
    onCancel,
    onAdd,
    onChange,
  };
};
