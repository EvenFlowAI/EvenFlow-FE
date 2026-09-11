import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Autocomplete, FormHelperText, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { useMultipleACStyles } from '../../Transportations/EditTransportationModal/styles';
import { RootState } from '../../../../store/rootReducer';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { renderChipTagsWithoutOptionObject } from '../../Transportations/EditTransportationModal/layouts/ChipTagRender';
import { TIdName } from '../../../../store/reducers/recall/types';

interface MakesFormProps {
  selectedMakes: TIdName[];
  setMakes: React.Dispatch<React.SetStateAction<TIdName[]>>;
  hasDefaultRecallOpsCode: boolean;
  clearSelectionErrorTrigger: number;
}

const MakesForm = ({
  selectedMakes,
  setMakes,
  hasDefaultRecallOpsCode,
  clearSelectionErrorTrigger,
}: MakesFormProps) => {
  const { classes: multipleACSClasses } = useMultipleACStyles();
  const { allMakesOptions } = useSelector((state: RootState) => state.globalVehicles);

  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSelectionBlockedError, setIsSelectionBlockedError] = useState(false);

  useEffect(() => {
    if (hasDefaultRecallOpsCode) {
      setIsSelectionBlockedError(false);
    }
  }, [hasDefaultRecallOpsCode]);

  useEffect(() => {
    setIsSelectionBlockedError(false);
  }, [clearSelectionErrorTrigger]);

  const mappedOptions: TIdName[] = useMemo(() => {
    let filtered = allMakesOptions;
    if (inputValue) {
      filtered = allMakesOptions.filter(m =>
        m.vinMake.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return filtered.map(m => ({ id: m.id, name: m.vinMake }));
  }, [allMakesOptions, inputValue]);

  const onCheckboxChange = useCallback(
    (option: TIdName) => {
      let next: TIdName[];
      const current = selectedMakes ?? [];

      const exists = current.some(o => o === option);
      next = exists ? current.filter(o => o !== option) : [...current, option];
      if (next.length === allMakesOptions.length) {
        next = [...allMakesOptions.map(m => ({ id: m.id, name: m.vinMake }))];
      }

      setMakes(next);
    },
    [selectedMakes, allMakesOptions, setMakes]
  );

  const makeRenderDealershipGroupOption = useCallback(
    () => (props: React.HTMLAttributes<HTMLLIElement>, option: TIdName) => {
      return (
        <li
          {...props}
          key={option.id}
          style={{ display: 'flex', alignItems: 'center', height: '34px' }}
        >
          {option.name.length > 35 ? (
            <Tooltip placement="top" title={option.name}>
              <p style={{ cursor: 'pointer', userSelect: 'none' }}>
                {option.name.slice(0, 34) + '...'}
              </p>
            </Tooltip>
          ) : (
            option.name
          )}
        </li>
      );
    },
    [selectedMakes, onCheckboxChange, allMakesOptions]
  );

  const handleSelectDealerships = (e: React.SyntheticEvent, val: TIdName[]) => {
    if (!hasDefaultRecallOpsCode && val.length > selectedMakes.length) {
      setIsSelectionBlockedError(true);
      setIsDropdownOpen(false);
      return;
    }

    setIsSelectionBlockedError(false);
    setMakes(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Autocomplete
        multiple
        classes={multipleACSClasses}
        open={isDropdownOpen}
        onOpen={() => {
          setIsDropdownOpen(true);
          setIsSelectionBlockedError(false);
        }}
        onClose={() => {
          setIsDropdownOpen(false);
          setIsSelectionBlockedError(false);
        }}
        options={mappedOptions}
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        disableCloseOnSelect
        inputValue={inputValue}
        onInputChange={(e, val) => {
          setInputValue(val);
        }}
        sx={{
          '& .MuiAutocomplete-inputRoot': {
            flexWrap: 'nowrap',
            width: 380,
            padding: '0',
          },
          '& .MuiInputBase-root': {
            border: isSelectionBlockedError ? '1px solid #F50057' : undefined,
          },
        }}
        renderOption={makeRenderDealershipGroupOption()}
        value={selectedMakes}
        onChange={handleSelectDealerships}
        renderTags={(selected, getTagProps) =>
          renderChipTagsWithoutOptionObject(
            selected.map(r => r.name),
            getTagProps,
            346,
            option => {
              setMakes(prev => prev.filter(t => t.name !== option));
            }
          )
        }
        renderInput={autocompleteRender({
          label: 'Makes supported',
          placeholder: 'Not Selected',
          error: isSelectionBlockedError,
        })}
      />
      {isSelectionBlockedError && (
        <FormHelperText error style={{ margin: 0, width: 364, fontSize: 14, color: '#E3256B' }}>
          Please select a Default recall op code to load and manage recall data for the selected
          make(s).
        </FormHelperText>
      )}
    </div>
  );
};

export default MakesForm;
