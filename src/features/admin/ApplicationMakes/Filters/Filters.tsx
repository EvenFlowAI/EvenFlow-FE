import React from 'react';
import { FiltersWrapper } from './styles';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';
import { IGlobalMake, TReviewOption } from '../../../../store/reducers/globalVehicles/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';

import { reviewOptions } from '../../../../utils/constants';
import { useAutocompleteStyles } from '../../../../hooks/styling/useAutocompleteStyles';

type TProps = {
  onMakesChange: (e: React.ChangeEvent<{}>, option: IGlobalMake[]) => void;
  onStatusChange: (e: React.ChangeEvent<{}>, option: TReviewOption) => void;
  isLoading: boolean;
  selectedMake: any;
  selectedStatus: any;
  disabled: boolean;
};

const Filters: React.FC<TProps> = ({
  onMakesChange,
  onStatusChange,
  isLoading,
  selectedMake,
  selectedStatus,
  disabled,
}) => {
  const { allMakesOptions } = useSelector((state: RootState) => state.globalVehicles);
  const { classes } = useAutocompleteStyles();
  return (
    <FiltersWrapper>
      <Autocomplete
        classes={classes}
        style={{ width: 465 }}
        loading={isLoading}
        value={selectedMake}
        disabled={isLoading || disabled}
        options={allMakesOptions}
        multiple
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={o => o.vinMake}
        onChange={onMakesChange}
        renderInput={autocompleteRender({
          label: 'Makes',
          placeholder: 'Not selected',
        })}
      />
      <Autocomplete
        style={{ width: 180 }}
        loading={isLoading}
        disabled={isLoading || disabled}
        value={selectedStatus}
        options={reviewOptions}
        isOptionEqualToValue={(o, v) => o === v}
        getOptionLabel={o => o}
        onChange={onStatusChange}
        renderInput={autocompleteRender({
          label: 'Review Status',
          placeholder: 'Not selected',
        })}
      />
    </FiltersWrapper>
  );
};

export default Filters;
