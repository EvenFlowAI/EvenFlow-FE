/* eslint-disable max-lines */

import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Divider } from '@mui/material';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { useSelector } from 'react-redux';
import { SearchInput } from '../../../../../components/formControls/SearchInput/SearchInput';
import { RootState } from '../../../../../store/rootReducer';
import { IAssignedServiceRequest } from '../../../../../store/reducers/serviceRequests/types';
import { CategoryFormState } from '../types';
import { useStyles } from './styles';
import { AvailableOpCodeRow } from './AvailableOpCodeRow';
import { SelectedOpCodeContent } from './SelectedOpCodeContent';

type TOpsCodesTransferPanelProps = {
  disabled: boolean;
  categoryHasCodesOrder: boolean;
  form: CategoryFormState;
  setForm: Dispatch<SetStateAction<CategoryFormState>>;
};

const MAX_SEARCH_INPUT_LENGTH = 100;

const getCodeDescription = (item: IAssignedServiceRequest): string =>
  item.serviceRequestOverride?.description?.length
    ? item.serviceRequestOverride.description
    : item.serviceRequest.description;

const getCodePrice = (item: IAssignedServiceRequest): number =>
  item.serviceRequestOverride?.invoiceAmount ?? item.serviceRequest.invoiceAmount ?? 0;

const bySearchTerm = (item: IAssignedServiceRequest, searchTerm: string): boolean => {
  if (!searchTerm.trim()) {
    return true;
  }

  const normalized = searchTerm.trim().toLowerCase();
  return (
    item.serviceRequest.code.toLowerCase().includes(normalized) ||
    getCodeDescription(item).toLowerCase().includes(normalized)
  );
};

const reorderIdsByVisibleSubset = (
  currentOrder: number[],
  visibleIds: number[],
  sourceIndex: number,
  destinationIndex: number
): number[] => {
  const reorderedVisible = [...visibleIds];
  const [moved] = reorderedVisible.splice(sourceIndex, 1);
  reorderedVisible.splice(destinationIndex, 0, moved);

  const visibleSet = new Set(visibleIds);
  let visibleCursor = 0;

  return currentOrder.map(id => {
    if (!visibleSet.has(id)) {
      return id;
    }

    const nextId = reorderedVisible[visibleCursor];
    visibleCursor += 1;
    return nextId;
  });
};

export const OpsCodesTransferPanel: React.FC<TOpsCodesTransferPanelProps> = ({
  disabled,
  categoryHasCodesOrder,
  form,
  setForm,
}) => {
  const { allAssignedList, assignedLoading } = useSelector(
    (state: RootState) => state.serviceRequests
  );
  const { classes, cx } = useStyles();

  const [availableSearchTerm, setAvailableSearchTerm] = useState('');
  const [selectedSearchTerm, setSelectedSearchTerm] = useState('');
  const [pendingIds, setPendingIds] = useState<number[]>([]);

  useEffect(() => {
    if (form.selectedCodes.length) {
      setPendingIds(form.selectedCodes.map(item => item.id));
    } else {
      setPendingIds([]);
    }
  }, [form.selectedCodes]);

  const selectedIds = useMemo(() => {
    if (categoryHasCodesOrder) {
      return [...form.selectedCodesWithOrder]
        .sort((a, b) => +a.orderIndex - +b.orderIndex)
        .map(item => item.id);
    }

    return form.selectedCodes.map(item => item.id);
  }, [categoryHasCodesOrder, form.selectedCodesWithOrder, form.selectedCodes]);

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedById = useMemo(() => {
    const map = new Map<number, IAssignedServiceRequest>();
    allAssignedList.forEach(item => map.set(item.id, item));
    return map;
  }, [allAssignedList]);

  const selectedCodes = useMemo(
    () => selectedIds.map(id => selectedById.get(id)).filter(Boolean) as IAssignedServiceRequest[],
    [selectedIds, selectedById]
  );

  const selectedOrderMap = useMemo(
    () => new Map(selectedIds.map((id, index) => [id, index + 1])),
    [selectedIds]
  );

  const availableCodes = useMemo(
    () => allAssignedList.filter(item => !selectedIdSet.has(item.id)),
    [allAssignedList, selectedIdSet]
  );

  const filteredAvailableCodes = useMemo(
    () => availableCodes.filter(item => bySearchTerm(item, availableSearchTerm)),
    [availableCodes, availableSearchTerm]
  );

  const filteredSelectedCodes = useMemo(
    () => selectedCodes.filter(item => bySearchTerm(item, selectedSearchTerm)),
    [selectedCodes, selectedSearchTerm]
  );

  const onPendingChange = useCallback((id: number) => {
    setPendingIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  }, []);

  const addCodes = useCallback(() => {
    if (!pendingIds.length || disabled) {
      return;
    }

    const idsToAdd = pendingIds.filter(id => !selectedIdSet.has(id));
    if (!idsToAdd.length) {
      return;
    }

    setForm(prev => {
      if (categoryHasCodesOrder) {
        const currentIds = [...prev.selectedCodesWithOrder]
          .sort((a, b) => +a.orderIndex - +b.orderIndex)
          .map(item => item.id);
        const nextIds = [...currentIds, ...idsToAdd];

        return {
          ...prev,
          selectedCodesWithOrder: nextIds.map((id, index) => ({ id, orderIndex: `${index + 1}` })),
          wrongOrderIndexes: [],
        };
      }

      const availableById = new Map(allAssignedList.map(item => [item.id, item]));
      const nextCodes = [...prev.selectedCodes];

      idsToAdd.forEach(id => {
        const code = availableById.get(id);
        if (code && !nextCodes.find(item => item.id === id)) {
          nextCodes.push(code);
        }
      });

      return {
        ...prev,
        selectedCodes: nextCodes,
      };
    });

    setPendingIds([]);
  }, [pendingIds, disabled, selectedIdSet, setForm, categoryHasCodesOrder, allAssignedList]);

  const deleteCode = useCallback(
    (id: number) => {
      if (disabled) {
        return;
      }

      setForm(prev => {
        if (categoryHasCodesOrder) {
          const nextIds = prev.selectedCodesWithOrder
            .filter(item => item.id !== id)
            .sort((a, b) => +a.orderIndex - +b.orderIndex)
            .map(item => item.id);

          return {
            ...prev,
            selectedCodesWithOrder: nextIds.map((itemId, index) => ({
              id: itemId,
              orderIndex: `${index + 1}`,
            })),
            wrongOrderIndexes: prev.wrongOrderIndexes.filter(wrongId => wrongId !== id),
          };
        }

        return {
          ...prev,
          selectedCodes: prev.selectedCodes.filter(item => item.id !== id),
        };
      });
    },
    [disabled, setForm, categoryHasCodesOrder]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (disabled || !categoryHasCodesOrder || !result.destination) {
        return;
      }

      const visibleIds = filteredSelectedCodes.map(item => item.id);
      const reorderedIds = reorderIdsByVisibleSubset(
        selectedIds,
        visibleIds,
        result.source.index,
        result.destination.index
      );

      setForm(prev => {
        if (categoryHasCodesOrder) {
          return {
            ...prev,
            selectedCodesWithOrder: reorderedIds.map((id, index) => ({
              id,
              orderIndex: `${index + 1}`,
            })),
            wrongOrderIndexes: [],
          };
        }

        const selectedCodesById = new Map(prev.selectedCodes.map(item => [item.id, item]));
        return {
          ...prev,
          selectedCodes: reorderedIds
            .map(id => selectedCodesById.get(id))
            .filter(Boolean) as IAssignedServiceRequest[],
        };
      });
    },
    [disabled, filteredSelectedCodes, selectedIds, setForm, categoryHasCodesOrder]
  );

  return (
    <div className={classes.columns}>
      <div className={classes.column}>
        <div className={classes.titleRow}>
          <span className={classes.title}>Add Op Codes</span>
          <Button
            variant="contained"
            color="primary"
            disabled={disabled || !pendingIds.length}
            onClick={addCodes}
          >
            Add Op Codes
          </Button>
        </div>

        <div className={classes.search}>
          <SearchInput
            value={availableSearchTerm}
            style={{ width: '100%' }}
            placeholder="Search..."
            onSearch={() => undefined}
            onChange={e => setAvailableSearchTerm(e.target.value.slice(0, MAX_SEARCH_INPUT_LENGTH))}
            delay={250}
          />
        </div>

        <Divider className={classes.divider} />

        <div className={classes.listBody}>
          {assignedLoading ? (
            <div className={classes.emptyState}>Loading op codes...</div>
          ) : filteredAvailableCodes.length ? (
            filteredAvailableCodes.map(item => (
              <AvailableOpCodeRow
                key={item.id}
                item={item}
                description={getCodeDescription(item)}
                price={getCodePrice(item)}
                disabled={disabled}
                checked={pendingIds.includes(item.id)}
                rowClassName={classes.row}
                codeClassName={classes.code}
                descriptionClassName={classes.description}
                priceClassName={classes.price}
                onToggle={onPendingChange}
              />
            ))
          ) : (
            <div className={classes.emptyState}>No op codes found</div>
          )}
        </div>
      </div>

      <div className={classes.column}>
        <div className={classes.titleRowRight}>
          <span className={classes.title}>Selected ({selectedCodes.length})</span>
          {categoryHasCodesOrder && (
            <span className={classes.helperText}>Use drag and drop to reorder</span>
          )}
        </div>

        <div className={classes.search}>
          <SearchInput
            value={selectedSearchTerm}
            style={{ width: '100%' }}
            placeholder="Filter selected..."
            onSearch={() => undefined}
            onChange={e => setSelectedSearchTerm(e.target.value.slice(0, MAX_SEARCH_INPUT_LENGTH))}
            delay={250}
          />
        </div>

        <Divider className={classes.divider} />

        {categoryHasCodesOrder ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="selected-op-codes">
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={classes.listBody}
                >
                  {filteredSelectedCodes.length ? (
                    filteredSelectedCodes.map((item, index) => (
                      <Draggable key={item.id} draggableId={`op-code-${item.id}`} index={index}>
                        {(draggableProvided, snapshot) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            className={cx(classes.row, classes.selectedRow)}
                            style={{
                              ...draggableProvided.draggableProps.style,
                              backgroundColor: snapshot.isDragging
                                ? '#f5f7ff'
                                : index % 2 === 1
                                  ? '#F2F4FB'
                                  : 'transparent',
                            }}
                          >
                            <SelectedOpCodeContent
                              item={item}
                              description={getCodeDescription(item)}
                              price={getCodePrice(item)}
                              disabled={disabled}
                              codeStackClassName={classes.codeStack}
                              codeClassName={classes.codeInline}
                              descriptionClassName={classes.descriptionInline}
                              priceClassName={classes.price}
                              orderIndexClassName={classes.orderIndex}
                              dragHandleClassName={classes.dragHandle}
                              showDragHandle
                              orderIndex={selectedOrderMap.get(item.id)}
                              dragHandleProps={draggableProvided.dragHandleProps ?? undefined}
                              onDelete={deleteCode}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <div className={classes.emptyState}>
                      {selectedSearchTerm.trim() && selectedCodes.length
                        ? 'No matches'
                        : 'No op codes selected'}
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className={classes.listBody}>
            {filteredSelectedCodes.length ? (
              filteredSelectedCodes.map(item => (
                <div key={item.id} className={cx(classes.row, classes.selectedRow)}>
                  <SelectedOpCodeContent
                    item={item}
                    description={getCodeDescription(item)}
                    price={getCodePrice(item)}
                    disabled={disabled}
                    codeStackClassName={classes.codeStack}
                    codeClassName={classes.codeInline}
                    descriptionClassName={classes.descriptionInline}
                    priceClassName={classes.price}
                    orderIndexClassName={classes.orderIndex}
                    dragHandleClassName={classes.dragHandle}
                    onDelete={deleteCode}
                  />
                </div>
              ))
            ) : (
              <div className={classes.emptyState}>
                {selectedSearchTerm.trim() && selectedCodes.length
                  ? 'No matches'
                  : 'No op codes selected'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
