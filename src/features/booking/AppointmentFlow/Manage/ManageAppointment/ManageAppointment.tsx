import React, { useEffect, useMemo, useState } from 'react';
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
  loadAppointmentRequestsPrices,
  loadConsultantsForUpdating,
  searchForCustomerConsents,
  setAppointmentSaving,
  setCurrentFrameScreen,
  setReminders,
  setServiceOptionChanged,
  setServiceTypeOption,
  setSideBarSteps,
  setVehicle,
  setWelcomeScreenView,
  updateConsultant,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { useHistory, useParams } from 'react-router-dom';
import { loadSRs, setCustomerLoadedData } from '../../../../../store/reducers/appointment/actions';
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
  const {
    isAppointmentSaving,
    serviceTypeOption,
    customer,
    selectedVehicle,
    appointmentByKey,
    transportation,
    isConsentsLoading,
    advisor,
  } = useSelector(({ appointmentFrame }: RootState) => appointmentFrame);
  const { isLoading } = useSelector(({ recalls }: RootState) => recalls);
  const { mileage } = useSelector(({ vehicleDetails }: RootState) => vehicleDetails);
  const { firstScreenOptions } = useSelector(({ serviceTypes }: RootState) => serviceTypes);

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userClickedOnSave, setUserClickedOnSave] = useState<boolean>(false);
  const currentUser = useCurrentUser();
  const { id } = useParams<{ id: string }>();
  const { isOpen: isFeesOpen, onClose: onFeesClose, onOpen: onFeesOpen } = useModal();
  const { isOpen: isMileageOpen, onClose: onMileageClose, onOpen: onMileageOpen } = useModal();
  const { isOpen: isPaymentOpen, onClose: onPaymentClose, onOpen: onPaymentOpen } = useModal();
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

  const { isCloneMode } = useSelector((state: RootState) => state.appointment);

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

  useEffect(() => {
    if (scProfile) {
      dispatch(loadCategoriesByQuery(scProfile.id));
      dispatch(loadSRs(scProfile.id));
    }
  }, [scProfile]);

  useEffect(() => {
    if (currentConfig && scProfile && !firstScreenOptions.length)
      dispatch(loadFirstScreenOptionsByQuery(scProfile.id));
  }, [currentConfig, scProfile, firstScreenOptions?.length]);

  useEffect(() => {
    if (scProfile && appointmentWasChanged) {
      dispatch(loadAppointmentRequestsPrices(scProfile.id));
    }
  }, [scProfile, appointmentWasChanged]);

  useEffect(() => {
    dispatch(setReminders([0, 1]));
  }, []);

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

  const handleConsultants = async () => {
    if (appointmentByKey) {
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
    if (advisorShouldBeSelected && selectedVehicle?.mileage) handleConsultants().then();
  }, [selectedVehicle, appointmentByKey, advisor]);

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
      serviceTypeOption?.type === EServiceType.PickUpDropOff &&
      !serviceValetAppointment &&
      !appointmentByKey?.serviceValetTime
    ) {
      isValid = false;
      showError(t('Please select correct Appointment Date and Time'));
    }
    if (
      serviceTypeOption?.type !== EServiceType.PickUpDropOff &&
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
            decodeSCID(id),
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
  const showLoader = isAppointmentSaving || isConsentsLoading;

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
              {transportation || serviceTypeOption?.transportationOption || isAdvisorAvailable ? (
                <ReviewManaging />
              ) : null}
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
      </Wrapper>
      {/*todo change to open payment window on next*/}
      {showLoader ? null : (
        <ActionButtons
          loading={showLoader}
          nextDisabled={loading || isMileageOpen}
          onBack={onCancelConfirmOpen}
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
