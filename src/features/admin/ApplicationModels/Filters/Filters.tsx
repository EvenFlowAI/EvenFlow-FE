import React, { SyntheticEvent } from 'react';
import { FiltersWrapper } from './styles';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';
import {
  IGlobalMake,
  IGlobalModel,
  TReviewOption,
} from '../../../../store/reducers/globalVehicles/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useAutocompleteStyles } from '../../../../hooks/styling/useAutocompleteStyles';
import { reviewOptions } from '../../../../utils/constants';
import { renderChipTagsWithoutOptionObject } from '../../Transportations/EditTransportationModal/layouts/ChipTagRender';

type TProps = {
  onMakesChange: (e: SyntheticEvent, options: IGlobalMake[]) => void;
  onStatusChange: (e: SyntheticEvent, option: TReviewOption | null) => void;
  onModelsChange: (e: SyntheticEvent, option: IGlobalModel[]) => void;
  modelsOptions: IGlobalModel[];
  isLoading: boolean;
  selectedMakes: IGlobalMake[];
  selectedModel: IGlobalModel[];
  selectedStatus: TReviewOption | null;
  disabled: boolean;
};

const Filters: React.FC<TProps> = ({
  disabled,
  modelsOptions,
  selectedModel,
  onModelsChange,
  onMakesChange,
  onStatusChange,
  isLoading,
  selectedMakes,
  selectedStatus,
}) => {
  const { allMakesOptions } = useSelector((state: RootState) => state.globalVehicles);
  const { classes } = useAutocompleteStyles();

  const renderModelOption = (props: React.HTMLAttributes<HTMLLIElement>, option: IGlobalModel) => {
    return (
      <li style={{ height: 'fit-content' }} key={option.id} {...props}>
        {option.vinModel}
      </li>
    );
  };

  const renderMakeOption = (props: React.HTMLAttributes<HTMLLIElement>, option: IGlobalMake) => {
    return (
      <li style={{ height: 'fit-content' }} key={option.id} {...props}>
        {option.vinMake}
      </li>
    );
  };

  return (
    <FiltersWrapper>
      <Autocomplete
        loading={isLoading}
        multiple
        classes={classes}
        value={selectedMakes}
        disabled={disabled}
        options={allMakesOptions}
        renderOption={renderMakeOption}
        disableCloseOnSelect
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={o => o.vinMake}
        onChange={onMakesChange}
        sx={{
          '& .MuiAutocomplete-inputRoot': {
            flexWrap: 'nowrap',
          },
        }}
        renderTags={(selected, getTagProps) =>
          renderChipTagsWithoutOptionObject(
            selected.map(item => item.vinMake),
            getTagProps,
            400
          )
        }
        renderInput={autocompleteRender({
          label: 'Makes',
          placeholder: selectedMakes?.length ? '' : 'Not selected',
        })}
      />
      <Autocomplete
        loading={isLoading}
        disabled={disabled || !selectedMakes.length}
        value={selectedModel}
        options={modelsOptions}
        multiple
        disableCloseOnSelect
        renderOption={renderModelOption}
        classes={classes}
        sx={{
          '& .MuiAutocomplete-inputRoot': {
            flexWrap: 'nowrap',
          },
        }}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={o => o.vinModel}
        onChange={onModelsChange}
        renderTags={(selected, getTagProps) =>
          renderChipTagsWithoutOptionObject(
            selected.map(item => item.vinModel),
            getTagProps,
            400
          )
        }
        renderInput={autocompleteRender({
          label: 'Models',
          placeholder: selectedModel?.length ? '' : 'Not selected',
        })}
      />
      <Autocomplete
        loading={isLoading}
        value={selectedStatus}
        options={reviewOptions}
        isOptionEqualToValue={(o, v) => o === v}
        getOptionLabel={o => o}
        onChange={onStatusChange}
        disabled={disabled || isLoading}
        renderInput={autocompleteRender({
          label: 'Review Status',
          placeholder: 'Not selected',
        })}
      />
    </FiltersWrapper>
  );
};

export default Filters;
