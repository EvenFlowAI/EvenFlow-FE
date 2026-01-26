import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

type RecallItem = {
  id: string;
  recallId: string;
  make: string;
  model: string;
  years: string;
  description: string;
  authority: string;
  selected: boolean;
};

type GroupedRecalls = {
  [groupId: string]: RecallItem[];
};

const initialData: GroupedRecalls = {
  List: [
    {
      id: '1',
      recallId: '17V-029',
      make: 'HONDA',
      model: 'Element',
      years: '2016',
      description: 'Injury Risk - Passenger front airbag inflator may rupture Safety Risk',
      authority: 'NHTSA TEST',
      selected: false,
    },
    {
      id: '2',
      recallId: '17V-029',
      make: 'HONDA',
      model: 'Civic',
      years: '2017, 2018',
      description: 'Injury Risk - Passenger front airbag inflator may rupture Safety Risk',
      authority: 'NHTSA TEST',
      selected: false,
    },
    {
      id: '3',
      recallId: '17V-029',
      make: 'HONDA',
      model: 'Accord',
      years: '2019',
      description: 'Injury Risk - Passenger front airbag inflator may rupture Safety Risk',
      authority: 'NHTSA TEST',
      selected: false,
    },
  ],
  'group 1': [
    {
      id: '4',
      recallId: '17V-029',
      make: 'Ford',
      model: 'Expedition',
      years: '2016',
      description: 'Injury Risk - Passenger front airbag inflator may rupture Safety Risk',
      authority: 'NHTSA TEST',
      selected: false,
    },
  ],
  'group 2': [],
};

export default function RegroupRecallBoard() {
  const [groups, setGroups] = useState<GroupedRecalls>(initialData);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;

    const sourceList = groups[sourceId];
    const destList = groups[destId];

    const draggedId = result.draggableId;
    const draggedItem = sourceList.find(item => item.id === draggedId);
    if (!draggedItem) return;

    const movingIds = draggedItem.selected
      ? sourceList.filter(item => item.selected).map(item => item.id)
      : [draggedId];

    let movingItems = sourceList.filter(item => movingIds.includes(item.id));
    const newSource = sourceList.filter(item => !movingIds.includes(item.id));

    if (sourceId === destId) {
      const reordered = [
        ...newSource.slice(0, result.destination.index),
        ...movingItems,
        ...newSource.slice(result.destination.index),
      ];
      setGroups(prev => ({
        ...prev,
        [sourceId]: reordered,
      }));
    } else {
      movingItems = movingItems.map(item => ({ ...item, selected: false }));
      const newDest = [
        ...destList.slice(0, result.destination.index),
        ...movingItems,
        ...destList.slice(result.destination.index),
      ];
      setGroups(prev => ({
        ...prev,
        [sourceId]: newSource,
        [destId]: newDest,
      }));
    }
  };

  const toggleCheckbox = (groupId: string, itemId: string) => {
    setGroups(prev => ({
      ...prev,
      [groupId]: prev[groupId].map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      ),
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '24px', padding: '16px', flexDirection: 'column' }}>
        {Object.entries(groups).map(([groupId, items]) => (
          <div key={groupId} style={{ flex: 1 }}>
            <h3>{groupId.toUpperCase()}</h3>
            <Droppable droppableId={groupId}>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minHeight: '200px',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: '#f9f9f9',
                  }}
                >
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            background: item.selected ? '#d0f0ff' : '#fff',
                            border: '1px solid #aaa',
                            borderRadius: '4px',
                            padding: '8px',
                            marginBottom: '6px',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <label style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={() => toggleCheckbox(groupId, item.id)}
                            />
                            <div>
                              <strong>{item.recallId}</strong> | {item.make} {item.model} (
                              {item.years})<br />
                              <small>{item.description}</small>
                              <br />
                              <em>{item.authority}</em>
                            </div>
                          </label>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
