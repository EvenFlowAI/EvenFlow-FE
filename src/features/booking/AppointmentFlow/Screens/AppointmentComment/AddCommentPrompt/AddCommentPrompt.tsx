import React from 'react';
import { BaseModal, DialogTitle } from '../../../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../../../components/modals/BaseModal/types';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '../../../../../../components/buttons/LoadingButton/LoadingButton';
import { BfButtonsWrapper } from '../../../../../../components/styled/BfButtonsWrapper';

type TAskAddServiceProps = DialogProps & {
  onClose: () => void;
};

const AddCommentPrompt = (props: TAskAddServiceProps) => {
  const { t } = useTranslation();

  return (
    <BaseModal width={400} open={props.open} onClose={props.onClose}>
      <DialogTitle onClose={props.onClose}>
        {t(
          'In order for us to be better prepared for your appointment, please leave a brief description of your concern.'
        )}
      </DialogTitle>
      <BfButtonsWrapper>
        <LoadingButton loading={false} onClick={props.onClose} color="primary" variant="outlined">
          {t('Close')}
        </LoadingButton>
      </BfButtonsWrapper>
    </BaseModal>
  );
};

export default AddCommentPrompt;
