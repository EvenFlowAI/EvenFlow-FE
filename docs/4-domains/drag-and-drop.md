# Drag and Drop Domain

## Implementation Summary

The project uses both `react-dnd` and `@hello-pangea/dnd` depending on interaction complexity and UI context.

## Concrete Patterns

- Generic DnD wrappers live in `src/components/DragAndDrop/` and use `DndProvider` with `HTML5Backend`.
- Admin rule ordering in transportation management uses `DragDropContext`, `Droppable`, and `Draggable` from `@hello-pangea/dnd`.
- Reordering operations update local rule order and then dispatch Redux updates.

## Code Examples

From `src/components/DragAndDrop/DragAndDrop.tsx`:

```tsx
<DndProvider backend={HTML5Backend}>
  <Container
    isEditing={isEditing}
    data={data}
    setData={setData}
    style={dragAndDropStyle}
    currentMake={currentMake}
  />
</DndProvider>
```

From `src/features/admin/Transportations/EditTransportationModal/EditTransportationModal.tsx`:

```tsx
const onDragEnd = (result: DropResult) => {
  if (!result.destination) return;

  const reordered = Array.from(rules);
  const [moved] = reordered.splice(result.source.index, 1);
  reordered.splice(result.destination.index, 0, moved);

  const updated = reordered.map((item, index) => ({
    ...item,
    orderIndex: index,
  }));

  dispatch(setRules(updated));
};
```

