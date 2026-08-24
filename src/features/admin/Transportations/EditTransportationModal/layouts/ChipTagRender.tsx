import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { AutocompleteRenderGetTagProps } from '@mui/material/Autocomplete/Autocomplete';
import { TOption } from '../../types';
import {
  calculateMaxVisibleTags,
  calculateMaxVisibleTagsForDealershipGroupForm,
  calculateMaxVisibleTagsForWithoutOptionObject,
} from '../helper';

const dayOrder: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const tooltipListStyle: React.CSSProperties = {
  maxHeight: '400px',
  overflowY: 'auto',
};

export const renderChipTags = (
  selectedValues: TOption[],
  getTagProps: AutocompleteRenderGetTagProps,
  containerWidth = 500
) => {
  const sortedValues = [...selectedValues].sort((a, b) => {
    return (dayOrder[a.name] ?? 999) - (dayOrder[b.name] ?? 999);
  });

  const maxVisibleTags = calculateMaxVisibleTags(sortedValues, containerWidth);
  const visibleTags = sortedValues.slice(0, maxVisibleTags);
  const remainingCount = sortedValues.length - maxVisibleTags;

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
              {...props}
              key={option.value}
              label={option.name}
              size="medium"
              color="primary"
              variant="filled"
              style={{
                margin: '2px 4px 2px 0',
                flexShrink: 0,
                maxWidth: '200px',
              }}
            />
          );
        })}
        {remainingCount > 0 && (
          <Tooltip
            title={
              <div style={tooltipListStyle}>
                {sortedValues.slice(maxVisibleTags).map(option => (
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

export const renderChipTagsForDealership = (
  selectedValues: TOption[],
  getTagProps: AutocompleteRenderGetTagProps,
  containerWidth = 420
) => {
  const sortedValues = [...selectedValues].sort((a, b) => {
    return (dayOrder[a.name] ?? 999) - (dayOrder[b.name] ?? 999);
  });

  const maxVisibleTags = calculateMaxVisibleTagsForDealershipGroupForm(
    sortedValues,
    containerWidth
  );
  const visibleTags = sortedValues.slice(0, maxVisibleTags);
  const remainingCount = sortedValues.length - maxVisibleTags;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {visibleTags.map((option, tagIndex) => {
          const props = getTagProps({ index: tagIndex });
          return (
            <Chip
              {...props}
              key={option.value}
              label={option.name}
              size="medium"
              color="primary"
              variant="filled"
              style={{
                margin: '2px 4px 2px 0',
                flexShrink: 0,
                maxWidth: '200px',
              }}
            />
          );
        })}
        {remainingCount > 0 && (
          <Tooltip
            title={
              <div style={tooltipListStyle}>
                {sortedValues.slice(maxVisibleTags).map(option => (
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

export const renderChipTagsWithoutOptionObject = (
  selectedValues: string[],
  getTagProps: AutocompleteRenderGetTagProps,
  containerWidth = 350,
  handleDelete: (tag: string) => void
) => {
  const sortedValues = [...selectedValues].sort((a, b) => {
    return (dayOrder[a] ?? 999) - (dayOrder[b] ?? 999);
  });

  const maxVisibleTags = calculateMaxVisibleTagsForWithoutOptionObject(
    sortedValues,
    containerWidth
  );
  const visibleTags = sortedValues.slice(0, maxVisibleTags);
  const remainingCount = sortedValues.length - maxVisibleTags;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {visibleTags.map((option, tagIndex) => {
          const props = getTagProps({ index: tagIndex });
          return (
            <Chip
              label={option}
              {...props}
              key={option}
              onDelete={() => handleDelete(option)}
              size="medium"
              color="primary"
              variant="filled"
              style={{
                margin: '2px 4px 2px 0',
                flexShrink: 0,
                maxWidth: '130px',
              }}
            />
          );
        })}
        {remainingCount > 0 && (
          <Tooltip
            title={
              <div style={tooltipListStyle}>
                {sortedValues.slice(maxVisibleTags).map(option => (
                  <div key={option}>{option}</div>
                ))}
              </div>
            }
            arrow
            placement="bottom"
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
