import { useState } from 'react';
import { ICustomerWithPhones } from '../../../../../store/reducers/enhancedCustomerSearch/types';
import { useModal } from '../../../../../hooks/useModal/useModal';
import { AppointmentSummaryI } from '../../../utils/types';

const useCustomerAppointmentSelection = (resetEditingElement: () => void) => {
  const [hashIdForSelectedAppointment, setHashIdForSelectedAppointment] = useState<string | null>(
    null
  );
  const [loadedAppointmentsByCar, setLoadedAppointmentsByCar] = useState<AppointmentSummaryI[]>([]);
  const [selectedAppointmentForCancelOrEdit, setSelectedAppointmentForCancelOrEdit] =
    useState<ICustomerWithPhones | null>(null);
  const [isEditAppointment, setIsEditAppointment] = useState<boolean>(false);
  const {
    onOpen: onOpenAppointmentSelection,
    onClose: onCloseAppointmentSelection,
    isOpen: isOpenAppointmentSelection,
  } = useModal();

  const resetSelectedAppointmentData = () => {
    setHashIdForSelectedAppointment(null);
    resetEditingElement();
    setSelectedAppointmentForCancelOrEdit(null);
    setLoadedAppointmentsByCar([]);
    onCloseAppointmentSelection();
  };

  return {
    hashIdForSelectedAppointment,
    loadedAppointmentsByCar,
    selectedAppointmentForCancelOrEdit,
    isEditAppointment,
    isOpenAppointmentSelection,
    setHashIdForSelectedAppointment,
    setLoadedAppointmentsByCar,
    setSelectedAppointmentForCancelOrEdit,
    setIsEditAppointment,
    onOpenAppointmentSelection,
    onCloseAppointmentSelection,
    resetSelectedAppointmentData,
  };
};

export default useCustomerAppointmentSelection;
