import React, { useEffect, useState } from 'react';
import {
  DialogTitle,
  BaseModal,
  DialogContent,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button } from '@mui/material';
import { ButtonsWrapper, TopWrapper } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import {
  ISVZoneDefaultOpsCode,
  TZonesOpsCodesRequest,
} from '../../../../store/reducers/capacityServiceValet/types';
import { loadAllAssignedServiceRequests } from '../../../../store/reducers/serviceRequests/actions';
import { ZonesWrapper } from './styles';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { loadServiceValetZones } from '../../../../store/reducers/serviceValet/actions';
import { Loading } from '../../../../components/wrappers/Loading/Loading';
import OpsCodeInput from './OpsCodeInput/OpsCodeInput';
import {
  loadCenterSettings,
  updateServiceValetZonesOpsCodes,
} from '../../../../store/reducers/capacityServiceValet/actions';
import {
  loadMobServiceZones,
  loadMobileServiceCenterSettings,
} from '../../../../store/reducers/mobileService/actions';

type TProps = {
  onClose: () => void;
  open: boolean;
  serviceType: string;
};

const ZonesOpsCodeModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  onClose,
  open,
  serviceType,
}) => {
  const { centerSettings } = useSelector((state: RootState) =>
    serviceType === 'PickUpDropOff' ? state.capacityServiceValet : state.mobileService
  );
  const { zones, isLoading } = useSelector((state: RootState) =>
    serviceType === 'PickUpDropOff' ? state.serviceValet : state.mobileService
  );
  const [zonesOpsCodes, setZonesOpsCodes] = useState<ISVZoneDefaultOpsCode[]>([]);
  const [formChecked, setFormChecked] = useState<boolean>(false);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadAllAssignedServiceRequests(selectedSC.id));
      if (serviceType === 'PickUpDropOff') {
        dispatch(loadServiceValetZones(selectedSC.id));
      }
      if (serviceType === 'MobileService') {
        dispatch(loadMobServiceZones(selectedSC.id));
      }
    }
  }, [selectedSC, serviceType, dispatch]);

  useEffect(() => {
    if (centerSettings?.zoneServiceRequests) {
      setZonesOpsCodes(centerSettings.zoneServiceRequests);
    }
  }, [centerSettings]);

  const onCancel = () => {
    setFormChecked(false);
    setZonesOpsCodes(centerSettings?.zoneServiceRequests ?? []);
    onClose();
    if (selectedSC) {
      if (serviceType === 'PickUpDropOff') {
        dispatch(loadServiceValetZones(selectedSC.id));
        dispatch(loadCenterSettings(selectedSC.id));
      }
      if (serviceType === 'MobileService') {
        dispatch(loadMobServiceZones(selectedSC.id));
        dispatch(loadMobileServiceCenterSettings(selectedSC.id));
      }
    }
  };
  const onSave = () => {
    setFormChecked(true);
    if (selectedSC) {
      if (zonesOpsCodes.length) {
        const data: TZonesOpsCodesRequest[] = zonesOpsCodes.map(el => ({
          zoneId: el.zone.id,
          serviceRequestId: el?.serviceRequest?.id,
        }));
        dispatch(
          updateServiceValetZonesOpsCodes(selectedSC.id, serviceType, data, onCancel, showError)
        );
      } else {
        showError('All Service Valet Zones should have assigned Op Code');
      }
    }
  };

  return (
    <BaseModal onClose={onCancel} open={open} width={425}>
      <DialogTitle>
        <TopWrapper>
          {serviceType === 'PickUpDropOff' ? 'Service Valet Op Code' : 'Mobile Service Op Code'}
          <ButtonsWrapper>
            <Button
              variant="text"
              onClick={onCancel}
              color="secondary"
              style={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="text"
              onClick={onSave}
              color="primary"
              style={{ textTransform: 'none' }}
            >
              Save
            </Button>
          </ButtonsWrapper>
        </TopWrapper>
      </DialogTitle>
      <DialogContent>
        <ZonesWrapper>
          {isLoading ? (
            <Loading />
          ) : (
            [...zones]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(zone => (
                <OpsCodeInput
                  formChecked={formChecked}
                  setFormChecked={setFormChecked}
                  key={zone.id}
                  zone={zone}
                  zonesOpsCodes={zonesOpsCodes}
                  setZonesOpsCodes={setZonesOpsCodes}
                />
              ))
          )}
        </ZonesWrapper>
      </DialogContent>
    </BaseModal>
  );
};

export default ZonesOpsCodeModal;
