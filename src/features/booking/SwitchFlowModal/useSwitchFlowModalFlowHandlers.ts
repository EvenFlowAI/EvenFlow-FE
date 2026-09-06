import { Dispatch, SetStateAction, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { IServiceConsultant, ITransportation } from '../../../api/types';
import {
  selectAppointment,
  selectServiceValetAppointment,
} from '../../../store/reducers/appointment/actions';
import { EAppointmentTimingType } from '../../../store/reducers/appointment/types';
import {
  loadActiveTransportations,
  setCity,
  setFilteredZipCodes,
  setIsPickupDropoffWithoutFirstScreenOption,
  setPoliticalState,
  setStreetName,
  setTransportation,
  updateAppointmentDetails,
} from '../../../store/reducers/appointmentFrameReducer/actions';
import {
  EServiceType,
  TAncillaryPriceByZip,
} from '../../../store/reducers/appointmentFrameReducer/types';
import { IFirstScreenOption } from '../../../store/reducers/serviceTypes/types';
import { ETransportationType } from '../../../store/reducers/transportationNeeds/types';
import { TCallback, TParsableDate } from '../../../types/types';
import { decodeSCID } from '../../../utils/utils';
import { parseGeoCode } from '../AppointmentFlow/Screens/YourLocation/utils';

type TProps = {
  onClose: TCallback;
  onNext?: TCallback;
  selectedOption: IFirstScreenOption | null;
  lastTransportation?: ITransportation | null;
  resetLastTransportation?: TCallback;
  transportation: ITransportation | null;
  transportations: ITransportation[];
  transportationOption: ITransportation | null;
  isPickupDropoffWithoutFirstScreenOption: boolean;
  isPickupDropoffFlow: boolean | undefined;
  // TODO: replace any once UserLocation address type is formalized.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userAddress: any;
  consultant: IServiceConsultant | null;
  timingType: EAppointmentTimingType;
  selectedTime: TParsableDate;
  zip: string | null;
  setConsultant: Dispatch<SetStateAction<IServiceConsultant | null>>;
  setTransportationOption: Dispatch<SetStateAction<ITransportation | null>>;
  // TODO: replace any once UserLocation address type is formalized.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUserAddress: Dispatch<SetStateAction<any>>;
  setZip: Dispatch<SetStateAction<string | null>>;
  setCalendarOpen: Dispatch<SetStateAction<boolean>>;
  setAddressValid: Dispatch<SetStateAction<boolean>>;
  setTimingType: Dispatch<SetStateAction<EAppointmentTimingType>>;
  setSelectedTime: Dispatch<SetStateAction<TParsableDate>>;
  setPendingAncillaryPrice: Dispatch<SetStateAction<TAncillaryPriceByZip | null>>;
  onAncillaryPriceClose: TCallback;
};

const useSwitchFlowModalFlowHandlers = ({
  onClose,
  onNext,
  selectedOption,
  lastTransportation,
  resetLastTransportation,
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
}: TProps) => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const clearData = useCallback(() => {
    setConsultant(null);
    setTransportationOption(null);
    setUserAddress(null);
    setZip(null);
    dispatch(setFilteredZipCodes([]));
    setCalendarOpen(false);
    setAddressValid(!isPickupDropoffFlow);
    setPendingAncillaryPrice(null);
  }, [
    dispatch,
    isPickupDropoffFlow,
    setAddressValid,
    setCalendarOpen,
    setConsultant,
    setPendingAncillaryPrice,
    setTransportationOption,
    setUserAddress,
    setZip,
  ]);

  const clearDate = useCallback(() => {
    setTimingType(EAppointmentTimingType.FirstAvailable);
    setSelectedTime(null);
  }, [setTimingType, setSelectedTime]);

  const handleClose = useCallback(() => {
    clearData();
    if (resetLastTransportation) {
      resetLastTransportation();
    }
    onClose();
  }, [clearData, onClose, resetLastTransportation]);

  const clearPrevAppointments = useCallback(() => {
    dispatch(selectAppointment(null));
    dispatch(selectServiceValetAppointment(null));
  }, [dispatch]);

  const handleNextStep = useCallback(() => {
    if (userAddress?.place_id && userAddress?.label) {
      geocodeByPlaceId(userAddress.place_id).then(res => {
        const data = parseGeoCode(
          res[0].address_components,
          userAddress.label,
          userAddress?.structured_formatting?.main_text,
          userAddress?.structured_formatting?.secondary_text
        );
        if (data.city) dispatch(setCity(data.city));
        if (data.state) dispatch(setPoliticalState(data.state));
        if (data.address) dispatch(setStreetName(data.address));
      });
    }

    const svTransportation = transportations.find(
      currentTransportation => currentTransportation.type === ETransportationType.PickUpDelivery
    );

    let selectedTransportation: ITransportation | null;

    if (isPickupDropoffWithoutFirstScreenOption) {
      selectedTransportation =
        transportations.find(
          currentTransportation => currentTransportation.type === ETransportationType.PickUpDelivery
        ) || null;
    } else {
      selectedTransportation =
        selectedOption?.transportationOption ||
        transportationOption ||
        (selectedOption?.type === EServiceType.PickUpDropOff
          ? svTransportation || null
          : selectedOption?.type === EServiceType.VisitCenter
            ? transportations[0]
            : transportation);
    }

    dispatch(
      updateAppointmentDetails({
        address: userAddress,
        advisor: consultant,
        date: timingType === EAppointmentTimingType.PreferredDate ? selectedTime : null,
        timing: timingType,
        transportation: selectedTransportation,
        zip: zip ? zip.substring(0, 5) : '',
        serviceTypeOption: selectedOption,
      })
    );

    clearPrevAppointments();
    handleClose();

    if (onNext) {
      onNext();
    }
  }, [
    clearPrevAppointments,
    consultant,
    dispatch,
    handleClose,
    isPickupDropoffWithoutFirstScreenOption,
    onNext,
    selectedOption,
    selectedTime,
    timingType,
    transportation,
    transportationOption,
    transportations,
    userAddress,
    zip,
  ]);

  const moveToNextStep = useCallback(() => {
    if (timingType === EAppointmentTimingType.PreferredDate) {
      setCalendarOpen(true);
    } else {
      handleNextStep();
    }
  }, [handleNextStep, setCalendarOpen, timingType]);

  const onClickNext = useCallback(() => {
    dispatch(loadActiveTransportations(decodeSCID(id), moveToNextStep));
  }, [dispatch, id, moveToNextStep]);

  const onCancel = useCallback(() => {
    if (lastTransportation !== undefined) {
      dispatch(setTransportation(lastTransportation));
    } else {
      dispatch(setTransportation(null));
    }

    if (resetLastTransportation) {
      resetLastTransportation();
    }

    clearData();
    clearDate();
    dispatch(setIsPickupDropoffWithoutFirstScreenOption(false));
    onClose();
    onAncillaryPriceClose();
  }, [
    clearData,
    clearDate,
    dispatch,
    lastTransportation,
    onAncillaryPriceClose,
    onClose,
    resetLastTransportation,
  ]);

  return {
    onCancel,
    onClickNext,
    handleNextStep,
  };
};

export default useSwitchFlowModalFlowHandlers;
