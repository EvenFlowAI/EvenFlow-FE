import React from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DialogActions } from '../../../components/modals/BaseModal/BaseModal';
import { TCallback } from '../../../types/types';

type TProps = {
  onCancel: TCallback;
  onNext: TCallback;
  nextButtonIsDisabled: boolean;
};

const SwitchFlowModalActions: React.FC<TProps> = ({ onCancel, onNext, nextButtonIsDisabled }) => {
  const { t } = useTranslation();

  return (
    <DialogActions style={{ padding: '32px 36px 25px 36px' }}>
      <Button variant="outlined" onClick={onCancel} style={{ width: 145 }}>
        {t('Cancel')}
      </Button>
      <Button
        variant="contained"
        onClick={onNext}
        style={{ width: 145, marginLeft: 16 }}
        disabled={nextButtonIsDisabled}
      >
        {t('Next')}
      </Button>
    </DialogActions>
  );
};

export default SwitchFlowModalActions;
