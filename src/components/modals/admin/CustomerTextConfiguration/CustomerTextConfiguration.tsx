import React from 'react';
import { DialogProps } from '../../BaseModal/types';
import { DashboardItemI } from '../../../../store/reducers/dealerOperations/types';
import { BaseModal, DialogActions, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { TextField } from '../../../formControls/TextFieldStyled/TextField';
import { Autocomplete, Button } from '@mui/material';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { Textarea } from '../../../../features/admin/RecallsParts/AddRecallModal/styles';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';

type TCustomerTextConfigurationProps = DialogProps & {
  event: DashboardItemI | null;
  setFromPhoneNumber: (fromPhoneNumber: string) => void;
  fromPhoneNumber: string;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  setTextMessage: (textMessage: string) => void;
  textMessage: string;
  handleSaveText: () => void;
};

const CustomerTextConfiguration = ({
  onClose,
  open,
  event,
  fromPhoneNumber,
  setFromPhoneNumber,
  selectedTag,
  setSelectedTag,
  setTextMessage,
  textMessage,
  handleSaveText,
}: TCustomerTextConfigurationProps) => {
  if (!event) return <></>;

  const tags = ['{{First Name}}', '{{Last Name}}', '{{Make}}'];

  const handleClose = () => {
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromPhoneNumber(e.target.value);
  };

  return (
    <BaseModal open={open} width={602} onClose={handleClose}>
      <DialogTitle onClose={handleClose}>Text Configuration for {event.name}</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ width: '48%' }}>
            <TextField
              id="from"
              name="from"
              fullWidth
              label="From"
              placeholder="Enter phone number"
              onChange={handleChange}
              value={fromPhoneNumber}
            />
          </div>
          <div style={{ width: '48%' }}>
            <Autocomplete
              options={tags}
              isOptionEqualToValue={(option, value) => option === value}
              onChange={(e, value) => {
                setSelectedTag(value || '');
              }}
              value={selectedTag}
              renderInput={autocompleteRender({
                label: 'Tag',
                fullWidth: true,
                placeholder: 'Tag List',
              })}
            />
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <Textarea
            fullWidth
            multiline
            style={{ marginBottom: 4 }}
            // error={formIsChecked && !form.recallSummary.length}
            placeholder="Enter text message"
            label="Text Message"
            onChange={e => {
              setTextMessage(e.target.value);
            }}
            value={textMessage}
            rows={7}
          />
        </div>
        <div
          style={{
            textAlign: 'right',
            color: '#858585',
            fontWeight: 300,
          }}
        >
          <span>Approximate Characters: {textMessage?.trim().length || 0}</span>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="info">
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSaveText}
          disabled={textMessage.length < 3 || fromPhoneNumber.length < 3}
          variant="contained"
          color="primary"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};

export default CustomerTextConfiguration;
