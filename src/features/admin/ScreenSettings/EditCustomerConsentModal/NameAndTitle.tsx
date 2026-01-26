import React, { Dispatch, SetStateAction } from 'react';
import { Grid } from '@mui/material';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { TForm } from './types';
import { Textarea } from '../../RecallsParts/AddRecallModal/styles';
import { SectionTitle } from './styles';

interface NameAndTitleProps {
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  setForm: Dispatch<SetStateAction<TForm>>;
  form: TForm;
  formIsChecked: boolean;
}

const NameAndTitle = ({ setFormIsChecked, setForm, form, formIsChecked }: NameAndTitleProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormIsChecked(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onMessageChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { value },
  }) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, message: value }));
  };

  return (
    <>
      <Grid item xs={12}>
        <SectionTitle>Consent</SectionTitle>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          id="name"
          name="name"
          label="Consent Name"
          placeholder="Name"
          required
          fullWidth
          error={formIsChecked && !form.name.length}
          onChange={handleChange}
          value={form.name}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          id="title"
          name="title"
          required
          label="Booking Flow Consent Title"
          error={formIsChecked && !form.title.length}
          placeholder="Title"
          fullWidth
          onChange={handleChange}
          value={form.title}
        />
      </Grid>
      <Grid item xs={12}>
        <Textarea
          fullWidth
          multiline
          style={{ marginBottom: 10 }}
          required
          error={formIsChecked && !form.message.length}
          placeholder="Enter Error Message"
          label="Consent Message"
          onChange={onMessageChange}
          value={form.message}
          rows={3}
        />
      </Grid>
    </>
  );
};

export default NameAndTitle;
