import React from 'react';
import { Autocomplete, Button } from '@mui/material';
import { IMake, IModel } from '../../../../api/types';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { getYearOptions } from '../../../../utils/getDate';
import { TConfigurationQueryForm } from '../types';
import { useStyles } from '../styles';

type TConfigurationQueryProps = {
  form: TConfigurationQueryForm;
  makes: IMake[];
  loading: boolean;
  onChange: (form: TConfigurationQueryForm) => void;
  onSubmit: () => void;
};

const yearOptions = getYearOptions();

export const ConfigurationQuery: React.FC<TConfigurationQueryProps> = ({
  form,
  makes,
  loading,
  onChange,
  onSubmit,
}) => {
  const { classes, cx } = useStyles();
  const models = form.make?.models ?? [];
  const isValid = Boolean(form.make && form.model && form.year);

  const handleMakeChange = (_: React.SyntheticEvent, make: IMake | null) => {
    onChange({ ...form, make, model: null });
  };

  const handleModelChange = (_: React.SyntheticEvent, model: IModel | null) => {
    onChange({ ...form, model });
  };

  const handleYearChange = (_: React.SyntheticEvent, year: string | null) => {
    onChange({ ...form, year });
  };

  return (
    <div className={cx(classes.panel, classes.query)}>
      <p className={cx(classes.headerText, classes.queryHeader)}>Configuration Query</p>
      <div>
        <Autocomplete
          options={makes}
          value={form.make}
          disabled={loading}
          getOptionLabel={option => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={handleMakeChange}
          renderInput={autocompleteRender({
            label: 'Make ',
            placeholder: 'Select make',
            required: true,
          })}
        />
      </div>
      <div>
        <Autocomplete
          options={models}
          value={form.model}
          disabled={loading || !form.make}
          getOptionLabel={option => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={handleModelChange}
          renderInput={autocompleteRender({
            label: 'Model ',
            placeholder: 'Select model',
            required: true,
          })}
        />
      </div>
      <div>
        <Autocomplete
          options={yearOptions}
          value={form.year}
          disabled={loading}
          onChange={handleYearChange}
          renderInput={autocompleteRender({
            label: 'Model Year ',
            placeholder: 'Select year',
            required: true,
          })}
        />
      </div>
      <Button
        className={classes.submitButton}
        variant="contained"
        color="primary"
        disabled={!isValid || loading}
        onClick={onSubmit}
      >
        {loading ? 'Retrieving...' : 'Get Configuration'}
      </Button>
    </div>
  );
};
