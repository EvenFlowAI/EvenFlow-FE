import React, { useMemo, useState } from 'react';
import { Cars } from '../../../features/booking/AppointmentFlow/Screens/Cars/Cars';
import { AppointmentConfirmation } from '../../../features/booking/AppointmentFlow/Create/AppointmentConfirmation/AppointmentConfirmation';
import { AppointmentComment } from '../../../features/booking/AppointmentFlow/Screens/AppointmentComment/AppointmentComment';
import { MaintenancePackages } from '../../../features/booking/AppointmentFlow/Screens/MaintenancePackages/MaintenancePackages';
import { SelectOpsCode } from '../../../features/booking/AppointmentFlow/Screens/ServiceOpsCodes/SelectOpsCode';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { AppointmentConfirmed } from '../../../features/booking/AppointmentFlow/Screens/AppointmentConfirmed/AppointmentConfirmed';
import { IServiceCategory } from '../../../api/types';
import '../../../features/booking/AppointmentFlow/AppointmentFlow.css';
import { EServiceType } from '../../../store/reducers/appointmentFrameReducer/types';
import PaymentScreen from '../../../features/booking/AppointmentFlow/Screens/PaymentScreen/PaymentScreen';
import OfferProductPage from '../../../features/booking/AppointmentFlow/Screens/OfferProductPage/OfferProductPage';
import { TScreen } from '../../../types/screens';
import { ServiceNeedsCreate } from '../../../features/booking/AppointmentFlow/Create/ServiceNeedsCreate/ServiceNeedsCreate';
import MaintenanceCreate from '../../../features/booking/AppointmentFlow/Create/MaintenanceCreate/MaintenanceCreate';
import ConsultantsCreate from '../../../features/booking/AppointmentFlow/Create/ConsultantsCreate/ConsultantsCreate';
import AppointmentTimingCreate from '../../../features/booking/AppointmentFlow/Create/AppointmentTimingCreate/AppointmentTimingCreate';
import AppointmentSlotsCreate from '../../../features/booking/AppointmentFlow/Create/AppointmentSlotsCreate/AppointmentSlotsCreate';
import TransportationsCreate from '../../../features/booking/AppointmentFlow/Create/TransportationsCreate/TransportationsCreate';
import YourLocationCreate from '../../../features/booking/AppointmentFlow/Create/YourLocationCreate/YourLocationCreate';
import AppointmentFlow from '../../../features/booking/AppointmentFlow/AppointmentFlow';
import { TFlowProps } from '../types';
import { useHistory, useParams } from 'react-router-dom';
import { clearAppointmentSlots } from '../../../store/reducers/appointment/actions';

export const CreateAppointmentFlow: React.FC<TFlowProps> = ({
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
  const { serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);
  const { isTransportationAvailable, isAppointmentTimingAvailable, isAdvisorAvailable } =
    useSelector((state: RootState) => state.bookingFlowConfig);
  const { customerLoadedData } = useSelector((state: RootState) => state.appointment);
  const [lastSelectedCategory, setLastSelectedCategory] = useState<IServiceCategory | null>(null);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useDispatch();
  const serviceType = useMemo(
    () => (serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter),
    [serviceTypeOption]
  );

  const onBackFromServiceNeeds = () => {
    console.log('test 2');
    if (customerLoadedData?.isUpdating) history.push('/f/appointment-manage/' + id);
    handleSetScreen(serviceType === EServiceType.VisitCenter ? 'carSelection' : 'location');
  };

  const onChangeSlot = () => {
    dispatch(clearAppointmentSlots());
    handleSetScreen(isAppointmentTimingAvailable ? 'appointmentTiming' : 'appointmentSelection');
  };

  const component = useMemo(() => {
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
        <ServiceNeedsCreate
          page={serviceCategoryPage}
          setPage={setServiceCategoryPage}
          setLastSelectedCategory={setLastSelectedCategory}
          setNeedToShowServiceSelection={setNeedToShowServiceTypes}
          onBack={onBackFromServiceNeeds}
          onSelect={handleSetScreen}
        />
      ),
      maintenanceDetails: (
        <MaintenanceCreate
          serviceCategoryPage={serviceCategoryPage}
          onBack={handleSetScreen}
          onNext={handleSetScreen}
        />
      ),
      packageSelection: (
        <MaintenancePackages
          isManagingFlow={false}
          onBack={() => handleSetScreen('maintenanceDetails')}
          onNext={handleSetScreen}
          onAddServices={() => handleSetScreen('serviceNeeds')}
        />
      ),
      describeMore: (
        <AppointmentComment
          handleSetScreen={handleSetScreen}
          onAddServices={() => handleSetScreen('serviceNeeds')}
          isManagingFlow={false}
        />
      ),
      opsCode: (
        <SelectOpsCode
          onAddServices={() => handleSetScreen('serviceNeeds')}
          handleSetScreen={handleSetScreen}
          page={serviceCategoryPage}
          isManagingFlow={false}
        />
      ),
      consultantSelection: (
        <ConsultantsCreate
          onBack={() => handleSetScreen('serviceNeeds')}
          onNext={() =>
            handleSetScreen(
              isTransportationAvailable && !serviceTypeOption?.transportationOption
                ? 'transportationNeeds'
                : isAppointmentTimingAvailable
                  ? 'appointmentTiming'
                  : 'appointmentSelection'
            )
          }
        />
      ),
      appointmentTiming: <AppointmentTimingCreate handleSetScreen={handleSetScreen} />,
      appointmentSelection: <AppointmentSlotsCreate handleSetScreen={handleSetScreen} />,
      transportationNeeds: (
        <TransportationsCreate
          onBack={() =>
            handleSetScreen(isAdvisorAvailable ? 'consultantSelection' : 'serviceNeeds')
          }
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
          onChangeSlot={onChangeSlot}
          onNext={() => handleSetScreen('appointmentConfirmed')}
        />
      ),
      appointmentConfirmed: (
        <AppointmentConfirmed onUpdateAppointment={onUpdateAppointment} isManagingFlow={false} />
      ),
      location: (
        <YourLocationCreate
          onBack={() => handleSetScreen('carSelection')}
          onNext={() => handleSetScreen('serviceNeeds')}
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
    };
    return carSelections[currentScreen];
  }, [
    currentScreen,
    handleSetScreen,
    handleLogin,
    loadingCar,
    serviceTypeOption,
    needToShowServiceTypes,
    onUpdateAppointment,
    serviceCategoryPage,
    isTransportationAvailable,
    isAdvisorAvailable,
    isAppointmentTimingAvailable,
  ]);

  return (
    <AppointmentFlow
      handleLogin={handleLogin}
      currentScreen={currentScreen}
      component={component}
      setNeedToShowServiceTypes={setNeedToShowServiceTypes}
      handleSetScreen={handleSetScreen}
      setCurrentScreen={setCurrentScreen}
    />
  );
};
