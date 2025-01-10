import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { LoginTitle } from '../../../components/wrappers/LoginTitle/LoginTitle';
import { LoginContainer } from '../../../components/styled/LoginContainer';
import { LoginButton } from '../../../components/styled/LoginButton';
import { InvalidLinkMessage } from './InvalidLinkMessage/InvalidLinkMessage';
import { PasswordForm } from './PasswordForm/PasswordForm';

import { useMessage } from '../../../hooks/useMessage/useMessage';
import { useException } from '../../../hooks/useException/useException';
import { Routes } from '../../../routes/constants';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

export const EmailVerification: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<unknown>>
> = () => {
  const [{ password, password2 }, setPassword] = useState({ password: '', password2: '' });
  const { search } = useLocation();
  const showError = useException();
  const showMessage = useMessage();
  const history = useHistory();

  const handleChangePassword: React.ChangeEventHandler<HTMLInputElement> = e => {
    const {
      target: { name, value },
    } = e;
    setPassword({ password, password2, [name]: value });
  };

  const confirmVerification = async () => {
    if (!password || password !== password2) {
      showError(!password ? 'Please type your password' : 'Passwords do not match');
    } else {
      try {
        await Api.call(Api.endpoints.Accounts.Verification, { data: { token, userId, password } });
        showMessage('Password set');
        history.replace(Routes.Login.Base);
      } catch (e) {
        showError(e);
      }
    }
  };

  const params = new URLSearchParams(search);
  const token = params.get('token');
  const userId = params.get('userId');

  return (
    <LoginContainer>
      <LoginTitle title="Set your password" />
      {token && userId ? (
        <>
          <PasswordForm password={password} password2={password2} onChange={handleChangePassword} />
          <LoginButton fullWidth onClick={confirmVerification}>
            Set Password
          </LoginButton>
        </>
      ) : (
        <InvalidLinkMessage />
      )}
    </LoginContainer>
  );
};
