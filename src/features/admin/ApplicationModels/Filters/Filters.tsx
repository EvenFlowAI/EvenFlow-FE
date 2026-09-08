import React from 'react';
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
  onMakesChange: (e: React.ChangeEvent<{}>, options: IGlobalMake[]) => void;
  onStatusChange: (e: React.ChangeEvent<{}>, option: TReviewOption | null) => void;
  onModelsChange: (e: React.ChangeEvent<{}>, option: IGlobalModel[]) => void;
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

  const renderModelOption = (props: any, option: IGlobalModel) => {
    return (
      <li style={{ height: 'fit-content' }} key={option} {...props}>
        {option.vinModel}
      </li>
    );
  };

  const renderMakeOption = (props: any, option: IGlobalMake) => {
    return (
      <li style={{ height: 'fit-content' }} key={option} {...props}>
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
        disabled={disabled || isLoading}
        options={allMakesOptions}
        renderOption={renderMakeOption}
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
            400,
            option => {
              return option;
            }
          )
        }
        renderInput={autocompleteRender({
          label: 'Makes',
          placeholder: selectedMakes?.length ? '' : 'Not selected',
        })}
      />
      <Autocomplete
        loading={isLoading}
        disabled={disabled || isLoading || !selectedMakes.length}
        value={selectedModel}
        options={modelsOptions}
        multiple
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
            400,
            option => {
              return option;
            }
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
