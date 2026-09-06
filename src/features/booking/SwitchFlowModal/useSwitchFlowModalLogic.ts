import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IServiceConsultant, ITransportation } from '../../../api/types';
import { useException } from '../../../hooks/useException/useException';
import { useModal } from '../../../hooks/useModal/useModal';
import { EAppointmentTimingType } from '../../../store/reducers/appointment/types';
import {
  loadAncillaryPriceByZip,
  setServiceTypeOption,
} from '../../../store/reducers/appointmentFrameReducer/actions';
import {
  EAncillaryType,
  EServiceType,
  IAncillaryByZipRequest,
  TAncillaryPriceByZip,
} from '../../../store/reducers/appointmentFrameReducer/types';
import { setUnavailableServiceOpen } from '../../../store/reducers/modals/actions';
import { ETransportationType } from '../../../store/reducers/transportationNeeds/types';
import { RootState } from '../../../store/rootReducer';
import { TParsableDate } from '../../../types/types';
import { TSwitchFlowModalProps } from './types';
import useSwitchFlowModalFlowHandlers from './useSwitchFlowModalFlowHandlers';

const useSwitchFlowModalLogic = ({ open, selectedOption, ...restProps }: TSwitchFlowModalProps) => {
  const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
  const {
    address,
    zipCode: zipCodeValue,
    transportation,
    transportations,
    isPickupDropoffWithoutFirstScreenOption,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const { isUnavailableServiceOpen } = useSelector((state: RootState) => state.modals);

  const [consultant, setConsultant] = useState<IServiceConsultant | null>(null);
  const [transportationOption, setTransportationOption] = useState<ITransportation | null>(null);
  const [timingType, setTimingType] = useState<EAppointmentTimingType>(
    EAppointmentTimingType.FirstAvailable
  );
  const [zip, setZip] = useState<string | null>(null);
  // TODO: replace any once UserLocation address type is formalized.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userAddress, setUserAddress] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<TParsableDate>(null);
  const [isCalendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [isAddressValid, setAddressValid] = useState<boolean>(false);
  const [isAdvisorVisible, setAdvisorVisible] = useState<boolean>(false);
  const [pendingAncillaryPrice, setPendingAncillaryPrice] = useState<TAncillaryPriceByZip | null>(
    null
  );

  const dispatch = useDispatch();
  const showError = useException();
  const {
    isOpen: isAncillaryPriceOpen,
    onOpen: onAncillaryPriceOpen,
    onClose: onAncillaryPriceClose,
  } = useModal();

  const newConfig = config.find(item =>
    selectedOption
      ? item.serviceType === selectedOption.type
      : transportation?.type === ETransportationType.PickUpDelivery
        ? item.serviceType === EServiceType.PickUpDropOff
        : item.serviceType === EServiceType.VisitCenter
  );

  const isPickupDropoffFlow = selectedOption
    ? selectedOption.type === EServiceType.PickUpDropOff
    : transportation?.type === ETransportationType.PickUpDelivery;

  const isDateSelectionOn = Boolean(
    selectedOption &&
    newConfig?.appointmentSelection &&
    selectedOption.type !== EServiceType.PickUpDropOff
  );

  const isTransportationsVisible =
    Boolean(newConfig?.transportationNeeds) && !selectedOption?.transportationOption;

  const isAddressVisible = Boolean(isPickupDropoffFlow);

  const nextButtonIsDisabled = useMemo(
    () => !isAddressValid || (isTransportationsVisible && !transportationOption),
    [isAddressValid, isTransportationsVisible, transportationOption]
  );

  useEffect(() => {
    if (open) {
      const someFilterIsAvailable =
        isAddressVisible || isDateSelectionOn || isTransportationsVisible || isAdvisorVisible;
      if (!someFilterIsAvailable && selectedOption) {
        dispatch(setServiceTypeOption(selectedOption));
      }
      setAddressValid(!isPickupDropoffFlow);
    }
  }, [
    dispatch,
    isAddressVisible,
    isDateSelectionOn,
    isTransportationsVisible,
    isAdvisorVisible,
    isPickupDropoffFlow,
    selectedOption,
    open,
  ]);

  useEffect(() => {
    if (userAddress && zip?.length === 5 && open) {
      loadAncillaryPrice(zip, userAddress);
    }
  }, [open]);

  useEffect(() => {
    setAdvisorVisible(!!newConfig?.advisorSelection);
  }, [newConfig]);

  useEffect(() => {
    if (!isDateSelectionOn) {
      setSelectedTime(null);
      setTimingType(EAppointmentTimingType.FirstAvailable);
    }
  }, [isDateSelectionOn]);

  useEffect(() => {
    const addressIsSelectedByUser =
      userAddress != null && address != null && userAddress.label === address.label;
    const zipIsSelectedByUser = zip === zipCodeValue && zipCodeValue?.length === 5;
    if (open && zipIsSelectedByUser && addressIsSelectedByUser) {
      loadAncillaryPrice(zipCodeValue, address);
    } else {
      onAncillaryPriceClose();
    }
  }, [open, zipCodeValue, address, zip, userAddress]);

  useEffect(() => {
    if (open) {
      if (!zip && zipCodeValue) {
        setZip(zipCodeValue);
      }
      if (!userAddress && address) {
        setUserAddress(address);
      }
    }
    return () => {
      setAddressValid(false);
      setZip(null);
      setUserAddress(null);
      setPendingAncillaryPrice(null);
    };
  }, [open, zipCodeValue, address]);

  useEffect(() => {
    if (!isUnavailableServiceOpen && pendingAncillaryPrice && !isAncillaryPriceOpen) {
      if (
        pendingAncillaryPrice.feeAmount === 0 &&
        pendingAncillaryPrice.feeType === EAncillaryType.Amount
      ) {
        setAddressValid(true);
      } else {
        onAncillaryPriceOpen();
      }
      setPendingAncillaryPrice(null);
    }
  }, [isUnavailableServiceOpen, pendingAncillaryPrice, isAncillaryPriceOpen, onAncillaryPriceOpen]);

  const { onCancel, onClickNext, handleNextStep } = useSwitchFlowModalFlowHandlers({
    ...restProps,
    selectedOption,
    transportation,
    transportations,
    transportationOption,
    isPickupDropoffWithoutFirstScreenOption,
    isPickupDropoffFlow,
    userAddress,
    consultant,
    timingType,
    selectedTime,
    zip,
    setConsultant,
    setTransportationOption,
    setUserAddress,
    setZip,
    setCalendarOpen,
    setAddressValid,
    setTimingType,
    setSelectedTime,
    setPendingAncillaryPrice,
    onAncillaryPriceClose,
  });

  const onSuccess = useCallback(
    (data: TAncillaryPriceByZip) => {
      if (isUnavailableServiceOpen) {
        setPendingAncillaryPrice(data);
      } else if (data.feeAmount === 0 && data.feeType === EAncillaryType.Amount) {
        setAddressValid(true);
      } else {
        onAncillaryPriceOpen();
      }
    },
    [isUnavailableServiceOpen, onAncillaryPriceOpen]
  );

  const onUnavailableOpen = () => dispatch(setUnavailableServiceOpen(true));

  const onServiceIsUnavailable = useCallback(() => {
    onAncillaryPriceClose();
    setPendingAncillaryPrice(null);
    setAddressValid(false);
    onUnavailableOpen();
  }, [onAncillaryPriceClose]);

  // TODO: replace any once UserLocation address type is formalized.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadAncillaryPrice = (zipCode: string | null, locationAddress: any) => {
    if (!scProfile) {
      return;
    }

    if (
      locationAddress &&
      zipCode?.length === 5 &&
      (selectedOption
        ? selectedOption.type === EServiceType.PickUpDropOff
        : transportation?.type === ETransportationType.PickUpDelivery)
    ) {
      const data: IAncillaryByZipRequest = {
        address: typeof locationAddress === 'string' ? locationAddress : locationAddress.label,
        zipCode,
        serviceCenterId: scProfile.id,
        serviceTypeOptionId: selectedOption?.id,
        transportationOptionId:
          selectedOption?.transportationOption?.id ?? transportation?.id ?? null,
      };

      dispatch(loadAncillaryPriceByZip(data, onSuccess, showError, onServiceIsUnavailable));
    }
  };

  const onAncillaryPriceAccepted = () => {
    setAddressValid(true);
    onAncillaryPriceClose();
  };

  const onTryAnotherLocation = () => {
    setUserAddress(null);
    setZip(null);
    setAddressValid(false);
  };

  return {
    consultant,
    transportation,
    transportationOption,
    timingType,
    zip,
    userAddress,
    selectedTime,
    isCalendarOpen,
    isAddressVisible,
    isAdvisorVisible,
    isTransportationsVisible,
    isDateSelectionOn,
    isAddressValid,
    nextButtonIsDisabled,
    isUnavailableServiceOpen,
    isAncillaryPriceOpen,
    onAncillaryPriceClose,
    setConsultant,
    setTransportationOption,
    setTimingType,
    setZip,
    setUserAddress,
    setSelectedTime,
    setCalendarOpen,
    setAddressValid,
    setAdvisorVisible,
    loadAncillaryPrice,
    onServiceIsUnavailable,
    onCancel,
    onClickNext,
    handleNextStep,
    onAncillaryPriceAccepted,
    onTryAnotherLocation,
  };
};

export default useSwitchFlowModalLogic;
