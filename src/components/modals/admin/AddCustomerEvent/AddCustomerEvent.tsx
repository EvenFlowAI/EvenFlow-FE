import React, { useState } from 'react';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { TextField } from '../../../formControls/TextFieldStyled/TextField';
import { Button } from '@mui/material';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import {
  createCustomerEvent,
  setNewEventName,
} from '../../../../store/reducers/dealerOperations/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../hooks/useException/useException';
import { Loading } from '../../../wrappers/Loading/Loading';

type TAddCustomerEventModalProps = DialogProps & {};

const AddCustomerEventModal = ({ onClose, open }: TAddCustomerEventModalProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedSC } = useSCs();
  const { newEventName } = useSelector((state: RootState) => state.dealerOperations);
  const showError = useException();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEventNameValue = e.target?.value;
    if (newEventNameValue.length < 51) {
      dispatch(setNewEventName(newEventNameValue));
    }
  };

  const onError = () => {
    showError('Event name is already used. Please enter a unique name.');
    setIsLoading(false);
  };

  const handleSaveNewEvent = () => {
    if (!selectedSC?.id) {
      throw new Error('Selected SC is not defined');
    }

    if (newEventName?.length > 2 && newEventName?.length < 51) {
      setIsLoading(true);
      dispatch(
        createCustomerEvent(
          { serviceCenterId: selectedSC?.id, name: newEventName.trim() },
          () => {
            onClose();
            setIsLoading(false);
          },
          onError
        )
      );
    }
  };

  return (
    <BaseModal open={open} width={602} onClose={onClose}>
      <DialogTitle onClose={onClose}>Please enter the name of the new event</DialogTitle>
      {isLoading ? (
        <Loading />
      ) : (
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
          <span
            style={{
              textAlign: 'right',
              width: '100%',
              display: 'block',
              color: 'rgb(133, 133, 133)',
              marginTop: '4px',
            }}
          >
            Approximate Characters: {newEventName.length} / 50
          </span>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} color="info">
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSaveNewEvent}
          disabled={newEventName.trim().length < 3}
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
