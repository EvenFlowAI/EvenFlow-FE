import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react';
import { CarCard } from './CarCard/CarCard';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { TArgCallback, TCallback, TScreen } from '../../../../../types/types';
import { StepWrapper } from '../../../../../components/styled/StepWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { ILoadedVehicle } from '../../../../../api/types';
import {
  clearAppointmentData,
  setAppointmentByKey,
  setEditingPosition,
  setHashKey,
  setServiceOptionChanged,
  setServiceTypeOption,
  setSideBarSteps,
  setVehicle,
  setWelcomeScreenView,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { useTranslation } from 'react-i18next';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import { getBlankVehicle } from '../../../../../store/reducers/appointment/actions';
import { useHistory, useParams } from 'react-router-dom';
import { ButtonsRow, CarsWrapper, NewVehicleBtn } from './styles';
import { AppointmentScreenTitle } from '../../../../../components/wrappers/AppointmentScreenTitle/AppointmentScreenTitle';
import { useException } from '../../../../../hooks/useException/useException';
import { Routes } from '../../../../../routes/constants';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import usePopState from '../../../../../hooks/usePopState/usePopState';
import { useCurrentUser } from '../../../../../hooks/useCurrentUser/useCurrentUser';
import { BookNewVehicle, NewVehicleCard } from './CarCard/styles';
import { ReactComponent as CarIcon } from '../../../../../assets/img/caricon.svg';

type TProps = {
  onBack: TCallback;
  loading: boolean;
  needToShowServiceSelection: boolean;
  handleSetScreen: TArgCallback<TScreen>;
  setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
  onSelectAppointment?: (car: ILoadedVehicle) => Promise<void>;
};

export const Cars: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  onSelectAppointment,
  onBack,
  loading,
  handleSetScreen,
  needToShowServiceSelection,
  setNeedToShowServiceSelection,
}) => {
  const { customerLoadedData, scProfile } = useSelector((state: RootState) => state.appointment);
  const {
    selectedVehicle,
    valueService,
    serviceTypeOption,
    consultants,
    makes,
    isUsualFlowNeeded,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
  const { isAdvisorAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
  const serviceType = useMemo(
    () => (serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter),
    [serviceTypeOption]
  );
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('mdl'));
  const dispatch = useDispatch();
  const showError = useException();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const currentUser = useCurrentUser();

  const isAuthorized = useMemo(
    () => currentUser && currentUser.dealershipId === scProfile?.dealershipId,
    [currentUser, scProfile]
  );
  const shouldHideScreen = useMemo(() => {
    return (
      customerLoadedData &&
      (!customerLoadedData.vehicles?.length || customerLoadedData?.fromSearchByName)
    );
  }, [customerLoadedData]);

  const getNextScreen = useCallback((): TScreen => {
    let nextScreen: TScreen =
      serviceType === EServiceType.VisitCenter ? 'serviceNeeds' : 'location';
    if (valueService?.selectedService) {
      nextScreen = isAdvisorAvailable ? 'consultantSelection' : 'appointmentTiming';
    }
    return nextScreen;
  }, [serviceType, valueService, isAdvisorAvailable, consultants]);

  const redirectToManageFlow = () => history.push('/f/appointment-manage/' + id);
  const redirectToCreateFlow = () => history.push('/f/appointment/' + id);
  const redirectToWelcomeScreens = () =>
    history.push(Routes.EndUser.Welcome + '/' + id + '?frame=1');

  usePopState('select', redirectToWelcomeScreens, true);

  useEffect(() => {
    if (isAuthorized) {
      handleSetScreen(getNextScreen());
      return;
    }
    if (shouldHideScreen) {
      if (needToShowServiceSelection) {
        handleServiceTypeSelection();
        setNeedToShowServiceSelection(false);
      } else {
        if (customerLoadedData?.isUpdating && !isUsualFlowNeeded) {
          handleSetScreen('manageAppointment');
          redirectToManageFlow();
        } else handleSetScreen(getNextScreen());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthorized,
    shouldHideScreen,
    selectedVehicle,
    scProfile,
    needToShowServiceSelection,
    customerLoadedData,
    isUsualFlowNeeded,
    getNextScreen,
  ]);

  const clearAllData = useCallback(async () => {
    await dispatch(clearAppointmentData());
    await dispatch(setServiceTypeOption(null));
    await dispatch(setSideBarSteps([]));
    await dispatch(setServiceOptionChanged(false));
  }, []);

  const clearData = useCallback(async () => {
    await dispatch(setVehicle(getBlankVehicle()));
    await clearAllData();
  }, [clearAllData]);

  const handleServiceTypeSelection = useCallback(() => {
    if (needToShowServiceSelection) {
      setNeedToShowServiceSelection(false);
      dispatch(setWelcomeScreenView('serviceSelect'));
      redirectToWelcomeScreens();
    }
  }, [history, needToShowServiceSelection]);

  const handleAddNewCarAppointment = useCallback(
    (vehicle: ILoadedVehicle) => {
      clearAllData().then(() => {
        dispatch(setVehicle(vehicle));
        if (needToShowServiceSelection) {
          handleServiceTypeSelection();
        } else {
          handleSetScreen('serviceNeeds');
          redirectToCreateFlow();
        }
      });
    },
    [
      dispatch,
      handleSetScreen,
      needToShowServiceSelection,
      serviceType,
      handleServiceTypeSelection,
      clearAllData,
      customerLoadedData,
    ]
  );

  const handleFirstScreen = useCallback(() => {
    setNeedToShowServiceSelection(false);
    dispatch(setWelcomeScreenView('serviceSelect'));
    redirectToWelcomeScreens();
  }, [history, id]);

  const handleCreateNewAppointment = useCallback(() => {
    handleSetScreen('serviceNeeds');
    redirectToCreateFlow();
  }, [serviceType, redirectToCreateFlow, customerLoadedData]);

  const handleAddNewVehicle = useCallback(() => {
    clearData().then(() => {
      if (firstScreenOptions.length) {
        const onlyNotVisitCenterExists =
          firstScreenOptions.length === 1 &&
          firstScreenOptions[0].type !== EServiceType.VisitCenter;
        if (firstScreenOptions.length > 1 || onlyNotVisitCenterExists) {
          handleFirstScreen();
        } else {
          dispatch(setServiceTypeOption(firstScreenOptions[0]));
          handleCreateNewAppointment();
        }
      } else {
        handleCreateNewAppointment();
      }
    });
  }, [
    dispatch,
    handleSetScreen,
    firstScreenOptions,
    handleFirstScreen,
    redirectToCreateFlow,
    serviceType,
    clearData,
  ]);

  const clearPrevAppointmentData = useCallback(() => {
    dispatch(setHashKey(''));
    dispatch(setAppointmentByKey(null));
    dispatch(setEditingPosition(null));
  }, []);

  const onSelectCar = useCallback(
    async (car: ILoadedVehicle) => {
      clearAllData().then(() => {
        if (car?.appointmentHashKeys.length && onSelectAppointment) {
          onSelectAppointment(car).then(() => {});
        } else {
          clearPrevAppointmentData();
          if (needToShowServiceSelection) {
            handleServiceTypeSelection();
          } else {
            redirectToCreateFlow();
            handleSetScreen(getNextScreen());
          }
        }
      });
    },
    [
      handleSetScreen,
      showError,
      dispatch,
      firstScreenOptions,
      makes,
      scProfile,
      onSelectAppointment,
      needToShowServiceSelection,
      selectedVehicle,
      clearPrevAppointmentData,
    ]
  );

  return (
    <StepWrapper>
      {loading || isAuthorized ? (
        <Loading />
      ) : (
        <>
          <AppointmentScreenTitle>
            {t('Which vehicle are you coming in for?')}
          </AppointmentScreenTitle>
          <CarsWrapper>
            {customerLoadedData?.vehicles.length ? (
              <>
                {customerLoadedData.vehicles.map((vehicle, index) => (
                  <CarCard
                    onScheduleNewAppointment={handleAddNewCarAppointment}
                    onSelectCar={onSelectCar}
                    clearData={clearData}
                    car={vehicle}
                    key={vehicle.dmsId || new Date().toISOString() + index}
                    customerId={customerLoadedData.id}
                  />
                ))}
                {!isSm ? (
                  <NewVehicleCard role="presentation" onClick={handleAddNewVehicle}>
                    <CarIcon />
                    <BookNewVehicle>{t('Book Another Vehicle')}</BookNewVehicle>
                  </NewVehicleCard>
                ) : null}
              </>
            ) : (
              <p>{t('No vehicles present')}</p>
            )}
          </CarsWrapper>
          <ButtonsRow>
            {isSm ? (
              <NewVehicleBtn
                onClick={handleAddNewVehicle}
                variant="outlined"
                color="primary"
                disabled={loading}
              >
                {t('Book Another Vehicle')}
              </NewVehicleBtn>
            ) : null}
            <Button onClick={onBack} disabled={loading} variant="outlined" color="primary">
              Back
            </Button>
          </ButtonsRow>
        </>
      )}
    </StepWrapper>
  );
};
