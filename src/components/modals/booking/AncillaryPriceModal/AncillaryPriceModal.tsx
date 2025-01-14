import React from 'react';
import { useDialogStyles } from '../../../../hooks/styling/useDialogStyles';
import { BaseModal, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { EAncillaryType } from '../../../../store/reducers/appointmentFrameReducer/types';
import { TCallback } from '../../../../types/types';
import { useStyles } from './styles';
import { CenteredButtonsWrapper } from '../../../styled/BfButtonsWrapper';
import { Button } from '@mui/material';

type TDisplayAncillaryPriceProps = DialogProps & {
  onNext: TCallback;
  serviceString: string;
  onBack: TCallback;
  backButtonText: string;
};

const AncillaryPriceModal: React.FC<TDisplayAncillaryPriceProps> = ({
  open,
  onClose,
  onNext,
  serviceString,
  onBack,
  backButtonText,
}) => {
  const { ancillaryPrice } = useSelector((state: RootState) => state.appointmentFrame);
  const { classes: dialogClasses } = useDialogStyles();
  const { classes } = useStyles();
  const { t } = useTranslation();
  const price =
    ancillaryPrice?.feeAmount && ancillaryPrice?.feeType === EAncillaryType.Amount
      ? `${ancillaryPrice?.feeAmount.toFixed(2)}`
      : `${ancillaryPrice?.feeAmount}%`;

  const handleBack = () => {
    onBack();
    onClose();
  };

  const onSubmit = () => {
    onNext();
    onClose();
  };

  return (
    <BaseModal
      open={open}
      fullWidth
      style={{ paddingBottom: 20 }}
      onClose={onClose}
      classes={{ root: dialogClasses.root, paper: dialogClasses.dialogPaper }}
      width={700}
    >
      <DialogTitle onClose={onClose} />
      <DialogContent>
        <div className={classes.info}>
          {t('For the location you entered, a convenience fee of')}{' '}
          {ancillaryPrice?.feeType === EAncillaryType.Amount ? '$' : ''}
          {price} {t('will be added to your service bill for the')} {serviceString}.
          <span className={classes.question}>
            {t('Do you wish to proceed with the')} {serviceString}?
          </span>
        </div>
      </DialogContent>
      <CenteredButtonsWrapper>
        <Button onClick={handleBack} variant="outlined" style={{ backgroundColor: '#F7F8FB' }}>
          {backButtonText}
        </Button>
        <Button onClick={onSubmit} variant="contained">
          {`${t('Continue with')} ${serviceString}`}
        </Button>
      </CenteredButtonsWrapper>
    </BaseModal>
  );
};

export default AncillaryPriceModal;
