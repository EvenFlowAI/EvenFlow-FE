import React, { useEffect, useState } from "react";
import { StepWrapper } from "../../../../../components/styled/StepWrapper";
import { ActionButtons } from "../../../ActionButtons/ActionButtons";
import { decodeSCID } from "../../../../../utils/utils";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/rootReducer";
import { ITransportation } from "../../../../../api/types";
import {
  loadActiveTransportations,
  setCurrentFrameScreen,
  setSideBarSteps,
  setTiming,
  setTransportation,
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import { Loading } from "../../../../../components/wrappers/Loading/Loading";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";
import { TextWrapper } from "./styles";
import { TActionProps, TCallback } from "../../../../../types/types";
import CustomerConsents from "../../../../../components/modals/booking/CustomerConsents/CustomerConsents";
import { CardsWrapper } from "../../../../../components/wrappers/CardsWrapper/CardsWrapper";
import { TransportationOptionCard } from "./TransportationCard/TransportationOptionCard";
import { ETransportationType } from "../../../../../store/reducers/transportationNeeds/types";
import { EServiceType } from "../../../../../store/reducers/appointmentFrameReducer/types";
import { selectAppointment } from "../../../../../store/reducers/appointment/actions";
import SwitchFlowModal from "../../../SwitchFlowModal/SwitchFlowModal";
import { IFirstScreenOption } from "../../../../../store/reducers/serviceTypes/types";
import { useModal } from "../../../../../hooks/useModal/useModal";

export type TProps = TActionProps & {
  handleConsentsAccepted: TCallback;
};

export const TransportationNeeds: React.FC<TProps> = ({
  onNext,
  onBack,
  handleConsentsAccepted,
}) => {
  const {
    transportation,
    isConsentsLoading,
    trackerData,
    transportations,
    isTransportationsLoading,
    sideBarSteps,
  } = useSelector(({ appointmentFrame }: RootState) => appointmentFrame);
  const { firstScreenOptions } = useSelector(
    ({ serviceTypes }: RootState) => serviceTypes,
  );
  const [selectedOption, setSelectedOption] =
    useState<IFirstScreenOption | null>(null);
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    isOpen: isSwitchFlowOpen,
    onClose: onSwitchFlowClose,
    onOpen: onSwitchFlowOpen,
  } = useModal();

  useEffect(() => {
    dispatch(loadActiveTransportations(decodeSCID(id)));
  }, [id]);

  useEffect(() => {
    if (transportations.length === 1)
      dispatch(setTransportation(transportations[0]));
  }, [transportations]);

  useEffect(() => {
    const index = sideBarSteps.indexOf("transportationNeeds");
    if (!transportation && index > -1 && sideBarSteps.length > index + 1) {
      dispatch(setSideBarSteps(sideBarSteps.slice(0, index + 1)));
      dispatch(setTiming(null));
    }
  }, [transportation]);

  const handleGA = (transportation: ITransportation | null) => {
    ReactGA.event(
      {
        category: "EvenFlow User",
        action: "Selected Transportation Need",
        label: `With Name ${transportation ? transportation.name : "I Will Be Waiting"}`,
      },
      trackerData.ids,
    );
  };

  const clearSteps = () => {
    const index = sideBarSteps.indexOf("transportationNeeds");
    if (index > -1 && sideBarSteps.length > index + 1) {
      dispatch(setSideBarSteps(sideBarSteps.slice(0, index + 1)));
    }
  };

  const switchToServiceValet = () => {
    const serviceValetOption = firstScreenOptions.find(
      (el) => el.type === EServiceType.PickUpDropOff,
    );
    if (serviceValetOption) {
      dispatch(selectAppointment(null));
      dispatch(setTransportation(null));
      setSelectedOption(serviceValetOption);
      onSwitchFlowOpen();
      clearSteps();
    }
  };

  const handleNext = (transportation: ITransportation | null): void => {
    handleGA(transportation);
    if (transportation?.type === ETransportationType.PickUpDelivery) {
      switchToServiceValet();
    } else {
      onNext();
    }
  };

  const handleSelectOption = (o: ITransportation | null) => {
    dispatch(setTransportation(o));
    handleNext(o);
  };

  const onNextFromSwitchFlow = () => {
    dispatch(setCurrentFrameScreen("appointmentSelection"));
  };

  return (
    <StepWrapper>
      {isTransportationsLoading || isConsentsLoading ? (
        <Loading />
      ) : transportations.length ? (
        <CardsWrapper>
          {transportations.map((item) => {
            return (
              <TransportationOptionCard
                key={item.id}
                active={transportation?.id === item.id}
                onSelect={() => handleSelectOption(item)}
                card={item}
              />
            );
          })}
        </CardsWrapper>
      ) : (
        <TextWrapper>
          {t(
            "Based on your selected services, the only available option is to drop off your vehicle and pick it up at your convenience when the service work is completed",
          )}
          .
        </TextWrapper>
      )}
      <ActionButtons
        onBack={onBack}
        nextLabel={t("Next")}
        onNext={() => handleNext(transportation)}
        hideNext={!transportation && !!transportations.length}
        nextDisabled={isTransportationsLoading || isConsentsLoading}
      />
      <CustomerConsents onNext={handleConsentsAccepted} />
      <SwitchFlowModal
        open={isSwitchFlowOpen}
        onClose={onSwitchFlowClose}
        selectedOption={selectedOption}
        onNext={onNextFromSwitchFlow}
      />
    </StepWrapper>
  );
};
