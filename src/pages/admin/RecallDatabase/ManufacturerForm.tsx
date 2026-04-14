import React, { useCallback, useState, useMemo } from 'react';
import { Autocomplete, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { useMultipleACStyles } from '../../../features/admin/Transportations/EditTransportationModal/styles';
import { RootState } from '../../../store/rootReducer';
import { renderChipTagsWithoutOptionObject } from '../../../features/admin/Transportations/EditTransportationModal/layouts/ChipTagRender';
import { autocompleteRender } from '../../../utils/autocompleteRenders';

interface ManufacturerFormProps {
  selectedManufacturer: string[];
  setManufacturer: React.Dispatch<React.SetStateAction<string[]>>;
}

const ManufacturerForm = ({ selectedManufacturer, setManufacturer }: ManufacturerFormProps) => {
  const { classes: multipleACSClasses } = useMultipleACStyles();
  const { manufacturers } = useSelector((state: RootState) => state.recallDatabase);

  const [inputValue, setInputValue] = useState('');

  const mappedOptions: string[] = useMemo(() => {
    let filtered = manufacturers;
    if (inputValue) {
      filtered = manufacturers.filter(m => m.toLowerCase().includes(inputValue.toLowerCase()));
    }
    return filtered;
  }, [manufacturers, inputValue]);

  const onCheckboxChange = useCallback(
    (option: string) => {
      let next: string[];
      const current = selectedManufacturer ?? [];

      const exists = current.some(o => o === option);
      next = exists ? current.filter(o => o !== option) : [...current, option];
      if (next.length === manufacturers.length) {
        next = [...manufacturers];
      }

      setManufacturer(next);
    },
    [selectedManufacturer, manufacturers, setManufacturer]
  );

  const makeRenderDealershipGroupOption = useCallback(
    () => (props: React.HTMLAttributes<HTMLLIElement>, option: string) => {
      return (
        <li
          {...props}
          key={option}
          style={{ display: 'flex', alignItems: 'center', height: '34px' }}
        >
          {option.length > 35 ? (
            <Tooltip placement="top" title={option}>
              <p style={{ cursor: 'pointer', userSelect: 'none' }}>{option.slice(0, 34) + '...'}</p>
            </Tooltip>
          ) : (
            option
          )}
        </li>
      );
    },
    [selectedManufacturer, onCheckboxChange, manufacturers]
  );

  const handleSelectDealerships = (e: React.SyntheticEvent, val: string[]) => {
    setManufacturer(val);
  };

  return (
    <Autocomplete
      multiple
      classes={multipleACSClasses}
      options={mappedOptions}
      getOptionLabel={option => option}
      isOptionEqualToValue={(o, v) => o === v}
      disableCloseOnSelect
      inputValue={inputValue}
      onInputChange={(e, val) => {
        setInputValue(val);
      }}
      sx={{
        '& .MuiAutocomplete-inputRoot': {
          flexWrap: 'nowrap',
          width: 350,
          padding: '0',
        },
      }}
      renderOption={makeRenderDealershipGroupOption()}
      value={selectedManufacturer}
      onChange={handleSelectDealerships}
      renderTags={(selected, getTagProps) =>
        renderChipTagsWithoutOptionObject(selected, getTagProps, 350, option => {
          setManufacturer(prev => prev.filter(t => t !== option));
        })
      }
      renderInput={autocompleteRender({
        label: 'Manufacturer',
        placeholder: 'Not Selected',
      })}
    />
  );
};

export default ManufacturerForm;
