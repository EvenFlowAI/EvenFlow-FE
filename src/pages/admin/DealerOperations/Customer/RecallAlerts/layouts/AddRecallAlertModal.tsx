import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSCs } from '../../../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../../../hooks/useException/useException';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../../../components/modals/BaseModal/BaseModal';
import { Loading } from '../../../../../../components/wrappers/Loading/Loading';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { LoadingButton } from '../../../../../../components/buttons/LoadingButton/LoadingButton';
import { DialogProps } from '../../../../../../components/modals/BaseModal/types';
import { createRecallAlert } from '../../../../../../store/reducers/recall/actions';

type TAddCustomerEventModalProps = DialogProps & {
  tableType: 'workflow' | 'stats';
};

const AddRecallAlertModal = ({ onClose, open, tableType }: TAddCustomerEventModalProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedSC } = useSCs();
  const showError = useException();
  const [newEventName, setNewEventName] = useState<string>('');

  useEffect(() => {
    setNewEventName('');
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEventNameValue = e.target?.value;
    if (newEventNameValue.length < 51) {
      setNewEventName(newEventNameValue);
    }
  };

  const onError = () => {
    showError(`Recall alert name "${newEventName}" is already used. Please enter a unique name.`);
    setIsLoading(false);
  };

  const handleSaveNewEvent = () => {
    if (!selectedSC?.id) {
      showError('Service center is not selected.');
      return;
    }

    if (newEventName?.length > 2 && newEventName?.length < 51) {
      setIsLoading(true);
      dispatch(
        createRecallAlert(
          { serviceCenterId: selectedSC?.id, name: newEventName.trim() },
          tableType,
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
      <DialogTitle onClose={onClose}>Add Alert</DialogTitle>
      {isLoading ? (
        <Loading />
      ) : (
        <DialogContent>
          <TextField
            id="event"
            name="event"
            label="Alert Name"
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
              fontSize: '14px',
            }}
          >
            Approximate Characters: {newEventName.length} / 50
          </span>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} color="info">
          Close
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

export default AddRecallAlertModal;
