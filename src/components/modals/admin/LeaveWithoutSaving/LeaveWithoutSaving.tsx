import React from 'react';
import { BaseModal, DialogActions, DialogTitle } from '../../BaseModal/BaseModal';
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
    <BaseModal open={open} width={404} onClose={onClose}>
      <DialogTitle style={{ padding: '10px 0' }}>
        <div className={classes.title}>
          <ReportProblemOutlined fontSize="large" color={'error'} />
          <span>Do you want to continue leaving without saving?</span>
        </div>
        <hr style={{ margin: '0', height: '1px', color: '#EAEBEE', opacity: 0.3 }} />
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
