import React from 'react';
import { BaseModal, DialogTitle, DialogContent } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { BfButtonsWrapper } from '../../../styled/BfButtonsWrapper';
import { styled } from '@mui/material';

type ServiceCommentProps = DialogProps & {
  onSave: () => void;
};

export const DialogContentText = styled('div')({
  color: '#202021',
  fontFamily: 'Proxima Nova',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 400,
});

const ServiceComment = (props: ServiceCommentProps) => (
  <BaseModal width={550} open={props.open} onClose={props.onClose}>
    <DialogTitle onClose={props.onClose}></DialogTitle>
    <DialogContent>
      <DialogContentText>
        You added comments to a service that is not selected.
        <br />
        Do you wish to add the service?
      </DialogContentText>
    </DialogContent>
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

export default ServiceComment;
