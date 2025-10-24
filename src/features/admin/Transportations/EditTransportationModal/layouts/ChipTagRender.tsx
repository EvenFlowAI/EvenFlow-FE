import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { TOption } from '../../types';
import { calculateMaxVisibleTags } from '../helper';

export const renderChipTags = (
  selectedValues: TOption[],
  getTagProps: (params: { index: number }) => any,
  containerWidth = 500
) => {
  const maxVisibleTags = calculateMaxVisibleTags(selectedValues, containerWidth);
  const visibleTags = selectedValues.slice(0, maxVisibleTags);
  const remainingCount = selectedValues.length - maxVisibleTags;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {visibleTags.map((option, tagIndex) => {
          const props = getTagProps({ index: tagIndex });
          return (
            <Chip
              key={option.value}
              label={option.name}
              onDelete={props.onDelete}
              size="medium"
              color="primary"
              variant="filled"
              style={{
                margin: '2px 4px 2px 0',
                flexShrink: 0,
                maxWidth: '200px',
              }}
              {...props}
            />
          );
        })}
        {remainingCount > 0 && (
          <Tooltip
            title={
              <div>
                {selectedValues.slice(maxVisibleTags).map(option => (
                  <div key={option.value}>{option.name}</div>
                ))}
              </div>
            }
            arrow
            placement="top"
          >
            <Chip
              key="others"
              label={`+${remainingCount} others`}
              size="medium"
              color="primary"
              variant="filled"
              style={{
                margin: '2px 4px 2px 0',
                flexShrink: 0,
              }}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};
