import { TScreen } from "../../types/types";
import { IFirstScreenOption } from "../../store/reducers/serviceTypes/types";
import { useException } from "../useException/useException";
import { useParams } from "react-router-dom";
import {
  checkCarIsValid,
  loadAncillaryPriceByZip,
  loadConsultants,
  setAdvisor,
  setCurrentFrameScreen,
  setServiceOptionChanged,
  setServiceTypeOption,
  setSideBarSteps,
  setTime,
  setTransportation,
} from "../../store/reducers/appointmentFrameReducer/actions";
import { setUnavailableServiceOpen } from "../../store/reducers/modals/actions";
import {
  EServiceType,
  IAncillaryByZipRequest,
} from "../../store/reducers/appointmentFrameReducer/types";
import { setAdvisorAvailable } from "../../store/reducers/bookingFlowConfig/actions";
import { IServiceConsultant } from "../../api/types";
import { TServiceTypeSettings } from "../../store/reducers/bookingFlowConfig/types";
import { decodeSCID } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { ETransportationType } from "../../store/reducers/transportationNeeds/types";
import { setSlotsLoading } from "../../store/reducers/appointment/actions";

export const useServiceOption = (
  optionType: "serviceType" | "transportation",
) => {
  const {
    serviceOptionChangedFromSlotPage,
    address,
    zipCode,
    selectedServiceOptions,
    advisor,
    transportation,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const showError = useException();

  let isTransportationAvailable = true;
  let optionToSwitchTo: IFirstScreenOption | null = null;

  const handleSideBar = (showAdvisorScreen: boolean) => {
    let steps: TScreen[];
    if (optionToSwitchTo?.type === EServiceType.PickUpDropOff) {
      steps = showAdvisorScreen
        ? ["location", "serviceNeeds"]
        : ["location", "serviceNeeds", "consultantSelection"];
    } else {
      steps = showAdvisorScreen
        ? ["serviceNeeds"]
        : ["serviceNeeds", "consultantSelection"];
    }
    dispatch(setSideBarSteps(steps));
  };

  const handleAdvisorSelection = (showAdvisorScreen: boolean) => {
    handleSideBar(showAdvisorScreen);
    if (showAdvisorScreen) {
      dispatch(setCurrentFrameScreen("consultantSelection"));
    } else {
      handleTransportation(isTransportationAvailable);
      if (optionType === "transportation") {
        dispatch(setCurrentFrameScreen("appointmentSelection"));
      }
    }
  };

  const redirectToLocation = () => {
    dispatch(setCurrentFrameScreen("location"));
    dispatch(setSideBarSteps([]));
  };

  const onUnavailableService = () => {
    redirectToLocation();
    dispatch(setUnavailableServiceOpen(true));
  };

  const onValidZip = (
    option: IFirstScreenOption,
    showAdvisorScreen: boolean,
  ) => {
    const optionWasSelectedPreviously = selectedServiceOptions.find(
      (el) => el.id === option.id,
    );
    if (!serviceOptionChangedFromSlotPage || !optionWasSelectedPreviously) {
      redirectToLocation();
    }
    handleAdvisorSelection(showAdvisorScreen);
  };

  const checkAncillaryPriceByZip = (
    option: IFirstScreenOption,
    showAdvisorScreen: boolean,
  ) => {
    if (id && address && zipCode) {
      const data: IAncillaryByZipRequest = {
        address: typeof address === "string" ? address : address.label,
        zipCode: zipCode,
        serviceCenterId: decodeSCID(id),
        serviceTypeOptionId: option.id,
      };
      dispatch(
        loadAncillaryPriceByZip(
          data,
          () => onValidZip(option, showAdvisorScreen),
          showError,
          onUnavailableService,
        ),
      );
    }
  };

  const onRedirectToLocation = (
    option: IFirstScreenOption,
    showAdvisorScreen: boolean,
  ) => {
    const optionWasSelectedPreviously = selectedServiceOptions.find(
      (el) => el.id === option.id,
    );
    const shouldRedirectToLocation =
      !address ||
      !zipCode ||
      !serviceOptionChangedFromSlotPage ||
      !optionWasSelectedPreviously;
    if (address && zipCode) {
      checkAncillaryPriceByZip(option, showAdvisorScreen);
    } else {
      if (shouldRedirectToLocation) {
        redirectToLocation();
      } else {
        handleAdvisorSelection(showAdvisorScreen);
      }
    }
  };

  const redirectToNextScreen = (
    option: IFirstScreenOption,
    showAdvisorScreen: boolean,
  ) => {
    if (option?.type === EServiceType.PickUpDropOff) {
      onRedirectToLocation(option, showAdvisorScreen);
    } else {
      handleAdvisorSelection(showAdvisorScreen);
    }
  };

  const clearAdvisor = () => dispatch(setAdvisor(null));

  const onEmptyList = (
    option: IFirstScreenOption,
    showAdvisorScreen: boolean,
  ) => {
    dispatch(setAdvisorAvailable(false));
    if (option?.type === EServiceType.PickUpDropOff) {
      onRedirectToLocation(option, showAdvisorScreen);
    } else {
      handleSideBar(false);
    }
  };

  const onFullList = (
    data: IServiceConsultant[],
    option: IFirstScreenOption,
    showAdvisorScreen: boolean,
  ) => {
    const prevAdvisor =
      advisor && data.map((el) => el.id).includes(advisor?.id);
    if (prevAdvisor) {
      redirectToNextScreen(option, false);
    } else {
      clearAdvisor();
      redirectToNextScreen(option, showAdvisorScreen);
    }
  };

  const onCarIsValid = (
    option: IFirstScreenOption,
    shouldLoadAdvisors: boolean,
    showAdvisorScreen: boolean,
  ) => {
    const requestDataIsValid =
      option?.type === EServiceType.VisitCenter || Boolean(address && zipCode);
    if (shouldLoadAdvisors && requestDataIsValid) {
      dispatch(
        loadConsultants(
          id,
          option.id,
          () => onEmptyList(option, showAdvisorScreen),
          (data) => onFullList(data, option, showAdvisorScreen),
        ),
      );
    } else {
      if (!showAdvisorScreen) dispatch(setAdvisor(null));
      redirectToNextScreen(option, showAdvisorScreen);
    }
  };

  const handleTransportation = (isTransportationAvailable: boolean) => {
    if (
      isTransportationAvailable &&
      transportation?.type !== ETransportationType.PickUpDelivery
    ) {
      dispatch(setCurrentFrameScreen("transportationNeeds"));
    } else {
      dispatch(setTransportation(null));
    }
  };

  const handleAdvisors = (
    newOption: IFirstScreenOption,
    newConfig?: TServiceTypeSettings,
  ) => {
    const shouldLoadAdvisors =
      newConfig?.advisorSelection &&
      (newOption?.type === EServiceType.VisitCenter ||
        Boolean(
          newOption?.type === EServiceType.PickUpDropOff && address && zipCode,
        ));
    let isAdvisorSelectionOn = Boolean(
      config.find((item) => item.serviceType === newOption.type)
        ?.advisorSelection,
    );
    dispatch(
      checkCarIsValid(
        () =>
          onCarIsValid(
            newOption,
            Boolean(shouldLoadAdvisors),
            isAdvisorSelectionOn,
          ),
        undefined,
        true,
      ),
    );
  };

  return (newOption: IFirstScreenOption) => {
    dispatch(setSlotsLoading(true));
    try {
      optionToSwitchTo = newOption;
      dispatch(setServiceTypeOption(newOption));
      const newConfig = config.find(
        (item) => item.serviceType === newOption.type,
      );
      isTransportationAvailable =
        Boolean(newConfig?.transportationNeeds) &&
        !newOption?.transportationOption;
      if (
        newOption?.type === EServiceType.PickUpDropOff ||
        !newConfig?.appointmentSelection
      )
        dispatch(setTime(null));
      handleAdvisors(newOption, newConfig);
      // handleTransportation(isTransportationAvailable);
      dispatch(setServiceOptionChanged(true));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(setSlotsLoading(false));
    }
  };
};
