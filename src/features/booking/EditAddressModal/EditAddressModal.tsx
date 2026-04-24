import React, { useEffect, useMemo, useState } from 'react';
import { DialogProps } from '../../../components/modals/BaseModal/types';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../components/modals/BaseModal/BaseModal';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import UserLocation from '../../../components/UserLocation/UserLocation';
import {
  loadAncillaryPriceByZip,
  setCity,
  setFilteredZipCodes,
  setPoliticalState,
  setStreetName,
  updateAppointmentAddress,
} from '../../../store/reducers/appointmentFrameReducer/actions';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { parseGeoCode } from '../AppointmentFlow/Screens/YourLocation/utils';
import { IAncillaryByZipRequest } from '../../../store/reducers/appointmentFrameReducer/types';
import { useException } from '../../../hooks/useException/useException';
import AncillaryPriceModal from '../SwitchFlowModal/AncillaryPriceModal/AncillaryPriceModal';
import { useModal } from '../../../hooks/useModal/useModal';

type TProps = DialogProps & {};

const EditAddressModal: React.FC<TProps> = ({ open, onClose }) => {
  const { address, zipCode: zipCodeValue } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { scProfile, slotsServiceTypeOptionId } = useSelector(
    (state: RootState) => state.appointment
  );
  const showError = useException();

  const [zip, setZip] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<any>(null);
  const [isAddressValid, setAddressValid] = useState<boolean>(false);
  const {
    isOpen: isAncillaryPriceOpen,
    onOpen: onAncillaryPriceOpen,
    onClose: onAncillaryPriceClose,
  } = useModal();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const nextButtonIsDisabled = useMemo(() => {
    return !isAddressValid;
  }, [isAddressValid]);

  useEffect(() => {
    if (open) {
      if (zip?.length === 5 && userAddress) {
        setAddressValid(true);
      } else {
        setAddressValid(false);
      }
    }
  }, [userAddress, zip, open]);

  useEffect(() => {
    if (open) {
      if (!zip && zipCodeValue) {
        setZip(zipCodeValue);
      }
      if (!userAddress && address) {
        setUserAddress(address);
      }
    }
  }, [open, zipCodeValue, address]);

  const clearData = () => {
    setUserAddress(null);
    setZip(null);
    dispatch(setFilteredZipCodes([]));
  };

  const onCancel = () => {
    onClose();
    setTimeout(() => {
      clearData();
    }, 100);
  };

  const onSuccess = () => {
    if (userAddress?.value?.place_id && userAddress?.label) {
      geocodeByPlaceId(userAddress.value.place_id).then(res => {
        const data = parseGeoCode(
          res[0].address_components,
          userAddress.label,
          userAddress?.structured_formatting?.main_text,
          userAddress?.structured_formatting?.secondary_text
        );
        if (data.city) dispatch(setCity(data.city));
        if (data.state) dispatch(setPoliticalState(data.state));
        if (data.address) dispatch(setStreetName(data.address));
        console.log(data);
        dispatch(
          updateAppointmentAddress({
            address: userAddress,
            zip: zip || '',
            city: data.city,
            state: data.state,
            street: data.address,
          })
        );
        onCancel();
      });
    }
  };

  const handleError = (err?: string) => {
    showError(err);
  };

  const onClickNext = () => {
    if (zip?.length && scProfile) {
      const data: IAncillaryByZipRequest = {
        address: typeof address === 'string' ? address : address.label,
        zipCode: zip,
        serviceCenterId: scProfile?.id,
        serviceTypeOptionId: slotsServiceTypeOptionId,
      };

      dispatch(loadAncillaryPriceByZip(data, onAncillaryPriceOpen, handleError, () => {}));
    }
  };

  return (
    <BaseModal open={open} onClose={onCancel} width={700}>
      <DialogTitle
        onClose={onCancel}
        style={{
          fontSize: 24,
          fontWeight: 600,
          padding: '16px 36px 24px 36px',
          color: '#202021',
          maxWidth: '474px',
          margin: '0 auto',
        }}
      >
        {t('Please confirm your pickup address to continue')}
      </DialogTitle>
      <DialogContent style={{ padding: '0 36px' }}>
        <Grid container>
          <Grid item xs={12}>
            <UserLocation
              zipTitleName="ZIP"
              addressTitleName="Address"
              zip={zip}
              setZip={setZip}
              setAddressValid={setAddressValid}
              userAddress={userAddress}
              disabled={false}
              setUserAddress={setUserAddress}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ padding: '32px 36px 25px 36px' }}>
        <Button variant="outlined" onClick={onCancel} style={{ width: 145 }}>
          {t('Cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onClickNext}
          style={{ width: 145, marginLeft: 16 }}
          disabled={nextButtonIsDisabled}
        >
          {t('Next')}
        </Button>
      </DialogActions>
      <AncillaryPriceModal
        onNext={onSuccess}
        open={isAncillaryPriceOpen}
        onClose={onAncillaryPriceClose}
        serviceString={t('Pick Up / Drop Off')}
      />
    </BaseModal>
  );
};

export default EditAddressModal;
