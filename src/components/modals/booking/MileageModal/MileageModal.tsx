import React, { useEffect, useState } from 'react';
import { BaseModal, DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { DialogProps } from '../../BaseModal/types';
import { Autocomplete, Button, useMediaQuery, useTheme } from '@mui/material';
import { TCallback } from '../../../../types/types';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { updateVehicle } from '../../../../store/reducers/appointmentFrameReducer/actions';
import { useTranslation } from 'react-i18next';
import { getCurrentAppointment } from '../../../../store/reducers/appointments/actions';
import { BfButtonsWrapper } from '../../../styled/BfButtonsWrapper';

const MileageModal: React.FC<DialogProps & { onSave: TCallback; isAdminPanel?: boolean }> = ({
  open,
  onClose,
  isAdminPanel,
  onSave,
}) => {
  const { mileage } = useSelector((state: RootState) => state.vehicleDetails);
  const { selectedVehicle } = useSelector((state: RootState) => state.appointmentFrame);
  const { currentAppointment } = useSelector((state: RootState) => state.appointments);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const selectedMileage = mileage.find(
      el => el.value.toString() === selectedVehicle?.mileage?.toString()
    );
    setValue(selectedMileage?.value ? selectedMileage.value?.toString() : '');
  }, [selectedVehicle, mileage]);

  const handleChange = (e: React.ChangeEvent<{}>, option: string) => {
    setValue(option);
  };

  const updateData = async () => {
    isAdminPanel && currentAppointment?.vehicle
      ? await dispatch(
          getCurrentAppointment({
            ...currentAppointment,
            vehicle: { ...currentAppointment.vehicle, mileage: +value },
          })
        )
      : await dispatch(updateVehicle({ mileage: +value }));
  };

  const handleSave = () => {
    updateData().then(onSave);
  };

  const onCancel = () => {
    setValue('');
    onClose();
  };

  return (
    <BaseModal open={open} onClose={() => {}} width={550}>
      <DialogTitle onClose={onCancel}>{t('Please select your estimated mileage')}</DialogTitle>
      <DialogContent>
        <div style={{ margin: '20px auto', width: '70%' }}>
          <Autocomplete
            isOptionEqualToValue={(o, v) => o === v}
            options={mileage.map(item => item.value.toString())}
            onChange={handleChange}
            disableClearable
            autoComplete={true}
            renderInput={autocompleteRender({
              label: t('Estimated mileage'),
              required: true,
              placeholder: `${t('Select')} ${t('Estimated mileage')}`,
            })}
            value={value}
          />
        </div>
      </DialogContent>
      <BfButtonsWrapper>
        <Button onClick={onCancel} variant="outlined" style={isSm ? { marginBottom: 0 } : {}}>
          {t('Cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="info"
          disabled={!value}
          style={isSm ? { order: -1, marginBottom: 12 } : {}}
        >
          {t('Next')}
        </Button>
      </BfButtonsWrapper>
    </BaseModal>
  );
};

export default MileageModal;
