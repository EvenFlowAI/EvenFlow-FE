import React, { ReactElement } from 'react';
import { DialogProps } from '../../BaseModal/types';
import { TCallback } from '../../../../types/types';
import { BaseModal, DialogActions, DialogTitle } from '../../BaseModal/BaseModal';
import { Wrapper } from './styles';
import { Button } from '@mui/material';

type TProps = DialogProps & {
  title: string;
  icon?: ReactElement;
  actionButtonText?: string;
  onActionClick?: TCallback;
  width?: number;
};

const Informing: React.FC<TProps> = props => {
  return (
    <BaseModal {...props} width={props.width ?? 550}>
      <DialogTitle
        onClose={props.onClose}
        style={{ padding: '26px 65px 24px 36px', textAlign: 'left', fontSize: 24 }}
      >
        {props.icon ? (
          <Wrapper>
            <div>{props.icon}</div>
            <div>{props.title}</div>
          </Wrapper>
        ) : (
          props.title
        )}
      </DialogTitle>
      <DialogActions>
        {props.actionButtonText && props.onActionClick ? (
          <Button variant="outlined" color="info" onClick={props.onActionClick}>
            {props.actionButtonText}
          </Button>
        ) : null}
        <Button variant="contained" color="info" onClick={props.onClose}>
          Close
        </Button>
      </DialogActions>
    </BaseModal>
  );
};

export default Informing;
