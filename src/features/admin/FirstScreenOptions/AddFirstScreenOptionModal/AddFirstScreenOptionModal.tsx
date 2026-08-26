import React from 'react';
import {
  BaseModal,
  DialogActions,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button } from '@mui/material';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { IFirstScreenOption } from '../../../../store/reducers/serviceTypes/types';
import { AddFirstScreenOptionModalForm } from './AddFirstScreenOptionModalForm';
import { useStyles } from './styles';
import { useAddFirstScreenOptionModal } from './useAddFirstScreenOptionModal';

type TAddFirstScreenOptionProps = DialogProps & {
  editingItem: IFirstScreenOption | null;
};

export const AddFirstScreenOptionModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddFirstScreenOptionProps>>
> = ({ editingItem, ...props }) => {
  const { classes } = useStyles();
  const { onCancel, onSave, formProps } = useAddFirstScreenOptionModal({
    editingItem,
    open: props.open,
    onClose: props.onClose,
  });

  return (
    <BaseModal {...props} width={1128} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>
        {editingItem ? 'Edit' : 'Add'} First Screen Option
      </DialogTitle>
      <AddFirstScreenOptionModalForm
        {...formProps}
        classNames={{
          inputsWrapper: classes.inputsWrapper,
          twoInputsWrapper: classes.twoInputsWrapper,
        }}
      />
      <DialogActions>
        <Button onClick={onCancel} className={classes.cancelButton}>
          Cancel
        </Button>
        <Button onClick={onSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </BaseModal>
  );
};
