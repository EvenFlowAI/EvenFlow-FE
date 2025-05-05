import React, { useEffect, useState } from 'react';
import EligibleCustomerSegment from '../EligibleCustomerSegment/EligibleCustomerSegment';
import Zones from '../Zones/Zones';
import { TZipCode, TZone } from '../../../../store/reducers/mobileService/types';
import AddEditGeographicZone from '../../../../components/modals/admin/EditGeographicZone/AddEditGeographicZone';
import { useDispatch } from 'react-redux';
import {
  loadMobServiceZones,
  removeMobServiceZone,
  removeZipFromMobServiceZone,
} from '../../../../store/reducers/mobileService/actions';
import { setCurrentZone } from '../../../../store/reducers/serviceValet/actions';
import GeographicZonesButtons from '../../../../components/buttons/GeographicZonesButtons/GeographicZonesButtons';
import { EligibleTitle } from '../../../../components/styled/EligibleTitle';
import {
  GeographicZonesWrapper,
  TabHeaderWrapper,
} from '../../../../components/styled/GeographicZonesWrappers';
import { useModal } from '../../../../hooks/useModal/useModal';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';

import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';

type TGeographicZonesProps = {
  onAddZoneOpen: () => void;
};

const GeographicZones: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TGeographicZonesProps>>
> = ({ onAddZoneOpen }) => {
  const [currentZip, setCurrentZip] = useState<TZipCode | null>(null);
  const [selectedZone, setSelectedZone] = useState<TZone | null>(null);
  const { onOpen: onEditZoneOpen, onClose: onEditZoneClose, isOpen: isEditZoneOpen } = useModal();
  const { selectedSC } = useSCs();
  const { askConfirm } = useConfirm();
  const dispatch = useDispatch();
  const showMessage = useMessage();
  const showError = useException();

  useEffect(() => {
    if (selectedSC) dispatch(loadMobServiceZones(selectedSC.id));
  }, [selectedSC]);

  const onError = (err: string) => showError(err);

  const onSuccess = () => showMessage(`Zone removed`);

  const onRemove = () => {
    if (selectedZone?.id && selectedSC) {
      dispatch(setCurrentZone(null));
      dispatch(removeMobServiceZone(selectedZone.id, selectedSC.id, onSuccess, onError));
      setSelectedZone(null);
    }
  };

  const askRemove = () => {
    if (selectedZone) {
      askConfirm({
        onConfirm: onRemove,
        isRemove: true,
        title: `Please confirm you want to remove Zone ${selectedZone.name}`,
      });
    }
  };

  const onRemoveZip = async () => {
    if (selectedZone?.id && selectedSC && currentZip) {
      await dispatch(removeZipFromMobServiceZone(selectedSC.id, currentZip));
    }
  };
  const askRemoveZip = (zone: TZone) => {
    if (currentZip) {
      askConfirm({
        onConfirm: onRemoveZip,
        isRemove: true,
        title: `Please confirm you want to remove Zip code from the ${zone.name}`,
      });
    }
  };

  return (
    <div>
      <TabHeaderWrapper>
        <GeographicZonesButtons
          onEditZoneOpen={onEditZoneOpen}
          onAddZoneOpen={onAddZoneOpen}
          selectedZone={selectedZone}
          askRemove={askRemove}
        />
      </TabHeaderWrapper>
      <EligibleTitle>Eligible Customer Type</EligibleTitle>
      <GeographicZonesWrapper>
        <div style={{ width: '33%' }}>
          <EligibleCustomerSegment />
        </div>
        <Zones
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          onRemoveZip={askRemoveZip}
          setCurrentZip={setCurrentZip}
        />
      </GeographicZonesWrapper>
      <AddEditGeographicZone
        serviceType="mobileService"
        open={isEditZoneOpen}
        onClose={onEditZoneClose}
        isEdit
        zone={selectedZone}
        setCurrentZip={setCurrentZip}
        currentZip={currentZip}
      />
      {/* <RemoveZipCode
        open={isRemoveZipOpen}
        zone={selectedZone}
        onClose={onRemoveZipClose}
        zip={currentZip}
        serviceType="mobileService"
      /> */}
    </div>
  );
};

export default GeographicZones;
