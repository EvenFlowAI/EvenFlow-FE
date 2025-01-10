import React, { Dispatch, SetStateAction, useMemo } from "react";
import { TArgCallback, TView } from "../../../../../types/types";
import { ILoadedVehicle } from "../../../../../api/types";
import YourLocation from "../../Screens/YourLocation/YourLocation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/rootReducer";
import {
  setAddress,
  setCurrentFrameScreen,
  setShowServiceCentersList,
  setWelcomeScreenView,
  setZipCode,
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import { EServiceType } from "../../../../../store/reducers/appointmentFrameReducer/types";
import { Routes } from "../../../../../routes/constants";
import { useHistory, useParams } from "react-router-dom";
import { checkPodChanged } from "../../../../../store/reducers/appointments/actions";
import {
  setServiceWarningOpen,
  setSlotsWarningOpen,
} from "../../../../../store/reducers/modals/actions";
import { useException } from "../../../../../hooks/useException/useException";
import { ETransportationType } from "../../../../../store/reducers/transportationNeeds/types";

type TYourLocationProps = {
  setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
  onGoToFirstScreen: TArgCallback<TView>;
  onUpdateAppointment: (car: ILoadedVehicle) => Promise<void>;
};

const YourLocationManage: React.FC<TYourLocationProps> = ({
  setNeedToShowServiceSelection,
  onGoToFirstScreen,
  onUpdateAppointment,
}) => {
  const {
    appointmentByKey,
    editingPosition,
    serviceTypeOption,
    selectedVehicle,
    zipCode: zipCodeValue,
    serviceOptionChangedFromSlotPage,
    transportation,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const { wasWarningShowed } = useSelector((state: RootState) => state.modals);
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const showError = useException();

  const mobileServiceSelected = useMemo(
    () =>
      serviceTypeOption?.type === EServiceType.MobileService &&
      appointmentByKey?.serviceTypeOption &&
      appointmentByKey?.serviceTypeOption?.type !== EServiceType.MobileService,
    [serviceTypeOption, appointmentByKey],
  );
  const mobileServiceChanged = useMemo(
    () =>
      serviceTypeOption?.type !== EServiceType.MobileService &&
      appointmentByKey?.serviceTypeOption?.type === EServiceType.MobileService,
    [serviceTypeOption, appointmentByKey],
  );
  const managedToPickUp = useMemo(
    () =>
      serviceTypeOption?.type === EServiceType.PickUpDropOff &&
      appointmentByKey?.serviceTypeOption &&
      appointmentByKey?.serviceTypeOption?.type !== EServiceType.PickUpDropOff,
    [serviceTypeOption, appointmentByKey],
  );
  const changedToPickUpFromSlots = useMemo(
    () =>
      serviceTypeOption?.type === EServiceType.PickUpDropOff &&
      (serviceOptionChangedFromSlotPage ||
        transportation?.type === ETransportationType.PickUpDelivery),
    [serviceOptionChangedFromSlotPage, serviceTypeOption, transportation],
  );

  const setPrevServiceType = () => {
    if (mobileServiceSelected || mobileServiceChanged) {
      selectedVehicle && onUpdateAppointment(selectedVehicle);
    }
  };

  const restoreAddress = () => {
    dispatch(setAddress(appointmentByKey?.address?.fullAddress ?? null));
    dispatch(setZipCode(appointmentByKey?.address?.zipCode ?? ""));
  };

  const goToFirstScreen = async () => {
    await dispatch(setShowServiceCentersList(false));
    await dispatch(setWelcomeScreenView("serviceSelect"));
    history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
  };

  const onBackFromManage = () => {
    setPrevServiceType();
    restoreAddress();
    if (editingPosition === "address") {
      dispatch(setCurrentFrameScreen("manageAppointment"));
    } else {
      goToFirstScreen().then();
    }
  };

  const handleManagingFlow = () => {
    if (
      (mobileServiceSelected || mobileServiceChanged) &&
      editingPosition === "serviceOption"
    ) {
      dispatch(setServiceWarningOpen(true));
    } else if (managedToPickUp && !wasWarningShowed) {
      dispatch(setSlotsWarningOpen(true));
    } else {
      scProfile && dispatch(checkPodChanged(scProfile.id, showError));
    }
  };

  const onNextStep = () => {
    if (
      (mobileServiceSelected || mobileServiceChanged) &&
      editingPosition === "serviceOption"
    ) {
      handleManagingFlow();
    } else {
      changedToPickUpFromSlots ||
      (appointmentByKey?.address?.zipCode &&
        zipCodeValue !== appointmentByKey?.address?.zipCode)
        ? scProfile && dispatch(checkPodChanged(scProfile.id, showError))
        : handleManagingFlow();
    }
  };

  return (
    <YourLocation
      onBack={onBackFromManage}
      onNext={onNextStep}
      setNeedToShowServiceSelection={setNeedToShowServiceSelection}
      isManagingFlow
      onGoToFirstScreen={onGoToFirstScreen}
    />
  );
};

export default YourLocationManage;
