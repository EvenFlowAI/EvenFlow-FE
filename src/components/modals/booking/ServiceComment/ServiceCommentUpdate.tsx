import React from 'react';
import { BaseModal, DialogTitle, DialogContent } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { BfButtonsWrapper } from '../../../styled/BfButtonsWrapper';
import { styled } from '@mui/material';

type ServiceCommentProps = DialogProps & {
  onSave: () => void;
  onCloseX: () => void;
};

export const DialogContentText = styled('div')({
  color: '#202021',
  fontFamily: 'Proxima Nova',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 400,
});

const ServiceCommentUpdate = (props: ServiceCommentProps) => (
  <BaseModal width={550} open={props.open} onClose={props.onCloseX}>
    <DialogTitle onClose={props.onCloseX}>
      You added comments to a service that is not selected.
      <br />
      Do you wish to add the service?
    </DialogTitle>
    <BfButtonsWrapper>
      <LoadingButton loading={false} onClick={props.onClose} color="primary" variant="outlined">
        NO, THANKS
      </LoadingButton>
      <LoadingButton loading={false} onClick={props.onSave} variant="contained" color="primary">
        ADD
      </LoadingButton>
    </BfButtonsWrapper>
  </BaseModal>
);

export default ServiceCommentUpdate;
