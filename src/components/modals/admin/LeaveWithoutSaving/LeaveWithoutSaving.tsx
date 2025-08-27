import React from 'react';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { Button } from '@mui/material';
import { useStyles } from './styles';
import { ReportProblemOutlined } from '@mui/icons-material';

interface LeaveWithoutSavingI {
  onClose: () => void;
  open: boolean;
  handleLeave?: () => void;
}

const LeaveWithoutSaving = ({ onClose, open, handleLeave }: LeaveWithoutSavingI) => {
  const { classes } = useStyles();

  return (
    <BaseModal open={open} width={520} onClose={onClose}>
      <DialogTitle>
        <div className={classes.title}>
          <ReportProblemOutlined fontSize="large" color={'error'} />
          <span>Do you want to continue leaving without saving?</span>
        </div>
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="info">
          Cancel
        </Button>
        <Button onClick={handleLeave} color="error" variant="contained">
          Do Not Save
        </Button>
      </DialogActions>
    </BaseModal>
  );
};

export default LeaveWithoutSaving;
