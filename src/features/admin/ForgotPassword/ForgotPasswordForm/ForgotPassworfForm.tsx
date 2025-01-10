import React from 'react';
import { LoginContainer } from '../../../../components/styled/LoginContainer';
import { LoginTitle } from '../../../../components/wrappers/LoginTitle/LoginTitle';
import { LoginTextContent } from '../../../../components/wrappers/LoginTextContent/LoginTextContent';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { LoginButton } from '../../../../components/styled/LoginButton';
import { Typography } from '@mui/material';
import { BackLink } from '../../../../components/wrappers/BackLink/BackLink';

import { Routes } from '../../../../routes/constants';

type FormProps = {
  onChange: React.ChangeEventHandler;
  onSubmit: () => void;
  email: string;
  loading?: boolean;
};

export const ForgotPasswordForm = (props: FormProps) => {
  const content =
    'Enter the email you registered with and we will send you a link to reset your password';

  return (
    <LoginContainer>
      <LoginTitle title="Forgot password?" />
      <LoginTextContent content={content} />
      <TextField
        value={props.email}
        onChange={props.onChange}
        label="Email Address"
        fullWidth
        placeholder="TYPE HERE"
      />
      <LoginButton loading={props.loading} fullWidth onClick={props.onSubmit}>
        Send Email
      </LoginButton>
      <Typography variant="body1" style={{ marginTop: 20 }}>
        Back to&nbsp;
        <BackLink to={Routes.Login.Base}>Sign In</BackLink>
      </Typography>
    </LoginContainer>
  );
};
