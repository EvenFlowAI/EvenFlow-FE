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
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();

  useEffect(() => {
    if (centerSettings?.appointmentLeadDays && centerSettings?.appointmentLeadDays !== null)
      setLeadTime(centerSettings?.appointmentLeadDays);
  }, [centerSettings?.appointmentLeadDays]);

  const onSave = () => {
    if (!selectedSC || leadTime === null) return;
    dispatch(
      updateServiceValetSettings(selectedSC?.id, { appointmentLeadDays: leadTime }, () =>
        props.onClose()
      )
    );
  };

  return (
    <BaseModal {...props} onClose={props.onClose} width={355}>
      <DialogTitle onClose={props.onClose}>
        <TopWrapperDouble>
          <span>Appointment Lead Time</span>
          <span>From Current Date</span>
        </TopWrapperDouble>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          type="number"
          inputProps={{ min: 0 }}
          label="Days"
          placeholder=""
          onChange={e => setLeadTime(+e.target.value)}
          value={leadTime}
        />
      </DialogContent>
      <DialogActions>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button onClick={props.onClose} color="info">
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
