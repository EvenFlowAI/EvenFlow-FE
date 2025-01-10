import React from 'react';
import { Button, CircularProgress } from '@mui/material';

type TSaveEditProps = {
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
  isEdit: boolean;
  isSaving: boolean;
  isLowerCase?: boolean;
  disabled?: boolean;
  withoutPadding?: boolean;
};

export const SaveEditBlock: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TSaveEditProps>>
> = ({ isEdit, isSaving, onEdit, onCancel, onSave, isLowerCase, disabled, withoutPadding }) => {
  if (!isEdit) {
    return (
      <Button
        onClick={onEdit}
        disabled={disabled}
        color="primary"
        style={{
          textTransform: isLowerCase ? 'none' : 'uppercase',
          padding: withoutPadding ? 0 : 'unset',
          minWidth: withoutPadding ? 56 : 'unset',
        }}
      >
        Edit
      </Button>
    );
  } else if (isSaving) {
    return <CircularProgress />;
  }
  return (
    <>
      <Button
        onClick={onCancel}
        color="secondary"
        style={{
          minWidth: withoutPadding ? 56 : 'unset',
          textTransform: isLowerCase ? 'none' : 'uppercase',
          padding: withoutPadding ? 0 : 'unset',
          marginRight: !withoutPadding ? 16 : 'unset',
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        style={{
          minWidth: withoutPadding ? 56 : 'unset',
          textTransform: isLowerCase ? 'none' : 'uppercase',
          padding: withoutPadding ? 0 : 'unset',
        }}
        color="primary"
      >
        Save
      </Button>
    </>
  );
};
