import React from "react";
import { ReactComponent as NumberIcon } from "../../../../../assets/img/number.svg";
import { ReactComponent as Done } from "../../../../../assets/img/checkmark.svg";
import { ReactComponent as Clock } from "../../../../../assets/img/clock.svg";
import { ReactComponent as Advisor } from "../../../../../assets/img/advisor.svg";
import { ReactComponent as Price } from "../../../../../assets/img/price.svg";
import { ReactComponent as Settings } from "../../../../../assets/img/settings.svg";
import { ReactComponent as SettingsChecked } from "../../../../../assets/img/settings_checkmark.svg";
import { ReactComponent as Transportation } from "../../../../../assets/img/transportation.svg";
import { ReactComponent as ConvenienceFees } from "../../../../../assets/img/person_dollar.svg";
import { ReactComponent as Address } from "../../../../../assets/img/address.svg";
import { appointmentStatuses, IAppointment } from "../../../../../api/types";
import { DetailsItem } from "../DetailsItem/DetailsItem";
import { TitleWrapper } from "../styles";
import dayjs from "dayjs";
import { EPricingDisplayType } from "../../../../../store/reducers/pricingSettings/types";

export const dateTimeFormat = "ddd, MMM DD, YYYY h:mm a";

export const AppointmentDetails: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ payload: IAppointment }>>
> = ({ payload }) => {
  const hasHiddenPrice = payload.detailedPriceList
    ? payload.detailedPriceList.find(
        (el) =>
          el.pricingDisplayType === EPricingDisplayType.Suppressed ||
          !el.priceValue,
      )
    : payload.servicesRequested.find(
        (el) => el.pricingDisplayType === EPricingDisplayType.Suppressed,
      );

  return (
    <div>
      <TitleWrapper>Appointment Details</TitleWrapper>
      <DetailsItem
        title="Appointment Number"
        text={payload.appointmentNumber}
        icon={<NumberIcon />}
        key="number"
      />
      <DetailsItem
        title="Appointment Status"
        text={
          typeof payload.appointmentStatus !== "undefined" &&
          Number.isInteger(payload.appointmentStatus)
            ? appointmentStatuses[payload.appointmentStatus]
            : ""
        }
        icon={<Done />}
        key="Status"
      />
      <DetailsItem
        title="Scheduled Appointment"
        text={dayjs.utc(payload.dateTime).format(dateTimeFormat)}
        icon={<Clock />}
        key="Scheduled"
      />
      <DetailsItem
        title="Services Selected"
        text={payload.servicesRequested.map(
          (el) => el.code ?? el.description ?? "",
        )}
        icon={<SettingsChecked />}
        key="Services"
      />
      <DetailsItem
        title="Service Option"
        text={payload.serviceOption ?? ""}
        icon={<Settings />}
        key="Option"
      />
      <DetailsItem
        title="Total"
        text={
          payload.totalValue && !hasHiddenPrice
            ? `$${payload.totalValue}`
            : "A full quote will be provided at the dealership"
        }
        icon={<Price />}
        key="Total"
      />
      <DetailsItem
        title="Convenience Fees"
        text={payload.ancillaryPrice ? `$${payload.ancillaryPrice}` : ""}
        icon={<ConvenienceFees />}
        key="Convenience"
      />
      <DetailsItem
        title="Advisor"
        text={payload.advisor ?? ""}
        icon={<Advisor />}
        key="Advisor"
      />
      <DetailsItem
        title="Transportation"
        text={payload.transportation ?? ""}
        icon={<Transportation />}
        key="Transportation"
      />
      <DetailsItem
        title="Address"
        text={
          payload.address
            ? `${payload.address?.fullAddress ?? ""}, ${payload.address?.zipCode ?? ""}`
            : ""
        }
        icon={<Address />}
        key="Address"
      />
    </div>
  );
};
