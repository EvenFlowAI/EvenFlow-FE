import React, { useMemo } from "react";
import { AppointmentConfirmationTitle } from "../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store/rootReducer";
import { EServiceType } from "../../../../../../store/reducers/appointmentFrameReducer/types";
import { useTranslation } from "react-i18next";
import { IFirstScreenOption } from "../../../../../../store/reducers/serviceTypes/types";
import { TitleWrapper } from "./styles";
import { ConfirmationItemWrapper } from "../../../../../../components/styled/ConfirmationItemWrapper";

const ServiceType = () => {
  const { serviceTypeOption } = useSelector(
    (state: RootState) => state.appointmentFrame,
  );
  const { t } = useTranslation();
  const serviceType = useMemo(
    () =>
      serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter,
    [serviceTypeOption],
  );

  const getServiceName = (
    serviceTypeOption: IFirstScreenOption | null,
    serviceType: EServiceType,
  ) => {
    if (serviceTypeOption?.note) return serviceTypeOption.note;
    if (serviceTypeOption?.name) return serviceTypeOption.name;
    switch (serviceType) {
      case EServiceType.MobileService:
        return t("Mobile Service");
      case EServiceType.PickUpDropOff:
        return t("Pick Up / Drop Off");
      default:
        return t("Visit Center");
    }
  };
  return (
    <ConfirmationItemWrapper>
      <TitleWrapper>
        <AppointmentConfirmationTitle>
          {serviceTypeOption?.note || serviceTypeOption?.name
            ? t("Service Option")
            : t("Location Of Service")}
        </AppointmentConfirmationTitle>
      </TitleWrapper>
      {getServiceName(serviceTypeOption, serviceType)}
    </ConfirmationItemWrapper>
  );
};

export default ServiceType;
