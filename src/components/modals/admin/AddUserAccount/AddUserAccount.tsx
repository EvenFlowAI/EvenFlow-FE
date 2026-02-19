import React, { useEffect, useState } from 'react';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { Button } from '@mui/material';
import { AvatarWrapper } from '../../../wrappers/AvatarWrapper/AvatarWrapper';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { AddUserAccountForm } from './Forms/AddUserAccountForm';
import { TUserAccountForm } from './types';
import { initialUserAccountForm } from './data';
import { DialogProps } from '../../BaseModal/types';

export const AddUserAccount: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps<TUserAccountForm | null>>>
> = ({ payload, ...props }) => {
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const [userForm, setUserForm] = useState<TUserAccountForm>(initialUserAccountForm);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | undefined>();

  useEffect(() => {
    if (payload) {
      setUserForm(payload);
    }
  }, [payload]);

  const onClose = () => {
    setUserForm(initialUserAccountForm);
    setFormIsChecked(false);
    props.onClose();
  };

  const handleCreate = async () => {
    console.log('form', userForm);
    console.log('avatar', avatar);
    setLoading(false);
  };

  return (
    <BaseModal {...props} width={940} onClose={onClose}>
      <DialogTitle onClose={onClose}>Add User Account</DialogTitle>
      <DialogContent>
        <AvatarWrapper onChange={f => setAvatar(f)} dataUrl={payload?.avatarPath} />
        <AddUserAccountForm
          formIsChecked={formIsChecked}
          form={userForm}
          setFormIsChecked={setFormIsChecked}
          setEmployeeForm={setUserForm}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          loading={isLoading}
          color="primary"
          onClick={handleCreate}
          variant="contained"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};
