import React, { useEffect, useState } from 'react';
import { Cars } from '../../../features/booking/AppointmentFlow/Screens/Cars/Cars';
import { AppointmentConfirmation } from '../../../features/booking/AppointmentFlow/Create/AppointmentConfirmation/AppointmentConfirmation';
import { AppointmentComment } from '../../../features/booking/AppointmentFlow/Screens/AppointmentComment/AppointmentComment';
import { MaintenancePackages } from '../../../features/booking/AppointmentFlow/Screens/MaintenancePackages/MaintenancePackages';
import { SelectOpsCode } from '../../../features/booking/AppointmentFlow/Screens/ServiceOpsCodes/SelectOpsCode';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { setCustomerLoadedData } from '../../../store/reducers/appointment/actions';
import { AppointmentConfirmed } from '../../../features/booking/AppointmentFlow/Screens/AppointmentConfirmed/AppointmentConfirmed';
import { IServiceCategory } from '../../../api/types';
import PaymentScreen from '../../../features/booking/AppointmentFlow/Screens/PaymentScreen/PaymentScreen';
import OfferProductPage from '../../../features/booking/AppointmentFlow/Screens/OfferProductPage/OfferProductPage';
import { TScreen } from '../../../types/screens';
import YourLocationManage from '../../../features/booking/AppointmentFlow/Manage/YourLocationManage/YourLocationManage';
import TransportationsManage from '../../../features/booking/AppointmentFlow/Manage/TransportationsManage/TransportationsManage';
import AppointmentSlotsManage from '../../../features/booking/AppointmentFlow/Manage/AppointmentSlotsManage/AppointmentSlotsManage';
import AppointmentTimingManage from '../../../features/booking/AppointmentFlow/Manage/AppointmentTimingManage/AppointmentTimingManage';
import ConsultantsManage from '../../../features/booking/AppointmentFlow/Manage/ConsultantsManage/ConsultantsManage';
import MaintenanceDetailsManage from '../../../features/booking/AppointmentFlow/Manage/MaintenanceDetailsManage/MaintenanceDetailsManage';
import { ServiceNeedsManage } from '../../../features/booking/AppointmentFlow/Manage/ServiceNeedsManage/ServiceNeedsManage';
import AppointmentFlow from '../../../features/booking/AppointmentFlow/AppointmentFlow';
import { ManageAppointment } from '../../../features/booking/AppointmentFlow/Manage/ManageAppointment/ManageAppointment';
import { TFlowProps } from '../types';

export const ManageAppointmentFlow: React.FC<TFlowProps> = ({
  onUpdateAppointment,
  onSelectAppointment,
  handleSetScreen,
  handleLogin,
  onGoToFirstScreen,
  loadingCar,
  currentScreen,
  setCurrentScreen,
  serviceCategoryPage,
  setServiceCategoryPage,
  needToShowServiceTypes,
  setNeedToShowServiceTypes,
}) => {
  const {
    selectedVehicle,
    serviceTypeOption,
    isUsualFlowNeeded,
    advisor,
    welcomeScreenView,
    appointmentByKey,
    transportations,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { customerLoadedData, isCloneMode } = useSelector((state: RootState) => state.appointment);
  const { isTransportationAvailable, isAppointmentTimingAvailable, isAdvisorAvailable } =
    useSelector((state: RootState) => state.bookingFlowConfig);

  const [lastSelectedCategory, setLastSelectedCategory] = useState<IServiceCategory | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedVehicle && customerLoadedData?.isUpdating) {
      if (customerLoadedData?.fromSearchByName) {
        dispatch(setCustomerLoadedData({ ...customerLoadedData, fromSearchByName: false }));
      }

      if (welcomeScreenView !== 'serviceSelect') {
        onUpdateAppointment(selectedVehicle).then(() => handleSetScreen('manageAppointment'));
      }
    }
  }, [customerLoadedData, selectedVehicle?.make, welcomeScreenView]);

  const onChangeSlot = () => {
    const nextScreen: TScreen =
      isAdvisorAvailable && !advisor
        ? 'consultantSelection'
        : isAppointmentTimingAvailable
          ? 'appointmentTiming'
          : 'appointmentSelection';
    handleSetScreen(nextScreen);
  };

  const handleNext = (): Promise<void> => {
    return new Promise(resolve => {
      handleSetScreen('appointmentConfirmed');
      resolve();
    });
  };

  const onNextOnAdvisorSelectionStep = () => {
    // if the transportation available, move to the slots, if not, move to the transportation selection step
    if (isCloneMode) {
      const transportationAvailable = transportations.some(
        transportation => transportation.id === appointmentByKey?.transportationOption?.id
      );

      return handleSetScreen(
        transportationAvailable
          ? isAppointmentTimingAvailable
            ? 'appointmentTiming'
            : 'appointmentSelection'
          : 'transportationNeeds'
      );
    }

    return handleSetScreen(
      isTransportationAvailable && !serviceTypeOption?.transportationOption
        ? 'transportationNeeds'
        : isAppointmentTimingAvailable
          ? 'appointmentTiming'
          : 'appointmentSelection'
    );
  };

  const carSelections: { [k in TScreen]?: JSX.Element } = {
    carSelection: (
      <Cars
        onBack={handleLogin}
        loading={loadingCar}
        setNeedToShowServiceSelection={setNeedToShowServiceTypes}
        needToShowServiceSelection={needToShowServiceTypes}
        handleSetScreen={handleSetScreen}
        onSelectAppointment={onSelectAppointment}
      />
    ),
    serviceNeeds: (
      <ServiceNeedsManage
        page={serviceCategoryPage}
        setPage={setServiceCategoryPage}
        setLastSelectedCategory={setLastSelectedCategory}
        onSelect={handleSetScreen}
      />
    ),
    maintenanceDetails: (
      <MaintenanceDetailsManage
        serviceCategoryPage={serviceCategoryPage}
        onBack={handleSetScreen}
        onNext={handleSetScreen}
      />
    ),
    packageSelection: (
      <MaintenancePackages
        isManagingFlow={!isUsualFlowNeeded}
        onBack={() => handleSetScreen('maintenanceDetails')}
        onNext={handleSetScreen}
        onAddServices={() => handleSetScreen('serviceNeeds')}
      />
    ),
    describeMore: (
      <AppointmentComment
        handleSetScreen={handleSetScreen}
        onAddServices={() => handleSetScreen('serviceNeeds')}
        isManagingFlow={!isUsualFlowNeeded}
      />
    ),
    opsCode: (
      <SelectOpsCode
        onAddServices={() => handleSetScreen('serviceNeeds')}
        handleSetScreen={handleSetScreen}
        page={serviceCategoryPage}
        isManagingFlow={!isUsualFlowNeeded}
      />
    ),
    consultantSelection: <ConsultantsManage onNext={onNextOnAdvisorSelectionStep} />,
    appointmentTiming: <AppointmentTimingManage handleSetScreen={handleSetScreen} />,
    appointmentSelection: <AppointmentSlotsManage handleSetScreen={handleSetScreen} />,
    transportationNeeds: (
      <TransportationsManage
        onBack={() => handleSetScreen(isAdvisorAvailable ? 'consultantSelection' : 'serviceNeeds')}
        onNext={() =>
          handleSetScreen(
            isAppointmentTimingAvailable ? 'appointmentTiming' : 'appointmentSelection'
          )
        }
      />
    ),
    appointmentConfirmation: (
      <AppointmentConfirmation
        onBack={() => handleSetScreen('appointmentSelection')}
        onChangeSlot={() =>
          handleSetScreen(
            isAppointmentTimingAvailable ? 'appointmentTiming' : 'appointmentSelection'
          )
        }
        onNext={handleNext}
      />
    ),
    appointmentConfirmed: (
      <AppointmentConfirmed onUpdateAppointment={onUpdateAppointment} isManagingFlow />
    ),
    location: (
      <YourLocationManage
        onUpdateAppointment={onUpdateAppointment}
        setNeedToShowServiceSelection={setNeedToShowServiceTypes}
        onGoToFirstScreen={onGoToFirstScreen}
      />
    ),
    payment: <PaymentScreen />,
    serviceOfferProductPage: (
      <OfferProductPage
        handleSetScreen={handleSetScreen}
        category={lastSelectedCategory}
        lastCategory={lastSelectedCategory}
        onChangeVehicle={() => handleSetScreen('maintenanceDetails')}
      />
    ),
    manageAppointment: (
      <ManageAppointment onUpdateAppointment={onUpdateAppointment} onChangeSlot={onChangeSlot} />
    ),
  };

  const component = carSelections[currentScreen];
  return (
    <AppointmentFlow
      handleLogin={handleLogin}
      currentScreen={currentScreen}
      component={component}
      setNeedToShowServiceTypes={setNeedToShowServiceTypes}
      handleSetScreen={handleSetScreen}
      isManaging
      setCurrentScreen={setCurrentScreen}
    />
  );
};
