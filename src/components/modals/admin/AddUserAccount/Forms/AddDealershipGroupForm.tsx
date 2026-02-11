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
}

const AddDealershipGroupForm = ({
  form,
  setEmployeeForm,
  setFormIsChecked,
}: DealershipGroupProps) => {
  const { classes: multipleACSClasses } = useMultipleACStyles();

  const { dealershipList } = useSelector((state: RootState) => state.dealershipGroups);

  const allOptions: TOption[] = dealershipList.map(d => ({
    value: d.id,
    name: d.name,
  }));

  const options: TOption[] = [{ value: 0, name: 'Select all' }, ...allOptions];

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

        // якщо всі вибрані вручну → додаємо всі
        if (next.length === allOptions.length) {
          next = [...allOptions];
        }
      }

      setEmployeeForm(prev => ({ ...prev, dealerships: next }));
      setFormIsChecked(false);
    },
    [form.dealerships]
  );

  const makeRenderDayOption = useCallback(
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
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={() => onCheckboxChange(option)} // додано
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
            onClick={e => e.stopPropagation()} // щоб не дублювати вибір
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
    // тут прибираємо Select all із value, щоб він не з'являвся як тег
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
      renderOption={makeRenderDayOption()}
      value={form.dealerships}
      onChange={handleSelectDealerships}
      renderTags={(selected, getTagProps) =>
        // показуємо тільки реальні елементи, без Select all
        renderChipTagsForDealership(
          selected.filter(o => o.name !== 'Select all'),
          getTagProps
        )
      }
      renderInput={autocompleteRender({
        label: 'Dealership group',
        placeholder: form.dealerships.length ? '' : 'Search Dealership group',
      })}
    />
  );
};

export default AddDealershipGroupForm;
