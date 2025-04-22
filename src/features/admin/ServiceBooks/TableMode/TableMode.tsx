import React from 'react';
import { ModeItem, Wrapper } from './styles';

type TProps = {
  tableMode: 'active' | 'inactive';
  setTableMode: (mode: 'active' | 'inactive') => void;
};

const TableMode: React.FC<TProps> = ({ tableMode, setTableMode }) => {
  return (
    <Wrapper>
      <ModeItem isActive={tableMode === 'active'} onClick={() => setTableMode('active')}>
        Active
      </ModeItem>
      <ModeItem isActive={tableMode === 'inactive'} onClick={() => setTableMode('inactive')}>
        Inactive
      </ModeItem>
    </Wrapper>
  );
};

export default TableMode;
