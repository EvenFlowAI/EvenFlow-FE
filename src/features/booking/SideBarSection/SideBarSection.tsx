import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { SideBar } from '../SideBar/SideBar';
import AppointmentNotes from '../AppointmentFlow/Screens/components/AppointmentNotes/AppointmentNotes';
import VehicleRepairHistory from '../../../components/modals/common/VehicleRepairHistory/VehicleRepairHistory';
import { useTranslation } from 'react-i18next';
import CustomerInfo from './CustomerInfo/CustomerInfo';
import { TScreen } from '../../../types/types';
import { RoHistoryLink, SectionWrapper } from './styles';
import { useModal } from '../../../hooks/useModal/useModal';
import { useCurrentUser } from '../../../hooks/useCurrentUser/useCurrentUser';

type TProps = {
  screen: TScreen;
  handleSetScreen: (screen: TScreen) => void;
  isManaging: boolean;
};

const SideBarSection: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  screen,
  handleSetScreen,
  isManaging,
}) => {
  const { scProfile, customerLoadedData } = useSelector((state: RootState) => state.appointment);
  const { selectedVehicle } = useSelector((state: RootState) => state.appointmentFrame);
  const { onOpen: onOpenHistory, onClose: onCloseHistory, isOpen: isOpenHistory } = useModal();
  const currentUser = useCurrentUser();
  const { t } = useTranslation();
  const hasHistory = useMemo(() => {
    return selectedVehicle?.hasRepairOrders && selectedVehicle?.dmsId;
  }, [selectedVehicle]);

  return currentUser && currentUser.dealershipId === scProfile?.dealershipId ? (
    <SectionWrapper>
      <SideBar screen={screen} handleSetScreen={handleSetScreen} isManagingFlow={isManaging} />
      <CustomerInfo />
      <RoHistoryLink
        onClick={onOpenHistory}
        style={{ color: hasHistory ? '#142EA1' : 'grey', cursor: hasHistory ? 'pointer' : 'unset' }}
      >
        {t('See RO History')}
      </RoHistoryLink>
      <AppointmentNotes />

      {hasHistory && selectedVehicle?.id && customerLoadedData?.id ? (
        <VehicleRepairHistory
          customerId={customerLoadedData.id}
          open={isOpenHistory}
          onClose={onCloseHistory}
          vehicleId={selectedVehicle.id}
        />
      ) : null}
    </SectionWrapper>
  ) : (
    <SideBar screen={screen} handleSetScreen={handleSetScreen} isManagingFlow={isManaging} />
  );
};

export default SideBarSection;
