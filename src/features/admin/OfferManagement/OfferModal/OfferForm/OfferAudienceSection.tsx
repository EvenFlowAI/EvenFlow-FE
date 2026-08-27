import React from 'react';
import { Autocomplete, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import {
  autocompleteOptionsRender,
  autocompleteRender,
} from '../../../../../utils/autocompleteRenders';
import {
  customerPresence,
  dayOfWeek,
  ECustomerPresence,
  EDayOfWeek,
} from '../../../../../store/reducers/offers/types';
import clsx from 'clsx';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { TOfferForm } from '../../types';
import { TEnumMap } from '../../../../../store/reducers/types';
import { useStyles } from './styles';

type TProps = {
  form: TOfferForm;
  formIsChecked: boolean;
  onSelect: (e: SelectChangeEvent<ECustomerPresence>) => void;
  onDOWSelect: (e: React.SyntheticEvent, value: TEnumMap<EDayOfWeek>[]) => void;
};

export const OfferAudienceSection: React.FC<React.PropsWithChildren<TProps>> = ({
  form,
  formIsChecked,
  onSelect,
  onDOWSelect,
}) => {
  const { classes } = useStyles();

  return (
    <div className={clsx(classes.inputContainer, classes.rowContainer)}>
      <div className={classes.innerContainer}>
        <Select
          value={form.customerPresence}
          name="customerPresence"
          fullWidth
          input={<TextField label="Customer Presence" />}
          onChange={onSelect}
        >
          {customerPresence.map(pr => (
            <MenuItem key={pr.id} value={pr.id}>
              {pr.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.divider} style={{ visibility: 'hidden' }}>
        -
      </div>
      <div className={classes.innerContainer}>
        <div className={classes.inputContainer}>
          <Autocomplete
            options={dayOfWeek}
            multiple
            limitTags={2}
            ChipProps={{
              color: 'primary',
              style: { borderRadius: 4 },
              size: 'small',
            }}
            disableCloseOnSelect
            onChange={onDOWSelect}
            isOptionEqualToValue={(o, v) => o.label === v.label}
            getOptionLabel={i => i.label}
            renderOption={autocompleteOptionsRender(e => e.label)}
            loading={false}
            value={form.dayOfWeek}
            renderInput={autocompleteRender({
              label: 'Day of Week',
              fullWidth: true,
              error: formIsChecked && !form.dayOfWeek.length,
            })}
          />
        </div>
      </div>
    </div>
  );
};
