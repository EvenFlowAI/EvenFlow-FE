import React from 'react';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { EOfferType, offerTypes } from '../../../../../store/reducers/offers/types';
import { TOfferForm } from '../../types';
import { useStyles } from './styles';

type TProps = {
  form: TOfferForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRadio: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  formIsChecked: boolean;
};

export const OfferBasicInfoSection: React.FC<React.PropsWithChildren<TProps>> = ({
  form,
  onChange,
  onRadio,
  formIsChecked,
}) => {
  const { classes } = useStyles();

  return (
    <>
      <div className={classes.inputContainer}>
        <TextField
          fullWidth
          label="Offer title"
          name="offerTitle"
          id="offerTitle"
          error={formIsChecked && !form.offerTitle?.length}
          onChange={onChange}
          value={form.offerTitle || ''}
        />
      </div>
      <div className={classes.inputContainer}>
        <RadioGroup row value={form.offerType} onChange={onRadio} name="offerType">
          {offerTypes.map(ot => (
            <FormControlLabel
              control={<Radio color="primary" />}
              label={ot.label}
              labelPlacement="end"
              key={ot.id}
              value={ot.id}
            />
          ))}
        </RadioGroup>
      </div>
      {form.offerType === EOfferType.FreeService ? (
        <div className={classes.inputContainer}>
          <TextField
            value={form.serviceType || ''}
            name="serviceType"
            id="serviceType"
            label="Service type"
            fullWidth
            onChange={onChange}
          />
        </div>
      ) : (
        <div className={classes.inputContainer}>
          <TextField
            style={{ width: '50%' }}
            label="Offer value"
            onChange={onChange}
            name="offerValue"
            startAdornment={form.offerType === EOfferType.PercentOff ? '%' : '$'}
            id="offerValue"
            type="number"
            inputProps={{ min: 0 }}
            error={formIsChecked && !form.offerValue?.length}
            value={form.offerValue || ''}
          />
        </div>
      )}
    </>
  );
};
