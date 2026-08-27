import React, { useEffect, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useDispatch } from 'react-redux';
import { saveEmployeeAvatar, updateUser } from '../../../../store/reducers/users/actions';
import { validatePhoneNumber } from '../../../../utils/utils';
import { useStyles } from './styles';
import { TForm, TPasswordForm } from './types';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useCurrentUser } from '../../../../hooks/useCurrentUser/useCurrentUser';
import { Api } from '../../../../api/ApiEndpoints/ApiEndpoints';
import { blankProfile, initialPasswordForm } from './constants';
import { Roles } from '../../../../types/types';
import { DealerOwnerProfileSection } from './DealerOwnerProfileSection';
import { PasswordSection } from './PasswordSection';

export const UserProfile = () => {
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditPassword, setEditPassword] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [form, setForm] = useState<TForm>(blankProfile);
  const [passwordForm, setPasswordForm] = useState<TPasswordForm>(initialPasswordForm);
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();
  const { classes } = useStyles();
  const theme = useTheme();
  const isSM = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (currentUser) {
      setForm({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phoneNumber: currentUser.phoneNumber,
      });
    }
  }, [currentUser]);

  const handleCancel = () => {
    setEdit(false);
    setForm(({ ...currentUser } as TForm) || blankProfile);
  };

  const cancelPasswordEdit = () => {
    setPasswordForm(initialPasswordForm);
    setEditPassword(false);
  };

  const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (name === 'phoneNumber') {
      value = validatePhoneNumber(value);
    }
    setForm({ ...form, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleChangeAvatar = async (f: File) => {
    if (!currentUser) {
      showError('Profile is not loaded');
    } else {
      await dispatch(
        saveEmployeeAvatar(f, currentUser.id, showError, () => showMessage('Avatar updated'))
      );
    }
  };

  const onSuccess = () => showMessage('Profile updated');

  const handleSave = async () => {
    if (currentUser) {
      setSaving(true);
      try {
        await dispatch(
          updateUser({ ...currentUser, ...form }, currentUser.id, onSuccess, showError)
        );

        setEdit(false);
        setSaving(false);
      } catch (e) {
        showError(e);
        setSaving(false);
      }
    } else {
      showError('Profile is not loaded');
    }
  };

  const handlePasswordSave = async () => {
    if (!passwordForm.oldPassword) {
      showError('Please type old password');
    } else if (!passwordForm.newPassword) {
      showError('Please type new password');
    } else if (passwordForm.newPassword !== passwordForm.repeatPassword) {
      showError('Passwords do not match');
    } else {
      setSaving(true);
      try {
        await Api.call(Api.endpoints.Accounts.Change, { data: passwordForm });
        setSaving(false);
        setPasswordForm(initialPasswordForm);
        setEditPassword(false);
        showMessage('Password saved');
      } catch (e) {
        showError(e);
        setSaving(false);
      }
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className={classes.container}>
      {currentUser.role === Roles.DealerOwner ? (
        <DealerOwnerProfileSection
          currentUser={currentUser}
          isSM={isSM}
          isEdit={isEdit}
          saving={saving}
          form={form}
          avatarContainerClassName={classes.avatarContainer}
          titleClassName={classes.title}
          editButtonContainerClassName={classes.editButtonContainer}
          centerButtonClassName={classes.centerButton}
          dividerClassName={classes.divider}
          onStartEdit={() => setEdit(true)}
          onCancelEdit={handleCancel}
          onSave={handleSave}
          onChange={handleChange}
          onChangeAvatar={handleChangeAvatar}
        />
      ) : null}

      <PasswordSection
        isSM={isSM}
        isEditPassword={isEditPassword}
        saving={saving}
        passwordForm={passwordForm}
        editButtonContainerClassName={classes.editButtonContainer}
        centerButtonClassName={classes.centerButton}
        onStartEditPassword={() => setEditPassword(true)}
        onCancelEditPassword={cancelPasswordEdit}
        onSavePassword={handlePasswordSave}
        onPasswordChange={handlePasswordChange}
      />
    </div>
  );
};
