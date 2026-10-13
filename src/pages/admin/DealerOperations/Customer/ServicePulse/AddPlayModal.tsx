import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../../hooks/useException/useException';
import { DialogProps } from '../../../../../components/modals/BaseModal/types';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../../components/modals/BaseModal/BaseModal';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { LoadingButton } from '../../../../../components/buttons/LoadingButton/LoadingButton';

type TAddPlayModalProps = DialogProps & {
  serviceBookName: string;
};

const AddPlayModal = ({ onClose, open, serviceBookName }: TAddPlayModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedSC } = useSCs();
  const showError = useException();
  const [newPlay, setNewPlay] = useState<string>('');

  useEffect(() => {
    setNewPlay('');
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEventNameValue = e.target?.value;
    if (newEventNameValue.length < 51) {
      setNewPlay(newEventNameValue);
    }
  };

  // const onError = () => {
  //   showError(
  //     `Recall alert name "${normalizeWhitespace(newPlay)}" is already used. Please enter a unique name.`
  //   );
  //   setIsLoading(false);
  // };

  const handleSaveNewEvent = () => {
    if (!selectedSC?.id) {
      showError('Service center is not selected.');
      return;
    }

    if (newPlay?.length > 2 && newPlay?.length < 51) {
      setIsLoading(true);
      console.log('click create');
    }
  };

  return (
    <BaseModal open={open} width={602} onClose={onClose}>
      <DialogTitle onClose={onClose}>Add Play - {serviceBookName}</DialogTitle>
      {isLoading ? (
        <Loading />
      ) : (
        <DialogContent>
          <TextField
            id="play"
            name="play"
            label="Play Name"
            placeholder="Enter play name"
            fullWidth
            onChange={handleChange}
            value={newPlay}
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
            Approximate Characters: {newPlay.length} / 50
          </span>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} color="info">
          Close
        </Button>
        <LoadingButton
          onClick={handleSaveNewEvent}
          disabled={newPlay.trim().length < 3}
          variant="contained"
          color="primary"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};

export default AddPlayModal;
