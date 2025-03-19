import React, { useState } from 'react';
import { IServiceCenterForm } from '../../../store/reducers/serviceCenters/types';
import { CreateServiceCenterModal } from '../../../features/admin/ServiceCenters';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import ServiceCentersTable from '../../../features/admin/ServiceCenters/ServiceCentersTable/ServiceCentersTable';
import { ServiceCenterActions } from '../../../features/admin/ServiceCenters';
import { useModal } from '../../../hooks/useModal/useModal';
import { useCurrentUser } from '../../../hooks/useCurrentUser/useCurrentUser';
import { Titles } from '../../../types/types';
import { centerProfileRoot } from '../../../utils/constants';

export const ServiceCenters = () => {
  const [editedItem, setEditedItem] = useState<IServiceCenterForm | undefined>();
  const currentUser = useCurrentUser();
  const { onOpen, onClose, isOpen } = useModal();

  return (
    <>
      {currentUser?.isSuperUser ? (
        <TitleContainer title={Titles.ServiceCenters} actions={<ServiceCenterActions />} pad />
      ) : (
        <TitleContainer
          title={Titles.ServiceCenters}
          parent={centerProfileRoot}
          actions={<ServiceCenterActions />}
          pad
        />
      )}
      <ServiceCentersTable editedItem={editedItem} setEditedItem={setEditedItem} onOpen={onOpen} />
      <CreateServiceCenterModal
        readOnly={currentUser?.isSuperUser}
        open={isOpen}
        onClose={onClose}
        payload={editedItem}
      />
    </>
  );
};
