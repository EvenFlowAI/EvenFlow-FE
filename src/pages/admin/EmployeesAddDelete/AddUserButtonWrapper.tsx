import { useStyles } from '../RoleManagement/styles';
import { Button } from '@mui/material';
import React from 'react';

export const AddUserButtonWrapper = ({
  handleAddUserAccount,
  isAdminPanel,
}: {
  handleAddUserAccount: (isEdit: boolean) => void;
  isAdminPanel: boolean;
}) => {
  const { classes } = useStyles();

  return (
    <div style={{ marginBottom: isAdminPanel ? 4 : 16 }} className={classes.buttonWrapper}>
      <Button variant="contained" onClick={() => handleAddUserAccount(false)} color="primary">
        Add employee
      </Button>
    </div>
  );
};
