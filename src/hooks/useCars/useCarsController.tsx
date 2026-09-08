import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/rootReducer';
import { ILoadedVehicle } from '../../api/types';
import { TArgCallback } from '../../types/types';
import { TScreen } from '../../types/screens';
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
} from '../../store/reducers/appointmentFrameReducer/actions';
import { getBlankVehicle } from '../../store/reducers/appointment/actions';
import { Routes } from '../../routes/constants';
import usePopState from '../usePopState/usePopState';
import { useCurrentUser } from '../useCurrentUser/useCurrentUser';
import { ETransportationType } from '../../store/reducers/transportationNeeds/types';
import { EServiceType } from '../../store/reducers/appointmentFrameReducer/types';
import { loadRecallsByVin } from '../../store/reducers/recall/actions';
import { decodeSCID } from '../../utils/utils';

type TUseCarsControllerArgs = {
  handleSetScreen: TArgCallback<TScreen>;
  needToShowServiceSelection: boolean;
  setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
  onSelectAppointment?: (car: ILoadedVehicle) => Promise<void>;
};

export const useCarsController = ({
  handleSetScreen,
  needToShowServiceSelection,
  setNeedToShowServiceSelection,
  onSelectAppointment,
}: TUseCarsControllerArgs) => {
  const { customerLoadedData, scProfile } = useSelector((state: RootState) => state.appointment);
  const {
    selectedVehicle,
    valueService,
    serviceTypeOption,
    consultants,
    isUsualFlowNeeded,
    transportation,
    customer,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
  const { isAdvisorAvailable, config } = useSelector((state: RootState) => state.bookingFlowConfig);

  const serviceType = useMemo(() => {
    if (serviceTypeOption) {
      return serviceTypeOption.type;
    }
    return transportation?.type === ETransportationType.PickUpDelivery
      ? EServiceType.PickUpDropOff
      : EServiceType.VisitCenter;
  }, [serviceTypeOption, transportation]);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('mdl'));
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const currentUser = useCurrentUser();

  const visitCenterConfig = useMemo(
    () => config?.find(item => item.serviceType === EServiceType.VisitCenter),
    [config]
  );
  const mobileServiceConfig = useMemo(
    () => config?.find(item => item.serviceType === EServiceType.MobileService),
    [config]
  );
  const pickUpDropOffConfig = useMemo(
    () => config?.find(item => item.serviceType === EServiceType.PickUpDropOff),
    [config]
  );

  const isAuthorized = useMemo(
    () => currentUser && currentUser.dealershipId === scProfile?.dealershipId,
    [currentUser, scProfile]
  );
  const shouldHideScreen = useMemo(
    () =>
      Boolean(
        customerLoadedData &&
        (!customerLoadedData.vehicles?.length || customerLoadedData?.fromSearchByName)
      ),
    [customerLoadedData]
  );

  const getNextScreen = useCallback((): TScreen => {
    if (valueService?.selectedService) {
      return isAdvisorAvailable ? 'consultantSelection' : 'appointmentTiming';
    }
    return serviceType === EServiceType.VisitCenter ? 'serviceNeeds' : 'location';
  }, [serviceType, valueService, isAdvisorAvailable, consultants]);

  const redirectToManageFlow = () => history.push('/f/appointment-manage/' + id);
  const redirectToCreateFlow = () => history.push('/f/appointment/' + id);
  const redirectToWelcomeScreens = () =>
    history.push(Routes.EndUser.Welcome + '/' + id + '?frame=1');

  usePopState('select', redirectToWelcomeScreens, true);

  const handleServiceTypeSelection = useCallback(() => {
    if (needToShowServiceSelection) {
      setNeedToShowServiceSelection(false);
      dispatch(setWelcomeScreenView('serviceSelect'));
      redirectToWelcomeScreens();
    }
  }, [needToShowServiceSelection]);

  useEffect(() => {
    if (isAuthorized) {
      handleSetScreen(getNextScreen());
      return;
    }
    if (!shouldHideScreen) {
      return;
    }
    if (needToShowServiceSelection) {
      handleServiceTypeSelection();
      setNeedToShowServiceSelection(false);
      return;
    }
    if (customerLoadedData?.isUpdating && !isUsualFlowNeeded) {
      handleSetScreen('manageAppointment');
      redirectToManageFlow();
      return;
    }
    handleSetScreen(getNextScreen());
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

  const transportationOptionId =
    serviceType === EServiceType.VisitCenter
      ? serviceTypeOption?.transportationOption
        ? serviceTypeOption.transportationOption.id
        : !serviceTypeOption?.transportationOption && transportation
          ? transportation.id
          : undefined
      : serviceType === EServiceType.PickUpDropOff
        ? (serviceTypeOption?.transportationOption?.id ?? undefined)
        : undefined;

  const handleAddNewCarAppointment = useCallback(
    (vehicle: ILoadedVehicle) => {
      clearAllData().then(() => {
        dispatch(setVehicle(vehicle));
        if (
          vehicle?.vin?.length &&
          vehicle?.make &&
          vehicle?.model &&
          vehicle?.year &&
          (visitCenterConfig?.checkRecallsExisting ||
            pickUpDropOffConfig?.checkRecallsExisting ||
            mobileServiceConfig?.checkRecallsExisting)
        ) {
          const customerId = customerLoadedData?.id ? +customerLoadedData.id : customer?.id;
          dispatch(
            loadRecallsByVin(
              decodeSCID(id),
              vehicle.vin,
              vehicle.make,
              vehicle.model,
              vehicle.year,
              serviceTypeOption?.id,
              transportationOptionId,
              customerId,
              true
            )
          );
        }
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
      handleServiceTypeSelection,
      clearAllData,
      customerLoadedData,
    ]
  );

  const handleFirstScreen = useCallback(() => {
    setNeedToShowServiceSelection(false);
    dispatch(setWelcomeScreenView('serviceSelect'));
    redirectToWelcomeScreens();
  }, [id]);

  const handleCreateNewAppointment = useCallback(() => {
    handleSetScreen('serviceNeeds');
    redirectToCreateFlow();
  }, [redirectToCreateFlow]);

  const handleAddNewVehicle = useCallback(() => {
    clearData().then(() => {
      if (!firstScreenOptions.length) {
        handleCreateNewAppointment();
        return;
      }
      const onlyNotVisitCenterExists =
        firstScreenOptions.length === 1 && firstScreenOptions[0].type !== EServiceType.VisitCenter;
      if (firstScreenOptions.length > 1 || onlyNotVisitCenterExists) {
        handleFirstScreen();
      } else {
        dispatch(setServiceTypeOption(firstScreenOptions[0]));
        handleCreateNewAppointment();
      }
    });
  }, [firstScreenOptions, handleFirstScreen, clearData]);

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
          return;
        }
        clearPrevAppointmentData();
        if (needToShowServiceSelection) {
          handleServiceTypeSelection();
        } else {
          redirectToCreateFlow();
          handleSetScreen(getNextScreen());
        }
      });
    },
    [handleSetScreen, onSelectAppointment, needToShowServiceSelection, clearPrevAppointmentData]
  );

  return {
    customerLoadedData,
    isAuthorized,
    isSm,
    t,
    clearData,
    onSelectCar,
    handleAddNewVehicle,
    handleAddNewCarAppointment,
  };
};
