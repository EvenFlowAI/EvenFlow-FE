import React from 'react';
import { Autocomplete } from '@mui/material';
import {
  autocompleteOptionsRender,
  autocompleteRender,
} from '../../../../../utils/autocompleteRenders';
import { customerSegments, ECustomerSegment } from '../../../../../store/reducers/offers/types';
import { EServiceCategoryType, ICategory } from '../../../../../store/reducers/categories/types';
import { TEnumMap } from '../../../../../store/reducers/types';
import { IAssignedServiceRequestShort } from '../../../../../store/reducers/serviceRequests/types';
import { TOfferForm } from '../../types';
import { useStyles } from './styles';

type TProps = {
  form: TOfferForm;
  formIsChecked: boolean;
  srWithAll: IAssignedServiceRequestShort[];
  allCategories: ICategory[];
  onSegmentSelect: (e: React.SyntheticEvent, value: TEnumMap<ECustomerSegment>[]) => void;
  onSRChange: (e: React.SyntheticEvent, value: IAssignedServiceRequestShort[]) => void;
  onCategoryChange: (e: React.SyntheticEvent, value: ICategory[]) => void;
};

export const OfferAutocompleteSection: React.FC<React.PropsWithChildren<TProps>> = ({
  form,
  formIsChecked,
  srWithAll,
  allCategories,
  onSegmentSelect,
  onSRChange,
  onCategoryChange,
}) => {
  const { classes } = useStyles();

  return (
    <>
      <div className={classes.inputContainer}>
        <Autocomplete
          options={srWithAll}
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          onChange={onSRChange}
          getOptionLabel={i => i.code}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={autocompleteOptionsRender(e => e.code)}
          loading={false}
          value={form.serviceRequests}
          renderInput={autocompleteRender({
            label: 'Op Code included',
            fullWidth: true,
            error: formIsChecked && !form.serviceRequests.length,
          })}
        />
      </div>
      <div className={classes.inputContainer}>
        <Autocomplete
          options={allCategories.filter(
            category => category.type === EServiceCategoryType.GeneralCategory
          )}
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          onChange={onCategoryChange}
          getOptionLabel={i => i.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={autocompleteOptionsRender(e => e.name)}
          loading={false}
          value={form.serviceCategories}
          renderInput={autocompleteRender({
            label: 'Service categories included',
            fullWidth: true,
          })}
        />
      </div>
      <div className={classes.inputContainer}>
        <Autocomplete
          options={customerSegments}
          multiple
          limitTags={3}
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          onChange={onSegmentSelect}
          isOptionEqualToValue={(o, v) => o.label === v.label}
          getOptionLabel={i => i.label}
          renderOption={autocompleteOptionsRender(e => e.label)}
          loading={false}
          value={form.customerSegments}
          renderInput={autocompleteRender({
            label: 'Applicable customer segment',
            fullWidth: true,
            error: formIsChecked && !form.customerSegments.length,
          })}
        />
      </div>
    </>
  );
};
