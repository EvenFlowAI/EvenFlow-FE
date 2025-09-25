import React from 'react';
import { DialogProps } from '../../BaseModal/types';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { ReactComponent as WarningIcon } from '../../../../assets/img/warning_icon.svg';
import { Button, Divider } from '@mui/material';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';

type TRemoveRuleModalProps = DialogProps & {
  ruleName: string;
  handleRemoveRule: () => void;
};

const RemoveRule = ({ onClose, open, ruleName, handleRemoveRule }: TRemoveRuleModalProps) => {
  return (
    <BaseModal open={open} width={404} onClose={onClose}>
      <DialogTitle onClose={onClose}></DialogTitle>
      <DialogContent>
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '19px',
            fontWeight: 700,
            width: '80%',
            margin: '0 auto',
            gap: '13px',
          }}
        >
          <WarningIcon />
          <span>
            Please confirm you want to delete{' '}
            <span style={{ textTransform: 'uppercase' }}>{ruleName}</span>?
          </span>
        </p>
        <Divider style={{ margin: '20px 0 6px 0' }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          Cancel
        </Button>
        <LoadingButton onClick={handleRemoveRule} variant="contained" color="error">
          Delete
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};

export default RemoveRule;
