import React from 'react';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';

type TPasswordProps = {
  password: string;
  password2: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export const PasswordForm: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TPasswordProps>>
> = ({ password, password2, onChange }) => {
  return (
    <form autoComplete="new-password" id="new-password-form">
      <TextField
        value={password}
        onChange={onChange}
        name="password"
        spacing="normal"
        id="password"
        type="password"
        autoComplete="new-password"
        label="New password"
        fullWidth
      />
      <TextField
        value={password2}
        onChange={onChange}
        name="password2"
        id="password2"
        type="password"
        autoComplete="new-password"
        label="Confirm new password"
        fullWidth
      />
    </form>
  );
};
