import React from 'react';
import { Button, Divider, Grid } from '@mui/material';
import { AvatarUpload } from '../../../../components/formControls/AvatarUpload/AvatarUpload';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';
import { TForm } from './types';

type TCurrentUserView = {
  avatarPath?: string;
  fullName: string;
  role: string;
  email: string;
};

type TProps = {
  currentUser: TCurrentUserView;
  isSM: boolean;
  isEdit: boolean;
  saving: boolean;
  form: TForm;
  avatarContainerClassName: string;
  titleClassName: string;
  editButtonContainerClassName: string;
  centerButtonClassName: string;
  dividerClassName: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeAvatar: (file: File) => void;
};

export const DealerOwnerProfileSection: React.FC<React.PropsWithChildren<TProps>> = ({
  currentUser,
  isSM,
  isEdit,
  saving,
  form,
  avatarContainerClassName,
  titleClassName,
  editButtonContainerClassName,
  centerButtonClassName,
  dividerClassName,
  onStartEdit,
  onCancelEdit,
  onSave,
  onChange,
  onChangeAvatar,
}) => {
  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={3}>
          <div className={avatarContainerClassName}>
            <AvatarUpload onChange={onChangeAvatar} dataUrl={currentUser.avatarPath} />
            <span className={titleClassName}>{currentUser.fullName}</span>
          </div>
        </Grid>
        <Grid item xs={1} hidden={isSM} />
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            label="Role"
            name="role"
            id="role"
            disabled
            value={currentUser.role}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            id="email"
            disabled
            value={currentUser.email}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3} className={editButtonContainerClassName}>
          {!isEdit ? (
            <Button
              className={centerButtonClassName}
              variant="contained"
              color="primary"
              onClick={onStartEdit}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                style={{ marginRight: 10 }}
                className={centerButtonClassName}
                color="info"
                onClick={onCancelEdit}
              >
                Cancel
              </Button>
              <LoadingButton
                fullWidth={false}
                loading={saving}
                className={centerButtonClassName}
                color="primary"
                onClick={onSave}
                variant="contained"
              >
                Save
              </LoadingButton>
            </>
          )}
        </Grid>
      </Grid>
      <Divider className={dividerClassName} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="First name"
            name="firstName"
            id="firstName"
            disabled={!isEdit}
            value={form.firstName}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={1} hidden={isSM} />
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Last name"
            name="lastName"
            id="lastName"
            disabled={!isEdit}
            value={form.lastName}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Phone number"
            name="phoneNumber"
            id="phoneNumber"
            disabled={!isEdit}
            value={form.phoneNumber}
            onChange={onChange}
          />
        </Grid>
      </Grid>
      <Divider className={dividerClassName} />
    </>
  );
};
