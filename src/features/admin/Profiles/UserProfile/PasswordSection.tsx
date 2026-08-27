import React from 'react';
import { Button, Grid } from '@mui/material';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { LoadingButton } from '../../../../components/buttons/LoadingButton/LoadingButton';
import { TPasswordForm } from './types';

type TProps = {
  isSM: boolean;
  isEditPassword: boolean;
  saving: boolean;
  passwordForm: TPasswordForm;
  editButtonContainerClassName: string;
  centerButtonClassName: string;
  onStartEditPassword: () => void;
  onCancelEditPassword: () => void;
  onSavePassword: () => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PasswordSection: React.FC<React.PropsWithChildren<TProps>> = ({
  isSM,
  isEditPassword,
  saving,
  passwordForm,
  editButtonContainerClassName,
  centerButtonClassName,
  onStartEditPassword,
  onCancelEditPassword,
  onSavePassword,
  onPasswordChange,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={4}>
        {!isEditPassword ? (
          <TextField
            disabled
            value="12345678"
            name="oldPasswordB"
            type="password"
            id="oldPasswordB"
            label="Current Password"
            fullWidth
          />
        ) : (
          <TextField
            label="Current Password"
            fullWidth
            value={passwordForm.oldPassword}
            type="password"
            id="oldPassword"
            name="oldPassword"
            onChange={onPasswordChange}
          />
        )}
      </Grid>
      <Grid item xs={1} hidden={isSM} />
      <Grid item xs={12} sm={12} md={7} className={editButtonContainerClassName}>
        {!isEditPassword ? (
          <Button
            color="primary"
            className={centerButtonClassName}
            onClick={onStartEditPassword}
            variant="contained"
          >
            Change Password
          </Button>
        ) : (
          <>
            <Button
              style={{ marginRight: 10 }}
              className={centerButtonClassName}
              color="info"
              onClick={onCancelEditPassword}
            >
              Cancel
            </Button>
            <LoadingButton
              fullWidth={false}
              className={centerButtonClassName}
              color="primary"
              variant="contained"
              onClick={onSavePassword}
              loading={saving}
            >
              Save
            </LoadingButton>
          </>
        )}
      </Grid>
      {isEditPassword ? (
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="New Password"
            fullWidth
            value={passwordForm.newPassword}
            type="password"
            id="newPassword"
            name="newPassword"
            onChange={onPasswordChange}
          />
        </Grid>
      ) : null}
      <Grid item xs={1} hidden={isSM} />
      {isEditPassword ? (
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Repeat Password"
            fullWidth
            value={passwordForm.repeatPassword}
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            onChange={onPasswordChange}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};
