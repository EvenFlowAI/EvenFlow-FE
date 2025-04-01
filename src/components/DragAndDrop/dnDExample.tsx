import React, { useState } from 'react';
import DragAndDrop from './DragAndDrop';

const style = {
  padding: 12,
  backgroundColor: '#F7F8FB',
  border: '1px solid #DADADA',
  width: '238px',
  height: '576px',
  gap: '8px',
};

const mockData = [
  { id: 1, text: '1111111' },
  { id: 2, text: '2222222' },
  { id: 3, text: '3333333' },
  { id: 4, text: '44444444' },
];

const DnDExample = () => {
  const [data, setData] = useState<any>(mockData);
  return <DragAndDrop data={data} setData={setData} style={style} isEditing={false} />;
};

export default DnDExample;
