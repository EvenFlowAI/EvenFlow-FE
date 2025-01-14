import React, { useState } from 'react';
import { API } from '../../../api/api';
import { ForgotPasswordForm } from './ForgotPasswordForm/ForgotPassworfForm';
import { Message } from './ForgotPasswordMessage/ForgotPasswordMessage';
import { useException } from '../../../hooks/useException/useException';

export const ForgotPassword = () => {
  const [showMessage, changeShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, changeEmail] = useState<string>('');
  const showError = useException();

  const handleChangeEmail: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e =>
    changeEmail(e.target.value);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await API.accounts.passwordRecovery({ email });
      setLoading(false);
      changeShow(true);
    } catch (e) {
      showError(e);
      setLoading(false);
    }
  };

  return showMessage ? (
    <Message />
  ) : (
    <ForgotPasswordForm
      loading={loading}
      onChange={handleChangeEmail}
      onSubmit={handleSubmit}
      email={email}
    />
  );
};
