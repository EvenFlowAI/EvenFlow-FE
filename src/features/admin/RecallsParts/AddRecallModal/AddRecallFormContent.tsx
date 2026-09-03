import React, { useCallback } from 'react';
import { Autocomplete } from '@mui/material';
import { DialogContent } from '../../../../components/modals/BaseModal/BaseModal';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { IMakeExtended, IModel } from '../../../../api/types';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';
import { Textarea } from './styles';
import { TForm } from './types';
import { yearOptions } from './constants';
import Checkbox from '../../../../components/formControls/Checkbox/Checkbox';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { useAutocompleteStyles } from '../../../../hooks/styling/useAutocompleteStyles';

type TProps = {
  form: TForm;
  formIsChecked: boolean;
  makes: IMakeExtended[];
  allAssignedList: IAssignedServiceRequest[];
  onFormChange: React.ChangeEventHandler<HTMLInputElement>;
  onSummaryChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onMakeChange: (e: React.SyntheticEvent, value: IMakeExtended | null) => void;
  onModelChange: (e: React.SyntheticEvent, value: IModel[]) => void;
  onSRChange: (e: React.SyntheticEvent, value: IAssignedServiceRequest | null) => void;
  onYearChange: (
    name: 'yearFrom' | 'yearTo'
  ) => (e: React.SyntheticEvent, value: string | null) => void;
};

export const AddRecallFormContent: React.FC<React.PropsWithChildren<TProps>> = ({
  form,
  formIsChecked,
  makes,
  allAssignedList,
  onFormChange,
  onSummaryChange,
  onMakeChange,
  onModelChange,
  onSRChange,
  onYearChange,
}) => {
  const { classes: autocompleteClasses } = useAutocompleteStyles();

  const renderModelOption = useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: IModel) => {
      const checked = Boolean(form.models.find(el => el.id === option.id));
      return (
        <li style={{ display: 'flex', alignItems: 'center' }} {...props} key={option.id}>
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
          {option.name}
        </li>
      );
    },
    [form.models]
  );

  return (
    <DialogContent>
      <TextField
        style={{ marginBottom: 10 }}
        fullWidth
        label="NHTSA Campaign"
        id="recallCampaignNumber"
        name="recallCampaignNumber"
        placeholder="Type NHTSA Campaign"
        error={formIsChecked && !form.recallCampaignNumber && !form.oemProgram}
        onChange={onFormChange}
        value={form.recallCampaignNumber}
      />
      <TextField
        style={{ marginBottom: 10 }}
        fullWidth
        label="OEM Program"
        id="oemProgram"
        name="oemProgram"
        placeholder="Type OEM Program"
        onChange={onFormChange}
        error={formIsChecked && !form.recallCampaignNumber && !form.oemProgram}
        value={form.oemProgram}
      />
      <Autocomplete
        style={{ marginBottom: 10 }}
        options={makes}
        value={form.make}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={o => o.name}
        onChange={onMakeChange}
        renderInput={autocompleteRender({
          label: 'Make',
          error: formIsChecked && !form.make,
          placeholder: 'Select Make',
        })}
      />
      <Autocomplete
        style={{ marginBottom: 10 }}
        disabled={!form.make}
        options={form.make?.models ?? []}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={o => o.name}
        value={form.models}
        onChange={onModelChange}
        renderOption={renderModelOption}
        multiple
        disableCloseOnSelect
        classes={autocompleteClasses}
        renderInput={autocompleteRender({
          label: 'Model',
          error: formIsChecked && !form.models,
          placeholder: 'Select Model',
        })}
      />
      <Autocomplete
        style={{ marginBottom: 10 }}
        options={yearOptions}
        isOptionEqualToValue={(option, value) => option === value}
        value={form.yearFrom}
        onChange={onYearChange('yearFrom')}
        renderInput={autocompleteRender({
          label: 'Year From',
          placeholder: 'Select Year From',
          error: Boolean(form.yearFrom && form.yearTo && form.yearFrom > form.yearTo),
        })}
      />
      <Autocomplete
        style={{ marginBottom: 10 }}
        options={yearOptions}
        isOptionEqualToValue={(option, value) => option === value}
        value={form.yearTo}
        onChange={onYearChange('yearTo')}
        renderInput={autocompleteRender({
          label: 'Year To',
          placeholder: 'Select Year To',
          error: Boolean(form.yearFrom && form.yearTo && form.yearFrom > form.yearTo),
        })}
      />
      <TextField
        fullWidth
        style={{ marginBottom: 10 }}
        label="Recall Component"
        id="recallComponent"
        name="recallComponent"
        placeholder="Type Recall Component"
        error={formIsChecked && !form.recallComponent}
        onChange={onFormChange}
        value={form.recallComponent}
      />
      <Textarea
        fullWidth
        multiline
        style={{ marginBottom: 10 }}
        error={formIsChecked && !form.recallSummary.length}
        placeholder="Type Recall Summary"
        label="Recall Summary"
        onChange={onSummaryChange}
        value={form.recallSummary}
        rows={3}
      />
      <Autocomplete
        style={{ marginBottom: 10 }}
        options={allAssignedList}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={o => o.serviceRequest.code}
        getOptionKey={o => o.serviceRequest.code + o.id}
        value={form.serviceRequest}
        onChange={onSRChange}
        renderInput={autocompleteRender({
          label: 'Op Code Assignment',
          error: formIsChecked && !form.serviceRequest,
          placeholder: 'Select Op Code Assignment',
        })}
      />
    </DialogContent>
  );
};
