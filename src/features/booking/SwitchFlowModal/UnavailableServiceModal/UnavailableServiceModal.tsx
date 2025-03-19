import React from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TCallback } from '../../../../types/types';
import { useStyles } from './styles';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { BfButtonsWrapper } from '../../../../components/styled/BfButtonsWrapper';

type TUnavailableServiceProps = DialogProps & {
  serviceString: string;
  onVisitCenter: TCallback;
  onTryAnotherLocation: TCallback;
};

const UnavailableServiceModal: React.FC<TUnavailableServiceProps> = ({
  serviceString,
  onVisitCenter,
  open,
  onClose,
  onTryAnotherLocation,
}) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  const onVisitCenterClick = () => {
    onVisitCenter();
    onClose();
  };

  return (
    <BaseModal open={open} width={525} onClose={onClose}>
      <DialogTitle onClose={onClose} />
      <DialogContent>
        <div className={classes.info}>
          {t('We are sorry but we do not offer')} {serviceString} {t('to your area')}.{' '}
          {t('Would you like to book an appointment to visit our service center?')}
        </div>
      </DialogContent>
      <BfButtonsWrapper>
        <Button className={classes.button} onClick={onTryAnotherLocation} variant="outlined">
          {t('Try another location')}
        </Button>
        <Button
          className={classes.button}
          onClick={onVisitCenterClick}
          color={'primary'}
          variant="contained"
        >
          {t('Visit Center')}
        </Button>
      </BfButtonsWrapper>
    </BaseModal>
  );
};

export default UnavailableServiceModal;
