import React from 'react';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../components/modals/BaseModal/BaseModal';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { useTranslation } from 'react-i18next';
import { useStyles } from './styles';

type TRecallsLoadingModalProps = {
  open: boolean;
};

const RecallsLoadingModal: React.FC<TRecallsLoadingModalProps> = ({ open }) => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <BaseModal open={open} onClose={() => undefined} width={520} disableEscapeKeyDown>
      <DialogTitle style={{ justifyContent: 'flex-start' }} />
      <DialogContent>
        <div className={classes.wrapper}>
          <div className={classes.loading}>
            <Loading />
          </div>
          <div className={classes.title}>{t('Checking for Open Recalls')}</div>
          <div className={classes.subTitle}>
            {t('One moment please as this may take a few seconds')}
          </div>
        </div>
      </DialogContent>
    </BaseModal>
  );
};

export default RecallsLoadingModal;
