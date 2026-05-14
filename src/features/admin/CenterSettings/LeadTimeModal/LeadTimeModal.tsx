import React, { useEffect } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { TopWrapperDouble } from '../styles';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { Button } from '@mui/material';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { updateServiceValetSettings } from '../../../../store/reducers/capacityServiceValet/actions';

const LeadTimeModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = ({
  ...props
}) => {
  const { centerSettings } = useSelector((state: RootState) => state.capacityServiceValet);
  const [leadTime, setLeadTime] = React.useState<number | null>(null);
  const [error, setError] = React.useState<boolean>(false);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();

  const handleClose = () => {
    props.onClose();
    setError(false);
  };

  useEffect(() => {
    if (centerSettings?.appointmentLeadDays && centerSettings?.appointmentLeadDays !== null)
      setLeadTime(centerSettings?.appointmentLeadDays);
  }, [props.open, centerSettings?.appointmentLeadDays]);

  const onSave = () => {
    if (!selectedSC || leadTime === null) return;
    if (leadTime > 99 || leadTime < 1) {
      setError(true);
      return;
    }
    dispatch(
      updateServiceValetSettings(selectedSC?.id, { appointmentLeadDays: leadTime }, () =>
        handleClose()
      )
    );
  };

  return (
    <BaseModal {...props} onClose={handleClose} width={355}>
      <DialogTitle onClose={handleClose}>
        <TopWrapperDouble>
          <span>Appointment Lead Time</span>
          <span>From Current Date</span>
        </TopWrapperDouble>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          onFocus={() => setError(false)}
          type="number"
          inputProps={{ min: 1, max: 99 }}
          label="Days"
          placeholder=""
          onChange={e => setLeadTime(+e.target.value)}
          value={leadTime}
          error={error}
        />
        {error && (
          <span style={{ color: 'red', fontSize: '12px' }}>
            The number of days must be between 1 and 99 inclusive.
          </span>
        )}
      </DialogContent>
      <DialogActions>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button onClick={handleClose} color="info">
            Cancel
          </Button>
          <Button onClick={onSave} variant="contained" color="primary">
            Save
          </Button>
        </div>
      </DialogActions>
    </BaseModal>
  );
};

export default LeadTimeModal;
