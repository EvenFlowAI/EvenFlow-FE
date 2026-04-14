import React from 'react';
import { Chip, Tooltip } from '@mui/material';
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

export const renderChipTags = (
  selectedValues: TOption[],
  getTagProps: (params: { index: number }) => any,
  containerWidth = 500
) => {
  const sortedValues = [...selectedValues].sort((a, b) => {
    const aIndex = dayOrder[a.name] ?? 999;
    const bIndex = dayOrder[b.name] ?? 999;
    return aIndex - bIndex;
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
  getTagProps: (params: { index: number }) => any,
  containerWidth = 420
) => {
  const sortedValues = [...selectedValues].sort((a, b) => {
    const aIndex = dayOrder[a.name] ?? 999;
    const bIndex = dayOrder[b.name] ?? 999;
    return aIndex - bIndex;
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
  getTagProps: (params: { index: number }) => any,
  containerWidth = 350,
  handleDelete: (tag: string) => void
) => {
  const sortedValues = [...selectedValues].sort((a, b) => {
    const aIndex = dayOrder[a] ?? 999;
    const bIndex = dayOrder[b] ?? 999;
    return aIndex - bIndex;
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
          console.log(props.onDelete);
          return (
            <Chip
              key={option}
              label={option}
              onDelete={() => handleDelete(option)}
              size="medium"
              color="primary"
              variant="filled"
              style={{
                margin: '2px 4px 2px 0',
                flexShrink: 0,
                maxWidth: '130px',
              }}
              {...props}
            />
          );
        })}
        {remainingCount > 0 && (
          <Tooltip
            title={
              <div>
                {sortedValues.slice(maxVisibleTags).map(option => (
                  <div key={option}>{option}</div>
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
