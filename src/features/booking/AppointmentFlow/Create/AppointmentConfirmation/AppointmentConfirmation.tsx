import React, { useEffect, useMemo, useState } from "react";
import { StepWrapper } from "../../../../../components/styled/StepWrapper";
import { ActionButtons } from "../../../ActionButtons/ActionButtons";
import { AppointmentUserData } from "../../Screens/components/AppointmentUserData/AppointmentUserData";
import { AppointmentSelectedDate } from "../../Screens/components/AppointmentSelectedDate/AppointmentSelectedDate";
import { Review } from "./Review/Review";
import { SelectedPrice } from "./SelectedPrice/SelectedPrice";
import { AppointmentReminders } from "../../Screens/components/AppointmentReminders/AppointmentReminders";
import { TActionProps, TCallback, TError } from "../../../../../types/types";
import { decodeSCID } from "../../../../../utils/utils";
import {
  createOrUpdateAppointment,
  setReminders,
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/rootReducer";
import { useParams } from "react-router-dom";
import { loadAllServiceCategories } from "../../../../../store/reducers/appointment/actions";
import AppointmentVehicleInfo from "../../Screens/components/AppointmentVehicleInfo/AppointmentVehicleInfo";
import ServiceRequests from "./ServiceRequests/ServiceRequests";
import DetailedFees from "./DetailedFees/DetailedFees";
import Address from "./Address/Address";
import PaymentTypeModal from "../../../PaymentTypeModal/PaymentTypeModal";
import ServiceType from "./ServiceType/ServiceType";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import { EServiceType } from "../../../../../store/reducers/appointmentFrameReducer/types";
import { Wrapper } from "./styles";
import { useModal } from "../../../../../hooks/useModal/useModal";
import { useException } from "../../../../../hooks/useException/useException";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser/useCurrentUser";
import CommentModal from "../../../../../components/modals/booking/CommentModal/CommentModal";
import OpenModalLink from "../../../../../components/wrappers/OpenModalLink/OpenModalLink";

type TProps = {
  onChangeSlot: TCallback;
} & TActionProps;

export const AppointmentConfirmation: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ onBack, onChangeSlot, onNext }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const { isAdvisorAvailable } = useSelector(
    (state: RootState) => state.bookingFlowConfig,
  );
  const currentUser = useCurrentUser();
  const { scProfile, serviceValetAppointment, appointment } = useSelector(
    (state: RootState) => state.appointment,
  );
  const {
    customer,
    serviceTypeOption,
    transportation,
    isAppointmentSaving: saving,
  } = useSelector((state: RootState) => state.appointmentFrame);

  const { id } = useParams<{ id: string }>();
  const {
    isOpen: isFeesOpen,
    onClose: onFeesClose,
    onOpen: onFeesOpen,
  } = useModal();
  const {
    isOpen: isPaymentOpen,
    onClose: onPaymentClose,
    onOpen: onPaymentOpen,
  } = useModal();
  const {
    isOpen: isCommentOpen,
    onClose: onCommentClose,
    onOpen: onCommentOpen,
  } = useModal();

  const showError = useException();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isEmailRequired = useMemo(() => {
    return currentUser
      ? Boolean(scProfile?.emailRequirement?.adminAndEmployeesEnabled)
      : Boolean(scProfile?.emailRequirement?.customerSelfServiceEnabled);
  }, [currentUser, scProfile]);

  useEffect(() => {
    scProfile && dispatch(loadAllServiceCategories(scProfile.id));
  }, [scProfile]);

  useEffect(() => {
    dispatch(setReminders([0, 2]));
  }, []);

  const checkIsValid = () => {
    let isValid = true;
    const localErrors: string[] = [];
    if (!customer.email && isEmailRequired) {
      isValid = false;
      localErrors.push("email");
      showError('"Email" must not be empty');
    }
    if (!customer?.fullName) {
      isValid = false;
      localErrors.push("fullname");
      showError('"Full Name" must not be empty');
    }
    if (!customer?.phoneNumber) {
      isValid = false;
      localErrors.push("phonenumber");
      showError('"Phone Number" must not be empty');
    }
    const invalidServiceValetSlot =
      serviceTypeOption?.type === EServiceType.PickUpDropOff &&
      !serviceValetAppointment;
    const invalidSlot =
      serviceTypeOption?.type !== EServiceType.PickUpDropOff && !appointment;
    if (invalidServiceValetSlot || invalidSlot) {
      isValid = false;
      showError(
        "Selected date and time are not correct. Please select correct date and time or cancel all changes",
      );
    }
    setErrors(localErrors);
    return isValid;
  };

  const handleError = (e: any) => {
    const internalError = e.response?.data?.message
      ?.toLowerCase()
      .includes("internal server");
    if (internalError) {
      showError(
        `We’re sorry. Something went wrong on our end. Please try again shortly. Error identifier: ${e.response?.data?.id ?? "unknown"}`,
      );
    } else {
      showError(e);
    }
    if (e.response?.data?.errors) {
      const data = [...e.response.data.errors];
      setErrors(() => {
        return data.map((err: TError): string =>
          err.field?.includes(".")
            ? err.field?.split(".")[1].toLowerCase()
            : err.field,
        );
      });
    }
  };

  const handleCreateAppointment = () => {
    if (checkIsValid()) {
      dispatch(
        createOrUpdateAppointment(
          decodeSCID(id),
          onNext,
          handleError,
          isMobile,
          Boolean(currentUser),
        ),
      );
    }
  };

  return (
    <StepWrapper>
      <Wrapper>
        <div>
          <AppointmentSelectedDate onChangeSlot={onChangeSlot} />
          <AppointmentVehicleInfo />
          <ServiceRequests />
          <Address />
          <SelectedPrice />
          <OpenModalLink
            onClick={onFeesOpen}
            text={t("View itemized fees of services")}
          />
          <ServiceType />
          {transportation ||
          serviceTypeOption?.transportationOption ||
          isAdvisorAvailable ? (
            <Review />
          ) : null}
          <OpenModalLink
            onClick={onCommentOpen}
            text={t("View Appointment Comments")}
          />
        </div>
        <div>
          <AppointmentUserData
            errors={errors}
            setErrors={setErrors}
            isEmailRequired={isEmailRequired}
          />
          <AppointmentReminders isEmailRequired={isEmailRequired} />
        </div>
      </Wrapper>
      {/*todo change to open payment window on next*/}
      <ActionButtons
        loading={saving}
        onBack={onBack}
        onNext={handleCreateAppointment}
      />
      <DetailedFees open={isFeesOpen} onClose={onFeesClose} />
      <CommentModal open={isCommentOpen} onClose={onCommentClose} />
      <PaymentTypeModal
        open={isPaymentOpen}
        onClose={onPaymentClose}
        onNo={handleCreateAppointment}
      />
    </StepWrapper>
  );
};
