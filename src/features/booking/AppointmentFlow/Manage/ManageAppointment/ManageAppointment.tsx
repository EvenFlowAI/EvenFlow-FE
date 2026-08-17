import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StepWrapper } from '../../../../../components/styled/StepWrapper';
import { ActionButtons } from '../../../ActionButtons/ActionButtons';
import { AppointmentUserData } from '../../Screens/components/AppointmentUserData/AppointmentUserData';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { AppointmentSelectedDate } from '../../Screens/components/AppointmentSelectedDate/AppointmentSelectedDate';
import { AppointmentReminders } from '../../Screens/components/AppointmentReminders/AppointmentReminders';
import { TArgCallback, TCallback, TError } from '../../../../../types/types';
import { decodeSCID, getAppointmentDate } from '../../../../../utils/utils';
import {
  clearAppointmentData,
  createOrUpdateAppointment,
  loadActiveTransportations,
  loadAppointmentRequestsPrices,
  loadConsultantsForUpdating,
  searchForCustomerConsents,
  setAppointmentSaving,
  setCurrentFrameScreen,
  setEditingPosition,
  setServiceOptionChanged,
  setServiceTypeOption,
  setSideBarSteps,
  setVehicle,
  setWelcomeScreenView,
  updateConsultant,
  setReminders,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { useHistory, useParams } from 'react-router-dom';
import {
  loadAllServiceCenterSettings,
  loadSRs,
  setCustomerLoadedData,
  setIsCloneMode,
  setIsDemandSmoothMode,
  setIsEditMode,
} from '../../../../../store/reducers/appointment/actions';
import AppointmentVehicleInfo from '../../Screens/components/AppointmentVehicleInfo/AppointmentVehicleInfo';
import PaymentTypeModal from '../../../PaymentTypeModal/PaymentTypeModal';
import { useTranslation } from 'react-i18next';
import ServiceRequestsManaging from './ServiceRequestsManaging/ServiceRequestsManaging';
import { SelectedPriceManaging } from './SelectedPriceManaging/SelectedPriceManaging';
import ServiceTypeManaging from './ServiceTypeManaging/ServiceTypeManaging';
import { ReviewManaging } from './ReviewManaging/ReviewManaging';
import ConfirmCancelUpdate from './ConfirmCancelUpdateModal/ConfirmCancelUpdate';
import { ILoadedVehicle } from '../../../../../api/types';
import { loadCategoriesByQuery } from '../../../../../store/reducers/categories/actions';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import {
  setChangesCompletedOpen,
  setSlotsWarningOpen,
} from '../../../../../store/reducers/modals/actions';
import { API } from '../../../../../api/api';
import { isMobile } from 'react-device-detect';
import DetailedFeesManage from '../../Create/AppointmentConfirmation/DetailedFees/DetailedFeesManage';
import { loadFirstScreenOptionsByQuery } from '../../../../../store/reducers/serviceTypes/actions';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import AddressManaging from './AddressManaging/AddressManaging';
import { ButtonWrapper, ManageTitle, Wrapper } from './styles';
import { useModal } from '../../../../../hooks/useModal/useModal';
import { useConfirm } from '../../../../../hooks/useConfirm/useConfirm';
import { useMessage } from '../../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../../hooks/useException/useException';
import { useCurrentUser } from '../../../../../hooks/useCurrentUser/useCurrentUser';
import { Routes } from '../../../../../routes/constants';
import CustomerConsents from '../../../../../components/modals/booking/CustomerConsents/CustomerConsents';
import OpenModalLink from '../../../../../components/wrappers/OpenModalLink/OpenModalLink';
import MileageModal from '../../../../../components/modals/booking/MileageModal/MileageModal';
import usePopState from '../../../../../hooks/usePopState/usePopState';
import { EContactMethodTypes } from '../../../../../store/reducers/appointment/types';
import { ETransportationType } from '../../../../../store/reducers/transportationNeeds/types';

type TProps = {
  onChangeSlot: TCallback;
  onUpdateAppointment: TArgCallback<ILoadedVehicle>;
};

export const ManageAppointment: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ onChangeSlot, onUpdateAppointment }) => {
  const { isAdvisorAvailable, currentConfig } = useSelector(
    ({ bookingFlowConfig }: RootState) => bookingFlowConfig
  );
  const { scProfile, appointmentWasChanged, serviceValetAppointment, appointment } = useSelector(
    ({ appointment }: RootState) => appointment
  );
  const { isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
  const {
    isAppointmentSaving,
    serviceTypeOption,
    customer,
    selectedVehicle,
    appointmentByKey,
    transportation,
    isConsentsLoading,
    advisor,
    transportations,
    consultants,
    isConsultantsLoading,
    isTransportationsLoading,
  } = useSelector(({ appointmentFrame }: RootState) => appointmentFrame);
  const { isLoading } = useSelector(({ recalls }: RootState) => recalls);
  const { mileage } = useSelector(({ vehicleDetails }: RootState) => vehicleDetails);
  const { firstScreenOptions, isLoading: isFirstScreenOptionsLoading } = useSelector(
    ({ serviceTypes }: RootState) => serviceTypes
  );

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userClickedOnSave, setUserClickedOnSave] = useState<boolean>(false);
  const [pendingSlotChange, setPendingSlotChange] = useState<boolean>(false);
  const appointmentPricesRequestedRef = useRef<boolean>(false);
  const cloneTransportationHandledRef = useRef<string | null>(null);
  const consultantsLoadHandledRef = useRef<string | null>(null);
  const cloneForwardHandledRef = useRef<string | null>(null);
  const cloneMileagePromptedRef = useRef<string | null>(null);
  const currentUser = useCurrentUser();
  const { id } = useParams<{ id: string }>();
  const serviceCenterId = useMemo(() => decodeSCID(id), [id]);
  const { isOpen: isFeesOpen, onClose: onFeesClose, onOpen: onFeesOpen } = useModal();
  const { isOpen: isMileageOpen, onClose: onMileageClose, onOpen: onMileageOpen } = useModal();
  const { isOpen: isPaymentOpen, onClose: onPaymentClose } = useModal();
  const {
    isOpen: isCancelConfirmOpen,
    onClose: onCancelConfirmClose,
    onOpen: onCancelConfirmOpen,
  } = useModal();
  const showError = useException();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { askConfirm } = useConfirm();
  const showMessage = useMessage();
  const history = useHistory();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('smMobile'));
  const { wasWarningShowed } = useSelector((state: RootState) => state.modals);

  const { isCloneMode, customerLoadedData } = useSelector((state: RootState) => state.appointment);

  const serviceType = useMemo(() => {
    if (serviceTypeOption) {
      return serviceTypeOption.type;
    }

    return transportation?.type === ETransportationType.PickUpDelivery
      ? EServiceType.PickUpDropOff
      : EServiceType.VisitCenter;
  }, [serviceTypeOption, transportation]);

  const isAuthorized = useMemo(
    () => currentUser && currentUser.dealershipId === scProfile?.dealershipId,
    [currentUser, scProfile]
  );

  const isEmailRequired = useMemo(() => {
    return currentUser
      ? Boolean(scProfile?.emailRequirement?.adminAndEmployeesEnabled)
      : Boolean(scProfile?.emailRequirement?.customerSelfServiceEnabled);
  }, [currentUser, scProfile]);

  const redirectToWelcomeScreens = () => {
    history.push(Routes.EndUser.Welcome + '/' + id + '?frame=1');
  };

  usePopState(isAuthorized ? 'serviceCenterSelect' : 'select', redirectToWelcomeScreens);

  const { onOpen, isOpen, onClose } = useModal();

  useEffect(() => {
    if (scProfile?.id) {
      dispatch(loadCategoriesByQuery(scProfile.id));
      dispatch(loadSRs(scProfile.id));
      dispatch(loadAllServiceCenterSettings(scProfile.id));
    }
  }, [dispatch, scProfile?.id]);

  useEffect(() => {
    if (
      currentConfig &&
      scProfile?.id &&
      !firstScreenOptions.length &&
      !isFirstScreenOptionsLoading
    )
      dispatch(loadFirstScreenOptionsByQuery(scProfile.id));
  }, [
    dispatch,
    currentConfig,
    scProfile?.id,
    firstScreenOptions.length,
    isFirstScreenOptionsLoading,
  ]);

  useEffect(() => {
    if (!appointmentWasChanged) {
      appointmentPricesRequestedRef.current = false;
      return;
    }

    if (scProfile?.id && !appointmentPricesRequestedRef.current) {
      appointmentPricesRequestedRef.current = true;
      dispatch(loadAppointmentRequestsPrices(scProfile.id));
    }
  }, [dispatch, scProfile?.id, appointmentWasChanged]);

  useEffect(() => {
    dispatch(setReminders([EContactMethodTypes.Email, EContactMethodTypes.Sms]));
  }, []);

  useEffect(() => {
    // In clone mode: load active transportation for non-mobile services; for mobile services, refresh slots.
    if (!appointmentByKey || !isCloneMode) {
      cloneTransportationHandledRef.current = null;
      return;
    }

    const cloneKey = appointmentByKey.hashKey ?? String(appointmentByKey.id);
    const isMobileService = appointmentByKey.serviceTypeOption?.type === EServiceType.MobileService;
    const handledKey = `${cloneKey}:${isMobileService ? 'mobile-slot' : 'transportations'}`;

    if (cloneTransportationHandledRef.current === handledKey) {
      return;
    }

    if (isMobileService) {
      cloneTransportationHandledRef.current = handledKey;
      onChangeSlot();
      return;
    }

    if (!isTransportationsLoading) {
      cloneTransportationHandledRef.current = handledKey;
      dispatch(loadActiveTransportations(serviceCenterId));
    }
  }, [
    appointmentByKey,
    dispatch,
    isCloneMode,
    isTransportationsLoading,
    onChangeSlot,
    serviceCenterId,
  ]);

  useEffect(() => {
    if (
      appointmentByKey &&
      !appointmentByKey?.vehicle?.mileage &&
      !selectedVehicle?.mileage &&
      !isCloneMode
    ) {
      onMileageOpen();
    }
  }, [appointmentByKey, selectedVehicle]);

  const handleConsultants = () => {
    if (appointmentByKey) {
      console.log('test f');
      dispatch(
        loadConsultantsForUpdating(
          id,
          appointmentByKey?.serviceTypeOption ? appointmentByKey?.serviceTypeOption.id : null,
          appointmentByKey,
          () => {
            dispatch(updateConsultant(appointmentByKey.advisorId));
          }
        )
      );
    }
  };

  useEffect(() => {
    const advisorShouldBeSelected = appointmentByKey?.advisorId && !advisor;
    if (!advisorShouldBeSelected || !selectedVehicle?.mileage) {
      return;
    }

    const consultantAlreadyLoaded = consultants?.some(
      consultant => consultant.id === appointmentByKey?.advisorId
    );
    if (consultantAlreadyLoaded) {
      dispatch(updateConsultant(appointmentByKey?.advisorId));
      consultantsLoadHandledRef.current = null;
      return;
    }

    const consultantsLoadKey = `${appointmentByKey?.hashKey ?? appointmentByKey?.id}:${
      appointmentByKey?.advisorId
    }:${selectedVehicle.mileage}`;

    if (isConsultantsLoading) {
      if (!consultantsLoadHandledRef.current) {
        consultantsLoadHandledRef.current = consultantsLoadKey;
      }
      return;
    }

    if (consultantsLoadHandledRef.current === consultantsLoadKey) {
      return;
    }

    consultantsLoadHandledRef.current = consultantsLoadKey;
    handleConsultants();
  }, [selectedVehicle?.mileage, appointmentByKey, advisor, consultants, isConsultantsLoading]);

  useEffect(() => {
    if (advisor) {
      consultantsLoadHandledRef.current = null;
    }
  }, [advisor]);

  const checkIsValid = () => {
    let isValid = true;
    const localErrors: string[] = [];
    if (!customer.email && isEmailRequired) {
      isValid = false;
      localErrors.push('email');
      showError(t('\"Email\" must not be empty'));
    }
    if (!customer?.fullName) {
      isValid = false;
      localErrors.push('fullname');
      showError(t('"Full Name" must not be empty'));
    }
    if (!customer?.phoneNumber) {
      isValid = false;
      localErrors.push('phonenumber');
      showError(t('"Phone Number" must not be empty'));
    }
    if (
      serviceType === EServiceType.PickUpDropOff &&
      !serviceValetAppointment &&
      !appointmentByKey?.serviceValetTime
    ) {
      isValid = false;
      showError(t('Please select correct Appointment Date and Time'));
    }
    if (
      serviceType !== EServiceType.PickUpDropOff &&
      !appointment &&
      appointmentByKey?.serviceValetTime
    ) {
      isValid = false;
      showError(t('Please select correct Appointment Date and Time'));
    }
    setErrors(localErrors);
    return isValid;
  };

  const handleError = (e: any) => {
    const timeSlotUnavailable = e.response?.data?.message?.toLowerCase().includes('time slot');
    const transportationUnavailable = e.response?.data?.message
      ?.toLowerCase()
      .includes('transportation option');
    const dateForZoneUnavailable = e.response?.data?.message
      ?.toLowerCase()
      .includes('is not available for this geographic zone or for the date');
    const internalError = e.response?.data?.message?.toLowerCase().includes('internal server');
    if (timeSlotUnavailable || dateForZoneUnavailable || transportationUnavailable) {
      dispatch(setChangesCompletedOpen(false));
      dispatch(setSlotsWarningOpen(true));
    } else if (internalError) {
      showError(
        `We're sorry. Something went wrong on our end. Please try again shortly. Error identifier: ${e.response?.data?.id ?? 'unknown'}`
      );
    } else {
      showError(e);
    }
    if (e.response?.data?.errors) {
      const data = [...e.response.data.errors];
      setErrors(() => {
        return data.map((err: TError): string =>
          err.field?.includes('.') ? err.field?.split('.')[1].toLowerCase() : err.field
        );
      });
    }
  };
  const onNext = (): Promise<void> => {
    return new Promise(resolve => {
      dispatch(setCurrentFrameScreen('appointmentConfirmed'));
      resolve();
    });
  };

  const handleCreateAppointment = () => {
    if (isAppointmentSaving) {
      return;
    }

    setUserClickedOnSave(true);
    const mileageIsValid =
      selectedVehicle?.mileage &&
      mileage.find(item => item.value.toString() === selectedVehicle?.mileage?.toString());
    if (!mileageIsValid && !isMileageOpen) {
      onMileageOpen();
    } else {
      if (checkIsValid()) {
        onMileageClose();
        dispatch(
          createOrUpdateAppointment(
            serviceCenterId,
            onNext,
            handleError,
            isMobile,
            Boolean(currentUser)
          )
        );
      }
    }
  };

  const searchForConsents = () => {
    if (isConsentsLoading || isAppointmentSaving) {
      return;
    }

    dispatch(searchForCustomerConsents(handleCreateAppointment));
  };

  const onCancelChanges = () => {
    setLoading(true);
    if (selectedVehicle) {
      const vehicle = {
        ...selectedVehicle,
        vin: appointmentByKey?.vehicle?.vin ?? '',
        mileage: appointmentByKey?.vehicle?.mileage ?? null,
        engineTypeId: appointmentByKey?.vehicle?.engineTypeId ?? null,
      };
      dispatch(setVehicle(vehicle));
      dispatch(clearAppointmentData());
      dispatch(setServiceOptionChanged(false));
      onUpdateAppointment(vehicle);
      setTimeout(() => setLoading(false), 3000);
    }
  };

  const handleCancelAppointment = async () => {
    if (appointmentByKey) {
      try {
        dispatch(setAppointmentSaving(true));
        const key = appointmentByKey.hashKey;
        await API.appointment.cancelByKey(key);
        showMessage(
          <div>
            Your appointment has been canceled. <br />
            Please do not forget to update the appointment in your calendar.
          </div>
        );
        dispatch(setSideBarSteps([]));
        dispatch(setServiceOptionChanged(false));
        dispatch(setVehicle(null));
        dispatch(clearAppointmentData());
        dispatch(setServiceTypeOption(null));
        dispatch(setCustomerLoadedData(null));
        dispatch(setWelcomeScreenView('select'));
        dispatch(setIsCloneMode(false));
        dispatch(setIsEditMode(false));
        dispatch(setIsDemandSmoothMode(false));
        history.push(Routes.EndUser.Welcome + '/' + id + '?frame=1');
      } catch (e) {
        showError(e);
      } finally {
        dispatch(setAppointmentSaving(false));
      }
    }
  };

  const onCancelAppointment = () => {
    if (appointmentByKey) {
      askConfirm({
        isRemove: true,
        confirmContent: 'Cancel appointment',
        title: 'Cancel appointment',
        content: (
          <span>
            {t('Please confirm you want to cancel appointment on')}{' '}
            {getAppointmentDate(appointmentByKey)}?
          </span>
        ),
        onConfirm: handleCancelAppointment,
        isBooking: true,
      });
    }
  };

  const onSaveMileage = () => {
    userClickedOnSave ? handleCreateAppointment() : onMileageClose();
  };
  const showLoader = isAppointmentSaving || isConsentsLoading || isCloneMode;

  useEffect(() => {
    // moving to the next step after updating advisor
    if (advisor && pendingSlotChange && isCloneMode) {
      onChangeSlot();
      setPendingSlotChange(false);
    }
  }, [advisor, pendingSlotChange, isCloneMode, onChangeSlot]);

  const handleChangeSlot = () => {
    if (customerLoadedData?.isUpdating) {
      dispatch(setEditingPosition('slot'));
      dispatch(setServiceOptionChanged(false));
    }
    if (!isAppointmentSaving) {
      if (isTransportationAvailable && !transportation && !wasWarningShowed) {
        dispatch(setSlotsWarningOpen(true));
      } else {
        if (appointmentByKey?.advisorId && !advisor) {
          setPendingSlotChange(true); // waiting updating advisor
        } else {
          onChangeSlot(); // advisor selected
        }
      }
    }
  };

  const forwardNextStepCloning = () => {
    if (appointmentByKey) {
      // checking if the advisor is available
      const advisorId = consultants?.find(
        consultant => appointmentByKey?.advisorId === consultant.id
      );

      // checking if the transportation is available
      const isSelectedTransportationAvailable = transportations.some(
        transportation => transportation.id === appointmentByKey?.transportationOption?.id
      );
      if (!advisorId) {
        if (isAdvisorAvailable) {
          // fix blicking on the advisor step
          setTimeout(() => {
            onChangeSlot();
          }, 500);
        } else {
          if (isSelectedTransportationAvailable) {
            onChangeSlot();
          } else {
            // we are checking if a transportation step is available on booking configuration,
            // if yes, move to the transportationNeeds screen,
            // if not move to the timing
            if (isTransportationAvailable) {
              dispatch(setCurrentFrameScreen('transportationNeeds'));
            } else {
              onChangeSlot();
            }
          }
        }
      } else {
        if (isSelectedTransportationAvailable) {
          handleChangeSlot();
        } else {
          // we are checking if a transportation step is available on booking configuration,
          // if yes, move to the transportationNeeds screen,
          // if not move to the timing
          if (isTransportationAvailable) {
            dispatch(setCurrentFrameScreen('transportationNeeds'));
          } else {
            handleChangeSlot();
          }
        }
      }
    }
  };

  useEffect(() => {
    if (!isCloneMode || !appointmentByKey) {
      cloneForwardHandledRef.current = null;
      cloneMileagePromptedRef.current = null;
      return;
    }

    const cloneKey = appointmentByKey.hashKey ?? String(appointmentByKey.id);
    const hasMileage = Boolean(appointmentByKey.vehicle.mileage || selectedVehicle?.mileage);

    if (!transportations.length) {
      return;
    }

    if (!hasMileage) {
      if (cloneMileagePromptedRef.current !== cloneKey) {
        cloneMileagePromptedRef.current = cloneKey;
        onOpen();
      }
      return;
    }

    if (!consultants || cloneForwardHandledRef.current === cloneKey) {
      return;
    }

    cloneForwardHandledRef.current = cloneKey;
    forwardNextStepCloning();
  }, [
    appointmentByKey,
    transportations.length,
    selectedVehicle?.mileage,
    consultants,
    isCloneMode,
    onOpen,
  ]);

  const handleBack = () => {
    onCancelConfirmOpen();
  };

  const handleCloseMileageModal = () => {
    onClose();
  };

  const transportationSelected =
    serviceTypeOption?.transportationOption ||
    (!serviceTypeOption
      ? transportation
      : transportation?.type === ETransportationType.PickUpDelivery
        ? false
        : transportation);

  return (
    <StepWrapper style={isXs ? { paddingBottom: 30 } : {}}>
      <ManageTitle>Manage Appointment</ManageTitle>
      <Wrapper>
        {showLoader ? (
          <Loading />
        ) : (
          <React.Fragment>
            <div>
              <AppointmentSelectedDate onChangeSlot={onChangeSlot} />
              <AppointmentVehicleInfo />
              {isLoading ? <Loading /> : <ServiceRequestsManaging />}
              <AddressManaging />
              <SelectedPriceManaging />
              <OpenModalLink onClick={onFeesOpen} text={t('View itemized fees of services')} />
              <ServiceTypeManaging />
              {transportationSelected || isAdvisorAvailable ? <ReviewManaging /> : null}
              {/* <OpenModalLink onClick={onCommentOpen} text={t('View Appointment Comments')} /> */}
            </div>
            <div>
              <AppointmentUserData
                errors={errors}
                setErrors={setErrors}
                isEmailRequired={isEmailRequired}
              />
              <AppointmentReminders isEmailRequired={isEmailRequired} />
            </div>
          </React.Fragment>
        )}
        <MileageModal
          open={isOpen}
          onClose={onClose}
          onSave={handleCloseMileageModal}
          blockClosing
        />
      </Wrapper>
      {/*todo change to open payment window on next*/}
      {showLoader ? null : (
        <ActionButtons
          loading={showLoader}
          nextDisabled={loading || isMileageOpen}
          onBack={handleBack}
          onNext={searchForConsents}
          nextLabel="Confirm Changes"
          prevLabel="Cancel Changes"
        />
      )}
      {showLoader ? null : (
        <ButtonWrapper>
          <Button disabled={showLoader} variant="text" onClick={onCancelAppointment}>
            Cancel Appointment
          </Button>
        </ButtonWrapper>
      )}
      <DetailedFeesManage open={isFeesOpen} onClose={onFeesClose} />
      <PaymentTypeModal open={isPaymentOpen} onClose={onPaymentClose} onNo={searchForConsents} />
      {/* <CommentModal open={isCommentOpen} onClose={onCommentClose} /> */}
      <ConfirmCancelUpdate
        open={isCancelConfirmOpen}
        onClose={onCancelConfirmClose}
        onCancelChanges={onCancelChanges}
      />
      <CustomerConsents onNext={handleCreateAppointment} />
      <MileageModal open={isMileageOpen} onClose={onMileageClose} onSave={onSaveMileage} />
    </StepWrapper>
  );
};
