import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Container } from './Container/Container';
import { TDnDProps } from './types';
import { dragAndDropStyle } from '../../features/admin/MakesModels/AddMakeModelModal/helper';

const DragAndDrop: React.FC<TDnDProps> = ({ data, setData, isEditing, currentMakeName }) => {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Container
          data={data}
          setData={setData}
          style={dragAndDropStyle}
          isEditing={isEditing}
          currentMakeName={currentMakeName}
        />
      </DndProvider>
    </div>
  );
};

export default DragAndDrop;
