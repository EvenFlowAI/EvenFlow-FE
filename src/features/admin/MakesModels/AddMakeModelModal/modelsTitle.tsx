import { Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React from 'react';

export const ModelsTitle = (removedModels: { name: string }[]): React.ReactNode => {
  if (removedModels.length === 1) {
    return `Please confirm you want to remove model ${removedModels[0].name}!`;
  }
  return (
    <div>
      {`Please confirm you want to remove ${removedModels.length} selected models!`}
      <Tooltip title={removedModels.map(model => model.name).join(', ')} arrow placement="top">
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
