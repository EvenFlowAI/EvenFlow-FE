import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { Autocomplete, Checkbox } from '@mui/material';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { useMultipleACStyles } from '../../../../../features/admin/Transportations/EditTransportationModal/styles';
import { renderChipTagsForDealership } from '../../../../../features/admin/Transportations/EditTransportationModal/layouts/ChipTagRender';
import { TUserAccountForm } from '../types';
import { TOptionForUserAccountServiceCenters } from '../../../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { useStyles } from './styles';

interface CategoryDropdownProps {
  form: TUserAccountForm;
  setEmployeeForm: Dispatch<SetStateAction<TUserAccountForm>>;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
}

// створюємо дефолтний об'єкт для нового сервісного центру
const makeDefaultServiceCenter = (option: TOptionForUserAccountServiceCenters) => ({
  ...option,
  dmsId: null,
  position: '',
});

const AddCategoryDropdown = ({
  form,
  setEmployeeForm,
  setFormIsChecked,
}: CategoryDropdownProps) => {
  const { classes: multipleACSClasses } = useMultipleACStyles();
  const { classes } = useStyles();
  const { serviceCenters } = useSelector((state: RootState) => state.serviceCenters);

  useEffect(() => {
    // залишаємо тільки ті сервісні центри, які належать до актуальних дилершипів
    const validServiceCenters = (form.serviceCenters ?? []).filter(sc =>
      (form.dealerships ?? []).some(d => d.value === sc.categoryId)
    );

    if (validServiceCenters.length !== (form.serviceCenters ?? []).length) {
      setEmployeeForm(prev => ({ ...prev, serviceCenters: validServiceCenters }));
    }
  }, [form.dealerships]);

  // формуємо список опцій
  const baseOptions = serviceCenters
    .filter(sc => (form.dealerships ?? []).some(d => d.value === sc.dealership.id))
    .map(sc => ({
      value: sc.id,
      name: sc.name,
      categoryName: sc.dealership.name,
      categoryId: Number(sc.dealership.id),
      position: '',
    }));

  // додаємо Select all для кожної категорії
  const categoryGroups = Array.from(new Set(baseOptions.map(o => o.categoryName)));
  const options: TOptionForUserAccountServiceCenters[] = categoryGroups
    .flatMap(cat => [
      {
        value: -baseOptions.find(o => o.categoryName === cat)!.categoryId,
        name: 'Select all',
        categoryName: cat,
        categoryId: 0,
        position: '',
      },
      ...baseOptions.filter(o => o.categoryName === cat),
    ])
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));

  const onCheckboxChange = useCallback(
    (option: TOptionForUserAccountServiceCenters & { categoryName?: string }) => {
      const current = form.serviceCenters ?? [];
      let next = [...current];

      if (option.name === 'Select all' && option.value < 0) {
        const category = option.categoryName;
        const categoryOptions = baseOptions.filter(o => o.categoryName === category);

        const allSelected = categoryOptions.every(o => current.some(sel => sel.value === o.value));

        if (allSelected) {
          next = current.filter(sel => sel.categoryName !== category);
        } else {
          const withoutCategory = current.filter(sel => sel.categoryName !== category);
          next = [...withoutCategory, ...categoryOptions.map(o => makeDefaultServiceCenter(o))];
        }
      } else {
        const exists = current.some(o => o.value === option.value);
        next = exists
          ? current.filter(o => o.value !== option.value)
          : [...current, makeDefaultServiceCenter(option)];
      }

      setEmployeeForm(prev => ({ ...prev, serviceCenters: next }));
      setFormIsChecked(false);
    },
    [form.serviceCenters, baseOptions]
  );

  const renderOption = useCallback(
    () =>
      (
        props: React.HTMLAttributes<HTMLLIElement>,
        option: TOptionForUserAccountServiceCenters & { categoryName?: string }
      ) => {
        const selected = form.serviceCenters ?? [];

        let checked;
        if (option.name === 'Select all' && option.value < 0) {
          const category = option.categoryName;
          const categoryOptions = baseOptions.filter(o => o.categoryName === category);
          checked = categoryOptions.every(o => selected.some(sel => sel.value === o.value));
        } else {
          checked = selected.some(item => item.value === option.value);
        }

        return (
          <li
            {...props}
            key={`${option.name}-${option.value}`}
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => onCheckboxChange(option)}
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
              onClick={e => e.stopPropagation()}
              onChange={() => onCheckboxChange(option)}
            />
            {option.name}
          </li>
        );
      },
    [form.serviceCenters, onCheckboxChange, baseOptions]
  );

  const handleChange = (e: React.SyntheticEvent, val: TOptionForUserAccountServiceCenters[]) => {
    setFormIsChecked(false);
    const filtered = val.filter(o => o.name !== 'Select all');
    setEmployeeForm(prev => ({
      ...prev,
      serviceCenters: filtered.map(o => {
        const existing = prev.serviceCenters.find(sc => sc.value === o.value);
        return existing ? existing : makeDefaultServiceCenter(o);
      }),
    }));
  };

  return (
    <Autocomplete
      multiple
      fullWidth
      disabled={baseOptions.length === 0}
      classes={multipleACSClasses}
      sx={{
        '& .MuiAutocomplete-inputRoot': {
          flexWrap: 'nowrap',
          padding: '0 0 0 8px',
        },
        '& .MuiAutocomplete-groupLabel': {
          fontWeight: 'bold',
          textTransform: 'uppercase',
        },
      }}
      options={options}
      groupBy={option => option.categoryName || ''}
      renderGroup={params => (
        <li key={params.key}>
          <div className={classes.categoryWrapper}>{params.group}</div>
          <ul className={classes.category}>{params.children}</ul>
        </li>
      )}
      getOptionLabel={option => option.name}
      isOptionEqualToValue={(o, v) => o.value === v.value}
      disableClearable
      disableCloseOnSelect
      renderOption={renderOption()}
      value={form.serviceCenters}
      onChange={handleChange}
      renderTags={(selected, getTagProps) =>
        renderChipTagsForDealership(
          selected.filter(o => o.name !== 'Select all'),
          getTagProps
        )
      }
      renderInput={autocompleteRender({
        label: 'Service center',
        placeholder: form.serviceCenters.length ? '' : 'Search Service center',
      })}
    />
  );
};

export default AddCategoryDropdown;
