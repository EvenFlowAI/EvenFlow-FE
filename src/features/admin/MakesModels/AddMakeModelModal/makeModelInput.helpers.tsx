import React from 'react';
import { Tooltip } from '@mui/material';
import { AutocompleteRenderGetTagProps } from '@mui/material/Autocomplete/Autocomplete';
import { IData } from '../../../../components/DragAndDrop/types';
import TagDeleteIcon from './TagDeleteIcon';

type TRenderTagsParams = {
  value: IData[];
  getTagProps: AutocompleteRenderGetTagProps;
  isEditing?: boolean;
  filteredGlobalModels: IData[];
  filteredGlobalMakes: IData[];
  tagClassName: string;
  setModelsToAdd: (models: IData[]) => void;
  setMakesToAdd: (makes: IData[]) => void;
};

const calculateMaxVisibleTags = (value: IData[]) => {
  if (!value.length) {
    return 0;
  }

  const totalLength = value.reduce((sum, item) => sum + item.text.length, 0);
  if (value.length <= 3 && value.every(item => item.text.length <= 5)) {
    return value.length;
  }

  const avgLength = totalLength / value.length;
  if (avgLength > 15) {
    return 1;
  }
  if (avgLength > 8) {
    return 2;
  }

  return 2;
};

export const renderMakeModelTags = ({
  value,
  getTagProps,
  isEditing,
  filteredGlobalModels,
  filteredGlobalMakes,
  tagClassName,
  setModelsToAdd,
  setMakesToAdd,
}: TRenderTagsParams) => {
  const allSelected = isEditing
    ? value.length === filteredGlobalModels.length
    : value.length === filteredGlobalMakes.length;

  if (allSelected) {
    const props = getTagProps({ index: 0 });
    return (
      <div {...props}>
        <div className={tagClassName}>
          {isEditing ? 'All models' : 'All makes'}
          <TagDeleteIcon
            onClick={() => {
              if (isEditing) {
                setModelsToAdd([]);
              } else {
                setMakesToAdd([]);
              }
            }}
          />
        </div>
      </div>
    );
  }

  const maxVisibleTags = calculateMaxVisibleTags(value);
  const visibleTags = value.slice(0, maxVisibleTags);
  const remainingCount = value.length - maxVisibleTags;

  return (
    <>
      {visibleTags.map((option, index) => {
        const tagProps = getTagProps({ index });
        const { key, ...props } = tagProps;
        return (
          <React.Fragment key={key ?? option.id}>
            <div {...props}>
              <Tooltip title={option.text} arrow placement="top">
                <div className={tagClassName}>
                  <div
                    style={{
                      maxWidth: value.length > 1 ? '110px' : '230px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {option.text}
                  </div>
                  {props.onDelete ? <TagDeleteIcon onClick={props.onDelete} /> : null}
                </div>
              </Tooltip>
            </div>
          </React.Fragment>
        );
      })}
      {remainingCount > 0 ? (
        <div {...getTagProps({ index: maxVisibleTags })}>
          <Tooltip
            title={
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {value.slice(maxVisibleTags).map(option => (
                  <div key={option.id}>{option.text}</div>
                ))}
              </div>
            }
            arrow
            placement="bottom"
          >
            <div className={tagClassName}>+{remainingCount} others</div>
          </Tooltip>
        </div>
      ) : null}
    </>
  );
};
