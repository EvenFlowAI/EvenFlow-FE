import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Container } from './Container/Container';
import { TDnDProps } from './types';

const DragAndDrop: React.FC<TDnDProps> = ({ style, data, setData, isEditing }) => {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Container data={data} setData={setData} style={style} isEditing={isEditing} />
      </DndProvider>
    </div>
  );
};

export default DragAndDrop;
