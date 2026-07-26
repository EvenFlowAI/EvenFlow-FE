import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ConfirmModal } from './components/modals/common/ConfirmModal/ConfirmModal';
import { SnackbarProvider } from 'notistack';
import { Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/rootReducer';
import { EServiceType } from './store/reducers/appointmentFrameReducer/types';
import {
  loadBookingFlowConfig,
  setConfiguration,
} from './store/reducers/bookingFlowConfig/actions';
import { TScreen } from './types/screens';
import AppRoutes from './routes/AppRoutes/AppRoutes';
import { disableEmotionWarning } from './utils/utils';
import { AwsRum, AwsRumConfig } from 'aws-rum-web';
import {
  setIsCloneMode,
  setIsDemandSmoothMode,
  setIsEditMode,
} from './store/reducers/appointment/actions';
import { useAppInitialization } from './hooks/useAppInitialization/useAppInitialization';
import { useSSOTokenHandler } from './hooks/useSSOTokenHandler/useSSOTokenHandler';
import { LicenseInfo } from '@mui/x-license';
import { MUI_PRO_LICENSE_KEY } from './config/tokens';
import { ETransportationType } from './store/reducers/transportationNeeds/types';
import { GA_CLIENT_ID_FROM_DEALER, GA_MEASUREMENT_ID_FROM_DEALER } from './utils/constants';

const App = () => {
  const { scProfile, isTopAligning, isCloneMode } = useSelector(
    (state: RootState) => state.appointment
  );
  const { config, currentConfig, isAdvisorAvailable } = useSelector(
    (state: RootState) => state.bookingFlowConfig
  );
  const { serviceTypeOption, transportation } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const [valueServiceNextScreen, setValueServiceNextScreen] =
    useState<TScreen>('consultantSelection');
  const [valueServicePreviousScreen, setValueServicePreviousScreen] =
    useState<TScreen>('serviceNeeds');
  const notificationsRef = useRef<SnackbarProvider | null>(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('mdl'));
  const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  const { appIsReady, setAppIsReady } = useAppInitialization();
  useSSOTokenHandler(setAppIsReady);

  // Check version once every 2 hours and reload if version changed
  const checkVersion = useCallback(() => {
    if (window.location.hostname === 'localhost') return;
    // const lastCheck = localStorage.getItem('version_last_check');
    // const currentTime = new Date().getTime();
    const currentCachedVersion = localStorage.getItem('app_version');
    // if (!lastCheck || currentTime - parseInt(lastCheck, 10) > ONE_MINUTE) {
    fetch('/version.json', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
      .then(response => response.json())
      .then(data => {
        // First visit - just save the version
        if (!currentCachedVersion) {
          localStorage.setItem('app_version', data.version);
          // localStorage.setItem('version_last_check', currentTime.toString());
          window.location.reload();
          return;
        }

        // Compare versions and reload if different
        if (currentCachedVersion !== data.version) {
          localStorage.setItem('app_version', data.version);
          // localStorage.setItem('version_last_check', currentTime.toString());
          window.location.reload();
        } else {
          // localStorage.setItem('version_last_check', currentTime.toString());
        }
      })
      .catch(error => {
        console.error('Error fetching version:', error);
      });
  }, []);

  useEffect(() => {
    // Run initial check
    checkVersion();

    // Then check periodically (every minute)
    const intervalId = setInterval(() => {
      checkVersion();
    }, TWO_HOURS); // 60 seconds

    // Cleanup interval on component unmounted
    return () => clearInterval(intervalId);
  }, [checkVersion]);

  useEffect(() => {
    if (process.env.REACT_APP_ENV === 'production') {
      try {
        const config: AwsRumConfig = {
          sessionSampleRate: 1,
          identityPoolId: 'us-east-2:1ca03bba-7ffe-45d6-907c-fc07756be173',
          endpoint: 'https://dataplane.rum.us-east-2.amazonaws.com',
          telemetries: ['performance', 'errors'],
          allowCookies: false,
          enableXRay: false,
        };

        const APPLICATION_ID: string = '732ce6df-a19e-43e4-9638-d5ff3cd49b3b';
        const APPLICATION_VERSION: string = '1.0.0';
        const APPLICATION_REGION: string = 'us-east-2';

        new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config);
        // eslint-disable-next-line
      } catch (error) {
        // Ignore errors thrown during CloudWatch RUM web client initialization
      }
    }
  }, [process.env.REACT_APP_ENV]);

  useEffect(() => {
    const serviceType = serviceTypeOption?.type ?? EServiceType.VisitCenter;
    const currentConfiguration = config.find(
      item => item.serviceType?.toString() === serviceType.toString()
    );
    if (currentConfiguration) dispatch(setConfiguration(currentConfiguration, serviceTypeOption));
  }, [serviceTypeOption, config]);

  useEffect(() => {
    if (
      serviceTypeOption?.type === EServiceType.MobileService ||
      serviceTypeOption?.type === EServiceType.PickUpDropOff ||
      transportation?.type === ETransportationType.PickUpDelivery
    ) {
      setValueServicePreviousScreen('location');
    } else {
      setValueServicePreviousScreen('serviceNeeds');
    }
    const serviceType = serviceTypeOption?.type ?? EServiceType.VisitCenter;
    if ((currentConfig && !isAdvisorAvailable) || serviceType === EServiceType.MobileService) {
      setValueServiceNextScreen('appointmentTiming');
    }
  }, [serviceTypeOption, currentConfig, isAdvisorAvailable]);

  useEffect(() => {
    if (scProfile) {
      dispatch(loadBookingFlowConfig(scProfile.id));
    }
  }, [scProfile]);

  useEffect(() => {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
    disableEmotionWarning();
  }, []);

  LicenseInfo.setLicenseKey(MUI_PRO_LICENSE_KEY);

  const handleMessage = (event: MessageEvent) => {
    const clientIdFromOldDealers =
      typeof event.data === 'string' && /^\d+$/.test(event.data) ? event.data : '';

    console.log('TEMP_LOG:', event.data);

    const clientData =
      typeof event.data === 'object' &&
      event.data !== null &&
      event.data.type === 'init' &&
      (typeof event.data?.clientId === 'string' || typeof event.data?.measurementId === 'string')
        ? event.data
        : '';

    if (clientData || clientIdFromOldDealers.length) {
      if (clientData)
        console.log('TEMP_LOG: App.tsx: clientData obtained from the dealer website:', clientData);
      if (clientIdFromOldDealers?.length) {
        console.log(
          'TEMP_LOG: App.tsx: clientId obtained from the dealer website:',
          clientIdFromOldDealers
        );
        sessionStorage.setItem(GA_CLIENT_ID_FROM_DEALER, clientIdFromOldDealers);
      }
      if (clientData?.clientId?.length)
        sessionStorage.setItem(GA_CLIENT_ID_FROM_DEALER, clientData?.clientId);
      if (clientData?.measurementId?.length)
        sessionStorage.setItem(GA_MEASUREMENT_ID_FROM_DEALER, clientData?.measurementId);
    }
  };

  window.addEventListener('message', handleMessage);

  const handleClose = (key: React.ReactText) => () => {
    notificationsRef?.current?.closeSnackbar(key);
  };
  const shackAction = (key: React.ReactText) => {
    return (
      <IconButton size="small" onClick={handleClose(key)}>
        <Close htmlColor="#fff" />
      </IconButton>
    );
  };
  const isWin = window.navigator.appVersion.indexOf('Win') !== -1;

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      dispatch(setIsCloneMode(false));
      dispatch(setIsEditMode(false));
      dispatch(setIsDemandSmoothMode(false));
      window.location.reload();
    };

    if (isCloneMode) {
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      if (isCloneMode) {
        window.removeEventListener('popstate', handlePopState);
      }
    };
  }, [isCloneMode]);

  return (
    <SnackbarProvider
      maxSnack={3}
      ref={notificationsRef}
      action={shackAction}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      variant="success"
    >
      <Container
        component="main"
        maxWidth={false}
        className={isWin ? 'winos' : undefined}
        disableGutters
        style={{
          height: isTopAligning || isMobile ? 'auto' : '100vh',
          maxHeight: '-webkit-fill-available',
        }}
      >
        <ConfirmModal />
        {appIsReady ? (
          <AppRoutes
            valueServicePreviousScreen={valueServicePreviousScreen}
            valueServiceNextScreen={valueServiceNextScreen}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Container>
    </SnackbarProvider>
  );
};

export default App;
