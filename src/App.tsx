import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { Container, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ConfirmModal } from './components/modals/common/ConfirmModal/ConfirmModal';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/rootReducer';
import { EServiceType } from './store/reducers/appointmentFrameReducer/types';
import {
  loadBookingFlowConfig,
  setConfiguration,
} from './store/reducers/bookingFlowConfig/actions';
import { TScreen } from './types/types';
import AppRoutes from './routes/AppRoutes/AppRoutes';
import dayjs from 'dayjs';
import { disableEmotionWarning } from './utils/utils';
import { AwsRum, AwsRumConfig } from 'aws-rum-web';

const App = () => {
  const { scProfile, isTopAligning } = useSelector((state: RootState) => state.appointment);
  const { config, currentConfig, isAdvisorAvailable } = useSelector(
    (state: RootState) => state.bookingFlowConfig
  );
  const { serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);
  const [valueServiceNextScreen, setValueServiceNextScreen] =
    useState<TScreen>('consultantSelection');
  const [valueServicePreviousScreen, setValueServicePreviousScreen] =
    useState<TScreen>('serviceNeeds');
  const notificationsRef = useRef<SnackbarProvider | null>(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('mdl'));
  const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
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

    // Cleanup interval on component unmount
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

        const awsRum: AwsRum = new AwsRum(
          APPLICATION_ID,
          APPLICATION_VERSION,
          APPLICATION_REGION,
          config
        );
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
      serviceTypeOption?.type === EServiceType.PickUpDropOff
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
        <AppRoutes
          valueServicePreviousScreen={valueServicePreviousScreen}
          valueServiceNextScreen={valueServiceNextScreen}
        />
      </Container>
    </SnackbarProvider>
  );
};

export default App;
