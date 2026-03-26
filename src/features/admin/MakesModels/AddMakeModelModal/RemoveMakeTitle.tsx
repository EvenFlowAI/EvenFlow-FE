import { Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React from 'react';

export const RemoveMakeTitle = (removedMakes: { name: string }[]): React.ReactNode => {
  if (removedMakes.length === 1) {
    return `Please confirm you want to remove make ${removedMakes[0].name}!`;
  }
  return (
    <div>
      {`Please confirm you want to remove ${removedMakes.length} selected makes!`}
      <Tooltip title={removedMakes.map(make => make.name).join(', ')} arrow placement="top">
        <InfoOutlinedIcon
          style={{
            width: 20,
            height: 20,
            color: '#7898FF',
            cursor: 'help',
            position: 'relative',
            top: 3,
          }}
        />
      </Tooltip>
    </div>
  );
};
