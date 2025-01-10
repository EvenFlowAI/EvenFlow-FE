import React, { useCallback, useMemo } from "react";
import { TArgCallback, TScreen } from "../../../../../types/types";
import { AppointmentSlots } from "../../Screens/AppointmentSlots/AppointmentSlots";
import { setChangesCompletedOpen } from "../../../../../store/reducers/modals/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/rootReducer";
import { EServiceType } from "../../../../../store/reducers/appointmentFrameReducer/types";

type TAppointmentSelectionProps = {
  handleSetScreen: TArgCallback<TScreen>;
};

const AppointmentSlotsManage: React.FC<TAppointmentSelectionProps> = ({
  handleSetScreen,
}) => {
  const { isTransportationAvailable, isAdvisorAvailable, currentConfig } =
    useSelector((state: RootState) => state.bookingFlowConfig);
  const { serviceTypeOption, prevScreen, isUsualFlowNeeded, appointmentByKey } =
    useSelector((state: RootState) => state.appointmentFrame);
  const dispatch = useDispatch();

  const fromServiceValetToVisitCenter = useMemo(() => {
    return (
      serviceTypeOption?.type === EServiceType.VisitCenter &&
      appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff
    );
  }, [serviceTypeOption, appointmentByKey]);

  const prevScreenIsAvailable = useMemo(() => {
    if (prevScreen === "consultantSelection") return isAdvisorAvailable;
    if (prevScreen === "transportationNeeds") return isTransportationAvailable;
    if (prevScreen === "appointmentTiming")
      return currentConfig?.appointmentSelection;
  }, [
    isAdvisorAvailable,
    prevScreen,
    currentConfig,
    isTransportationAvailable,
  ]);

  const previousLogicalScreen: TScreen = useMemo(() => {
    return !isUsualFlowNeeded && prevScreen && prevScreenIsAvailable
      ? prevScreen
      : currentConfig?.appointmentSelection
        ? "appointmentTiming"
        : !serviceTypeOption?.transportationOption && isTransportationAvailable
          ? "transportationNeeds"
          : isAdvisorAvailable
            ? "consultantSelection"
            : "serviceNeeds";
  }, [
    currentConfig,
    isAdvisorAvailable,
    isTransportationAvailable,
    serviceTypeOption,
    prevScreen,
  ]);

  const askChangesCompleted = useCallback(() => {
    dispatch(setChangesCompletedOpen(true));
  }, []);

  return (
    <AppointmentSlots
      isManaging
      handleSetScreen={handleSetScreen}
      onNext={askChangesCompleted}
      fromServiceValetToVisitCenter={fromServiceValetToVisitCenter}
      prevLogicalScreen={previousLogicalScreen}
    />
  );
};

export default AppointmentSlotsManage;
