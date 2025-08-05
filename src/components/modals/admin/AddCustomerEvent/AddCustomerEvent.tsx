import React from 'react';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { TextField } from '../../../formControls/TextFieldStyled/TextField';
import { Button } from '@mui/material';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';

type TAddCustomerEventModalProps = DialogProps & {
  newEventName: string;
  setNewEventName: (name: string) => void;
  handleSaveNewEvent: () => void;
};

const AddCustomerEventModal = ({
  newEventName,
  setNewEventName,
  handleSaveNewEvent,
  onClose,
  open,
}: TAddCustomerEventModalProps) => {
  const handleClose = () => {
    setNewEventName('');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEventNameValue = e.target?.value;
    setNewEventName(newEventNameValue);
  };

  return (
    <BaseModal open={open} width={602} onClose={handleClose}>
      <DialogTitle onClose={handleClose}>Please enter the name of the new event</DialogTitle>
      <DialogContent>
        <TextField
          id="event"
          name="event"
          label="Event"
          placeholder="Enter name"
          fullWidth
          onChange={handleChange}
          value={newEventName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info">
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSaveNewEvent}
          disabled={newEventName.length < 3}
          variant="contained"
          color="primary"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};

export default AddCustomerEventModal;
