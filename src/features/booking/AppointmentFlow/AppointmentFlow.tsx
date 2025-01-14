import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { StyledEngineProvider, ThemeProvider, useMediaQuery, useTheme } from '@mui/material';
import { frameTheme } from '../../../theme/theme';
import { Container, SidebarWrapper } from './styles';
import './AppointmentFlow.css';
import { ServiceCenterSwitcher } from '../ServiceCenterSwitcher/ServiceCenterSwitcher';
import { SideBar } from '../SideBar/SideBar';
import { AppointmentScreenTitle } from '../../../components/wrappers/AppointmentScreenTitle/AppointmentScreenTitle';
import { Subtitle } from '../../../components/wrappers/AppointmentScreenSubtitle/AppointmentScreenSubtitle';
import SideBarSection from '../SideBarSection/SideBarSection';
import AskChangesCompleted from '../../../components/modals/booking/AskChangesCompleted/AskChangesCompleted';
import SlotImpactedWarning from '../../../components/modals/booking/SlotImpactedWarning/SlotImpactedWarning';
import ServiceImpactedWarning from '../../../components/modals/booking/ServiceImpactedWarning/ServiceImpactedWarning';
import { TCallback, TScreen } from '../../../types/types';
import { useTranslation } from 'react-i18next';
import { EServiceType } from '../../../store/reducers/appointmentFrameReducer/types';
import {
  loadMakes,
  setCurrentFrameScreen,
  setTrackerCreated,
  setVehicle,
} from '../../../store/reducers/appointmentFrameReducer/actions';
import { getCurrentUser } from '../../../store/reducers/users/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import ReactGA from 'react-ga4';
import { SCREENS } from '../../../utils/constants';
import {
  getBlankVehicle,
  getCustomerCache,
  setCustomerLoadedData,
} from '../../../store/reducers/appointment/actions';
import { loadEngineType, loadMileage } from '../../../store/reducers/vehicleDetails/actions';
import { decodeSCID } from '../../../utils/utils';
import { useAnalyticsForParentSite } from '../../../hooks/useAnalyticsBySCId/useAnalyticsBySCId';
import { useStorage } from '../../../hooks/useStorage/useStorage';
import { loadGeneralSettings } from '../../../store/reducers/generalSettings/actions';
import { ESettingType } from '../../../store/reducers/generalSettings/types';
import { useParams } from 'react-router-dom';

type TProps = {
  currentScreen: TScreen;
  setCurrentScreen: Dispatch<SetStateAction<TScreen>>;
  component: JSX.Element | undefined;
  handleSetScreen: (screen: TScreen) => void;
  handleLogin: TCallback;
  setNeedToShowServiceTypes: Dispatch<SetStateAction<boolean>>;
  isManaging?: boolean;
};

const AppointmentFlow: React.FC<TProps> = ({
  currentScreen,
  component,
  handleSetScreen,
  setCurrentScreen,
  handleLogin,
  setNeedToShowServiceTypes,
  isManaging,
}) => {
  const { customerLoadedData } = useSelector((state: RootState) => state.appointment);
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
  const {
    trackerData,
    valueService,
    currentScreen: currentFrameScreen,
    serviceTypeOption,
    hashKey,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const serviceType = useMemo(
    () => (serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter),
    [serviceTypeOption]
  );
  const onlyVisitCenterOptionExists = useMemo(
    () =>
      firstScreenOptions.length === 1 && firstScreenOptions[0].type === EServiceType.VisitCenter,
    [firstScreenOptions]
  );

  const setTracker = (ids: string[]) => dispatch(setTrackerCreated({ isCreated: true, ids }));

  useAnalyticsForParentSite(id, trackerData.isCreated, setTracker);

  useStorage();

  useEffect(() => {
    dispatch(loadEngineType(decodeSCID(id)));
    dispatch(loadMakes(decodeSCID(id)));
    dispatch(loadGeneralSettings(decodeSCID(id), [ESettingType.CompanyName]));
  }, [id]);

  useEffect(() => {
    if (
      serviceType === EServiceType.MobileService &&
      !customerLoadedData?.vehicles?.length &&
      !valueService?.selectedService
    ) {
      dispatch(setCurrentFrameScreen('location'));
      setCurrentScreen('location');
    }
  }, [serviceType, customerLoadedData, valueService]);

  useEffect(() => {
    dispatch(getCurrentUser(true));
  }, []);

  useEffect(() => {
    if (!customerLoadedData) {
      const data = getCustomerCache();
      if (data) {
        dispatch(setCustomerLoadedData(data));
        dispatch(setVehicle(getBlankVehicle()));
      } else {
        if (!valueService) {
          handleLogin();
          const nextScreen =
            serviceTypeOption && serviceTypeOption?.type !== EServiceType.VisitCenter
              ? 'location'
              : 'serviceNeeds';
          dispatch(setCurrentFrameScreen(nextScreen));
        }
      }
    }
  }, [customerLoadedData, dispatch, handleLogin]);

  useEffect(() => {
    if (currentFrameScreen === currentScreen) {
      window.onbeforeunload = () => {
        ReactGA.event(
          {
            category: 'EvenFlow User',
            action: 'Abandoned Page',
            label: `From Page ${SCREENS[currentScreen]}`,
            nonInteraction: true,
          },
          trackerData.ids
        );
      };
    } else {
      currentFrameScreen && setCurrentScreen(currentFrameScreen);
    }
  }, [currentScreen, currentFrameScreen]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleLogin);
    return () => window.removeEventListener('beforeunload', handleLogin);
  }, [handleLogin]);

  useEffect(() => {
    dispatch(loadMileage(decodeSCID(id)));
  }, [id]);

  useEffect(() => {
    setNeedToShowServiceTypes(
      Boolean(firstScreenOptions.length) && !onlyVisitCenterOptionExists && !hashKey?.length
    );
  }, [firstScreenOptions, onlyVisitCenterOptionExists, hashKey]);

  const getTitle = () => {
    switch (currentScreen) {
      case 'carSelection':
        return null;
      case 'maintenanceDetails':
      case 'serviceNeeds':
        return t('How can we help you?');
      case 'describeMore':
        return t('Please describe what’s going on');
      case 'opsCode':
        return t('What does your car need?');
      case 'packageSelection':
        return t('Please select your Maintenance Package');
      case 'consultantSelection':
        return t('Do you have a preferred advisor?');
      case 'appointmentTiming':
        return t('When would you like your vehicle serviced?');
      case 'appointmentSelection':
        return t('Select Appointment date & time');
      case 'transportationNeeds':
        return t('Do you need assistance with transportation?');
      case 'appointmentConfirmation':
        return t('Appointment Confirmation Title');
      case 'location':
        return t('Where are you located?');
      case 'payment':
        return t('Please Enter Your Payment Information');
      case 'serviceOfferProductPage':
        return 'Select Service With Special Offer';
      default:
        return null;
    }
  };
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={frameTheme}>
        <Container>
          <ServiceCenterSwitcher />
          {isSm &&
          !['carSelection', 'appointmentConfirmed', 'packageSelection'].includes(currentScreen) ? (
            <SideBar
              screen={currentScreen}
              handleSetScreen={handleSetScreen}
              isManagingFlow={isManaging}
            />
          ) : null}
          {!['carSelection', 'appointmentConfirmed'].includes(currentScreen) ? (
            <AppointmentScreenTitle>{getTitle()}</AppointmentScreenTitle>
          ) : null}
          {isXs && currentScreen === 'packageSelection' ? (
            <p style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 0 }}>
              {t('Please click on the maintenance package for your vehicle')}
            </p>
          ) : null}
          {currentScreen === 'maintenanceDetails' ? (
            <Subtitle>{t('Please provide the maintenance details for your vehicle')}</Subtitle>
          ) : null}
          {['carSelection', 'packageSelection', 'appointmentConfirmed'].includes(currentScreen) ? (
            component
          ) : !isSm ? (
            <SidebarWrapper>
              <SideBarSection
                screen={currentScreen}
                handleSetScreen={handleSetScreen}
                isManaging={Boolean(isManaging)}
              />
              {component}
            </SidebarWrapper>
          ) : (
            component
          )}
        </Container>
        <AskChangesCompleted />
        <SlotImpactedWarning />
        <ServiceImpactedWarning />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default AppointmentFlow;
