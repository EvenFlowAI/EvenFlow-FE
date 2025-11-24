import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { upperCase } from '../../../../../../features/admin/MaintenancePackages/AddPackageModal/parts/MakeAndModel/utils';
import { IMake } from '../../../../../../api/types';
import { ApplyToAll } from '../../../../../../features/admin/MaintenancePackages/AddPackageModal/parts/constants';
import Checkbox from '../../../../../../components/formControls/Checkbox/Checkbox';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { Autocomplete } from '@mui/material';
import { autocompleteRender } from '../../../../../../utils/autocompleteRenders';
import { useAutocompleteStyles } from '../../../../../../hooks/styling/useAutocompleteStyles';
import { CriteriaI } from '../../types';

interface RuleMakesProps {
  selectedMakes: number[];
  setSelectedMakes: Dispatch<SetStateAction<number[]>>;
  handleRuleChange: (index: number, field: keyof CriteriaI, newValue: string) => void;
  index: number;
  isEdit: boolean;
}

const RuleMakes = ({
  setSelectedMakes,
  selectedMakes,
  handleRuleChange,
  index,
  isEdit,
}: RuleMakesProps) => {
  const { makes } = useSelector((state: RootState) => state.vehicleDetails);
  const { classes } = useAutocompleteStyles();

  const filteredMakes = useMemo(
    () => makes.filter(item => selectedMakes.includes(item?.id)),
    [makes, selectedMakes]
  );

  const selectedMakeValues = useMemo(() => filteredMakes.map(make => make.name), [filteredMakes]);

  const sortMakes = (a: string, b: string) => {
    return upperCase(selectedMakeValues).includes(a.toUpperCase())
      ? upperCase(selectedMakeValues).includes(b.toUpperCase())
        ? 0
        : -1
      : 1;
  };

  const getSortedMakesOptions = useCallback(
    (makes: IMake[]): string[] => {
      const data: string[] = makes.map(make => make.name).sort(sortMakes);
      if (data.length) data.unshift(ApplyToAll);
      return data;
    },
    [selectedMakeValues]
  );

  const onMakeChange = (e: React.SyntheticEvent, value: string[]) => {
    let updatedMakes: number[] = [];
    if (value.includes(ApplyToAll)) {
      if (makes.length && value.length === makes.length + 1) {
        setSelectedMakes([]);
        updatedMakes = [];
      } else {
        setSelectedMakes(() => makes.map(item => item.id));
        updatedMakes = makes.map(item => item.id);
      }
    } else {
      const selectedMakeIds = value.map(
        make => makes.find(makeFromDB => makeFromDB.name === make)?.id || 0
      );
      updatedMakes = selectedMakeIds;
      setSelectedMakes(selectedMakeIds);
    }
    handleRuleChange(index, 'value', updatedMakes.join(', '));
    handleRuleChange(index, 'operator', 'Equal');
  };

  const renderMakeOption = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: any, option: any) => {
      const currentOptionSelected = upperCase(selectedMakeValues).includes(option.toUpperCase());
      const allSelected = Boolean(
        !makes.find(make => !upperCase(selectedMakeValues).includes(make.name.toUpperCase()))
      );
      const checked = currentOptionSelected || allSelected;
      return (
        <li style={{ display: 'flex', alignItems: 'center' }} {...props} key={option}>
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
          />
          {option}
        </li>
      );
    },
    [makes, selectedMakeValues]
  );

  return (
    <div style={{ width: !isEdit ? '42%' : '39%' }}>
      <Autocomplete
        multiple
        classes={classes}
        disabled={!isEdit}
        options={getSortedMakesOptions(makes)}
        disableCloseOnSelect
        getOptionLabel={o => o ?? null}
        isOptionEqualToValue={(o, v) => o.toLowerCase() === v.toLowerCase()}
        renderOption={renderMakeOption}
        value={selectedMakeValues}
        onChange={onMakeChange}
        renderInput={autocompleteRender({
          label: 'Vehicle Make',
          placeholder: 'Select Vehicle Make',
        })}
      />
    </div>
  );
};

export default RuleMakes;
