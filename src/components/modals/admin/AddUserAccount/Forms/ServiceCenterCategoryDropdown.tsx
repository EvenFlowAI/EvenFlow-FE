import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { Autocomplete, Checkbox, Tooltip } from '@mui/material';
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
  formIsChecked: boolean;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  isAdding: boolean;
}

// create a new default object for a new service center
const makeDefaultServiceCenter = (option: TOptionForUserAccountServiceCenters) => ({
  ...option,
  dmsId: null,
  position: '',
});

const ServiceCenterCategoryDropdown = ({
  form,
  setEmployeeForm,
  formIsChecked,
  setFormIsChecked,
  isAdding,
}: CategoryDropdownProps) => {
  const { classes: multipleACSClasses } = useMultipleACStyles();
  const { classes } = useStyles();
  const { serviceCenters } = useSelector((state: RootState) => state.serviceCenters);

  useEffect(() => {
    // leave only those service centers that belong to current dealerships
    const validServiceCenters = (form.serviceCenters ?? []).filter(sc =>
      (form.dealerships ?? []).some(d => d.value === sc.categoryId)
    );

    if (validServiceCenters.length !== (form.serviceCenters ?? []).length) {
      setEmployeeForm(prev => ({ ...prev, serviceCenters: validServiceCenters }));
    }
  }, [form.dealerships]);

  // forming option list
  const baseOptions = serviceCenters
    .filter(sc => (form.dealerships ?? []).some(d => d.value === sc.dealership.id))
    .map(sc => ({
      value: sc.id,
      name: sc.name,
      categoryName: sc.dealership.name,
      categoryId: Number(sc.dealership.id),
      position: '',
    }));

  // adding select to every category
  const categoryGroups = Array.from(new Set(baseOptions.map(o => o.categoryName)));
  const options: TOptionForUserAccountServiceCenters[] = categoryGroups
    .flatMap(cat => {
      const catOptions = baseOptions.filter(o => o.categoryName === cat);

      return catOptions.length > 1
        ? [
            {
              value: -catOptions[0].categoryId,
              name: 'Select all',
              categoryName: cat,
              categoryId: 0,
              position: '',
            },
            ...catOptions,
          ]
        : catOptions;
    })
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
            style={{ display: 'flex', alignItems: 'center', height: '34px' }}
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
            {option.name.length > 46 ? (
              <Tooltip placement="top" title={option.name}>
                <span>
                  {option.name.length > 46 ? option.name.slice(0, 42).concat('...') : option.name}
                </span>
              </Tooltip>
            ) : (
              <span>{option.name}</span>
            )}
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
        label: isAdding ? 'Service center *' : 'Service center',
        placeholder: form.serviceCenters.length ? '' : 'Search Service center',
        error: isAdding ? formIsChecked && !form.serviceCenters.length : false,
      })}
    />
  );
};

export default ServiceCenterCategoryDropdown;
