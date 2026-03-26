import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { Autocomplete, Checkbox } from '@mui/material';
import { renderChipTagsForDealership } from '../../../../../features/admin/Transportations/EditTransportationModal/layouts/ChipTagRender';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { useMultipleACStyles } from '../../../../../features/admin/Transportations/EditTransportationModal/styles';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { TUserAccountForm } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { TOption } from '../../../../../utils/types';

interface DealershipGroupProps {
  form: TUserAccountForm;
  setEmployeeForm: Dispatch<SetStateAction<TUserAccountForm>>;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  isAdding: boolean;
  formIsChecked: boolean;
  isAdminPanel: boolean;
}

const AddDealershipGroupForm = ({
  form,
  setEmployeeForm,
  setFormIsChecked,
  isAdding,
  formIsChecked,
  isAdminPanel,
}: DealershipGroupProps) => {
  const { classes: multipleACSClasses } = useMultipleACStyles();

  const { dealershipList, accessibleDealerships, profile } = useSelector(
    (state: RootState) => state.dealershipGroups
  );

  const baseList = accessibleDealerships.length ? accessibleDealerships : dealershipList;

  const mappedOptions: TOption[] = baseList.map(d => ({
    value: d.id,
    name: d.name,
  }));

  const allOptions: TOption[] = isAdminPanel
    ? mappedOptions.filter(d => d.value === profile?.id)
    : mappedOptions;

  const options: TOption[] =
    allOptions.length > 1 ? [{ value: 0, name: 'Select all' }, ...allOptions] : allOptions;

  const onCheckboxChange = useCallback(
    (option: TOption) => {
      let next: TOption[] = [];
      const current = form.dealerships ?? [];

      if (option.name === 'Select all') {
        const isAllSelected = current.length === allOptions.length;
        next = isAllSelected ? [] : [...allOptions];
      } else {
        const exists = current.some(o => o.value === option.value);
        next = exists ? current.filter(o => o.value !== option.value) : [...current, option];

        // if all selected - adding all
        if (next.length === allOptions.length) {
          next = [...allOptions];
        }
      }

      setEmployeeForm(prev => ({ ...prev, dealerships: next }));
      setFormIsChecked(false);
    },
    [form.dealerships]
  );

  const makeRenderDealershipGroupOption = useCallback(
    () => (props: React.HTMLAttributes<HTMLLIElement>, option: TOption) => {
      const selected = form.dealerships ?? [];
      const checked =
        option.name === 'Select all'
          ? selected.length === allOptions.length
          : selected.some(item => item.value === option.value);

      return (
        <li
          {...props}
          key={`${option.name}-${option.value}`}
          style={{ display: 'flex', alignItems: 'center', height: '34px' }}
          onClick={() => onCheckboxChange(option)} // added
        >
          <Checkbox
            color="primary"
            icon={
              checked ? (
                <CheckBoxOutlined htmlColor="#3855FE" />
              ) : (
                <CheckBoxOutlineBlank htmlColor="#DADADA" />
              )
            }
            checked={checked}
            onClick={e => e.stopPropagation()} // not duplicate select
            onChange={() => onCheckboxChange(option)}
          />
          {option.name}
        </li>
      );
    },
    [form.dealerships, onCheckboxChange]
  );

  const handleSelectDealerships = (e: React.SyntheticEvent, val: TOption[]) => {
    setFormIsChecked(false);

    // clean Select All from values
    const filtered = val.filter(o => o.name !== 'Select all');
    setEmployeeForm(prev => ({ ...prev, dealerships: filtered }));
  };

  return (
    <Autocomplete
      multiple
      fullWidth
      classes={multipleACSClasses}
      options={options}
      getOptionLabel={option => option.name}
      isOptionEqualToValue={(o, v) => o.value === v.value}
      disableClearable
      disableCloseOnSelect
      sx={{
        '& .MuiAutocomplete-inputRoot': {
          flexWrap: 'nowrap',
          padding: '0',
        },
      }}
      renderOption={makeRenderDealershipGroupOption()}
      value={form.dealerships}
      onChange={handleSelectDealerships}
      renderTags={(selected, getTagProps) =>
        // show real elements, without Select All
        renderChipTagsForDealership(
          selected.filter(o => o.name !== 'Select all'),
          getTagProps
        )
      }
      renderInput={autocompleteRender({
        label: isAdding ? 'Dealership group *' : 'Dealership group',
        placeholder: form.dealerships.length ? '' : 'Search Dealership group',
        error: isAdding ? !form.dealerships.length && formIsChecked : false,
      })}
    />
  );
};

export default AddDealershipGroupForm;
