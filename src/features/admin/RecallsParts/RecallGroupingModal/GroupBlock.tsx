import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Checkbox, IconButton } from '@mui/material';
import { DeleteOutline, DragIndicator } from '@mui/icons-material';
import { useRecallGroupingStyles } from './styles';
import { TGroupingGroup } from './types';
import { getItemDraggableId } from './helpers';

type TProps = {
  group: TGroupingGroup;
  index: number;
  selectedIds: number[];
  canDelete: boolean;
  onToggleItem: (id: number) => void;
  onDelete: (key: string) => void;
};

export const GroupBlock: React.FC<React.PropsWithChildren<TProps>> = ({
  group,
  index,
  selectedIds,
  canDelete,
  onToggleItem,
  onDelete,
}) => {
  const { classes, cx } = useRecallGroupingStyles();

  return (
    <div className={classes.group}>
      <div className={classes.groupLabel}>Group {index + 1}</div>
      <Droppable droppableId={group.key}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cx(
              classes.groupItems,
              snapshot.isDraggingOver && classes.groupItemsDraggingOver
            )}
          >
            {group.items.map((item, itemIndex) => (
              <Draggable key={item.id} draggableId={getItemDraggableId(item)} index={itemIndex}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    className={cx(classes.row, draggableSnapshot.isDragging && classes.rowDragging)}
                  >
                    <span className={classes.dragHandle} {...draggableProvided.dragHandleProps}>
                      <DragIndicator fontSize="small" />
                    </span>
                    <Checkbox
                      size="small"
                      color="primary"
                      className={classes.checkbox}
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onToggleItem(item.id)}
                    />
                    <span>{item.make?.name ?? '-'}</span>
                    <span>{item.model?.name ?? '-'}</span>
                    <span>{item.year ?? '-'}</span>
                    <span>{group.serviceRequest?.name ?? '-'}</span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className={classes.groupDelete}>
        <IconButton
          size="small"
          color="primary"
          disabled={!canDelete}
          onClick={() => onDelete(group.key)}
        >
          <DeleteOutline fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};
