import React, { useMemo } from 'react';
import {
  Autocomplete,
  Checkbox,
  Chip,
  FormHelperText,
  Tooltip,
  createFilterOptions,
} from '@mui/material';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { TIdName } from '../../../../store/reducers/recall/types';
import { useMakesFormStyles } from './styles';
import { useMakesForm } from './useMakesForm';
import { isSelectAll, SELECT_ALL_OPTION } from './helpers';
import { MakesDropdownFooterContext, MakesDropdownPaper } from './MakesDropdownPaper';

interface MakesFormProps {
  hasDefaultRecallOpsCode: boolean;
  clearSelectionErrorTrigger: number;
}

// the field has a fixed 40px height, so only a few chips fit; the rest go into "+N"
const MAX_VISIBLE_CHIPS = 3;

const defaultFilter = createFilterOptions<TIdName>();

const MakesForm: React.FC<MakesFormProps> = ({
  hasDefaultRecallOpsCode,
  clearSelectionErrorTrigger,
}) => {
  const { classes, cx } = useMakesFormStyles();
  const {
    options,
    draft,
    isOpen,
    loading,
    allSelected,
    someSelected,
    isSelectionBlockedError,
    isLocked,
    onOpen,
    onCancel,
    onAdd,
    onChange,
  } = useMakesForm({ hasDefaultRecallOpsCode, clearSelectionErrorTrigger });

  const footerContext = useMemo(() => ({ loading, onCancel, onAdd }), [loading, onCancel, onAdd]);

  return (
    <div className={classes.wrapper}>
      <MakesDropdownFooterContext.Provider value={footerContext}>
        <Autocomplete<TIdName, true>
          multiple
          disableCloseOnSelect
          className={cx(classes.autocomplete, isSelectionBlockedError && classes.autocompleteError)}
          open={isOpen}
          onOpen={onOpen}
          onClose={(e, reason) => {
            if (reason !== 'selectOption' && reason !== 'removeOption') onCancel();
          }}
          options={options.length ? [SELECT_ALL_OPTION, ...options] : []}
          filterOptions={(opts, state) => {
            const filtered = defaultFilter(
              opts.filter(option => !isSelectAll(option)),
              state
            );
            return state.inputValue || !filtered.length
              ? filtered
              : [SELECT_ALL_OPTION, ...filtered];
          }}
          value={draft}
          onChange={onChange}
          getOptionLabel={option => option.name}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          getOptionDisabled={option => !isSelectAll(option) && isLocked(option)}
          PaperComponent={MakesDropdownPaper}
          renderOption={(props, option, { selected }) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { key, ...optionProps } = props as React.HTMLAttributes<HTMLLIElement> & {
              key?: string;
            };
            const selectAll = isSelectAll(option);
            return (
              <li
                {...optionProps}
                key={option.id}
                className={cx(optionProps.className, classes.option)}
              >
                <Checkbox
                  size="small"
                  color="primary"
                  className={classes.checkbox}
                  checked={selectAll ? allSelected : selected}
                  disabled={!selectAll && isLocked(option)}
                  indeterminate={selectAll && someSelected}
                />
                {option.name}
              </li>
            );
          }}
          renderTags={(value, getTagProps) => {
            const hidden = value.slice(MAX_VISIBLE_CHIPS);
            return (
              <>
                {value.slice(0, MAX_VISIBLE_CHIPS).map((option, index) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { key, onDelete, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      {...tagProps}
                      key={option.id}
                      label={option.name}
                      size="small"
                      className={classes.chip}
                      onDelete={isLocked(option) ? undefined : onDelete}
                    />
                  );
                })}
                {hidden.length > 0 && (
                  <Tooltip
                    placement="top"
                    title={
                      <div>
                        {hidden.map(option => (
                          <div key={option.id}>{option.name}</div>
                        ))}
                      </div>
                    }
                  >
                    <Chip label={`+${hidden.length}`} size="small" className={classes.moreChip} />
                  </Tooltip>
                )}
              </>
            );
          }}
          renderInput={autocompleteRender({
            label: 'Makes supported',
            placeholder: draft?.length >= MAX_VISIBLE_CHIPS ? undefined : 'List of makes',
            error: isSelectionBlockedError,
          })}
        />
      </MakesDropdownFooterContext.Provider>
      {isSelectionBlockedError && (
        <FormHelperText error className={classes.error}>
          Please select a Default recall op code to load and manage recall data for the selected
          make(s).
        </FormHelperText>
      )}
    </div>
  );
};

export default MakesForm;
