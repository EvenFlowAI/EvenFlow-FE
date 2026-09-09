import React from 'react';
import dayjs from 'dayjs';
import { RootState } from '../../../../../store/rootReducer';
import { concatAddress } from '../../../../../utils/utils';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import { ETransportationType } from '../../../../../store/reducers/transportationNeeds/types';
import { EPricingDisplayType } from '../../../../../store/reducers/pricingSettings/types';
import { calendarDateFormat, dateTimeString } from '../../../../../utils/constants';

type TFrameState = RootState['appointmentFrame'];
type TAppointmentState = RootState['appointment'];
type TTranslate = (key: string) => string;

type TPriceParams = {
  noDefinedPriceExists: boolean;
  transactionValue: TFrameState['transactionValue'];
  isRoundPrice?: boolean;
  isServiceValetApp: boolean;
  serviceValetAppointment: TAppointmentState['serviceValetAppointment'];
  appointment: TAppointmentState['appointment'];
  packageEMenuType: TFrameState['packageEMenuType'];
  selectedPackage: TFrameState['selectedPackage'];
  t: TTranslate;
};

type TDateParams = {
  isServiceValetApp: boolean;
  serviceValetAppointment: TAppointmentState['serviceValetAppointment'];
  appointment: TAppointmentState['appointment'];
  appointmentByKey: TFrameState['appointmentByKey'];
};

export const resolveServiceType = (
  serviceTypeOption: TFrameState['serviceTypeOption'],
  transportation: TFrameState['transportation']
): EServiceType => {
  if (serviceTypeOption) {
    return serviceTypeOption.type;
  }

  return transportation?.type === ETransportationType.PickUpDelivery
    ? EServiceType.PickUpDropOff
    : EServiceType.VisitCenter;
};

export const hasNoDefinedPrice = ({
  isManagingFlow,
  appointmentRequestsPrices,
  serviceValetAppointment,
  serviceTypeOption,
  transportation,
  appointment,
}: {
  isManagingFlow: boolean;
  appointmentRequestsPrices: TFrameState['appointmentRequestsPrices'];
  serviceValetAppointment: TAppointmentState['serviceValetAppointment'];
  serviceTypeOption: TFrameState['serviceTypeOption'];
  transportation: TFrameState['transportation'];
  appointment: TAppointmentState['appointment'];
}): boolean => {
  if (isManagingFlow) {
    return Boolean(
      appointmentRequestsPrices.find(
        el => !el.priceValue || el.pricingDisplayType === EPricingDisplayType.Suppressed
      )
    );
  }

  if (
    serviceValetAppointment &&
    (serviceTypeOption?.type === EServiceType.PickUpDropOff ||
      transportation?.type === ETransportationType.PickUpDelivery)
  ) {
    return Boolean(
      serviceValetAppointment.serviceRequestPrices?.find(
        item => !item.priceValue || item.pricingDisplayType === EPricingDisplayType.Suppressed
      )
    );
  }

  return Boolean(
    appointment?.serviceRequestPrices?.find(
      item => !item.priceValue || item.pricingDisplayType === EPricingDisplayType.Suppressed
    )
  );
};

export const getAddressText = ({
  serviceType,
  address,
  zipCode,
  serviceCenterAddress,
}: {
  serviceType: EServiceType;
  address: TFrameState['address'];
  zipCode: TFrameState['zipCode'];
  serviceCenterAddress: unknown;
}): string => {
  if (serviceType === EServiceType.VisitCenter) {
    return serviceCenterAddress
      ? concatAddress(serviceCenterAddress as Parameters<typeof concatAddress>[0])
      : '';
  }

  if (!address) {
    return '';
  }

  const line = typeof address === 'string' ? address : (address?.label ?? '');
  return `${line} ${zipCode ?? ''}`;
};

const formatCurrency = (value: number, isRoundPrice?: boolean): string =>
  isRoundPrice ? `$${value}` : `$${value.toFixed(2)}`;

export const getPriceContent = ({
  noDefinedPriceExists,
  transactionValue,
  isRoundPrice,
  isServiceValetApp,
  serviceValetAppointment,
  appointment,
  packageEMenuType,
  selectedPackage,
  t,
}: TPriceParams): string => {
  if (noDefinedPriceExists) {
    return t('A full quote will be provided at the dealership');
  }

  if (!Number.isNaN(transactionValue) && transactionValue > 0) {
    return formatCurrency(transactionValue, isRoundPrice);
  }

  if (isServiceValetApp && serviceValetAppointment?.price?.value) {
    return formatCurrency(serviceValetAppointment.price.value, isRoundPrice);
  }

  if (appointment?.price?.value) {
    return formatCurrency(appointment.price.value, isRoundPrice);
  }

  if ((appointment?.price?.value ?? 0) === 0 && packageEMenuType != null) {
    return formatCurrency(selectedPackage?.price ?? 0, isRoundPrice);
  }

  return t('Will be quoted at the dealership');
};

export const getConfirmedDate = ({
  isServiceValetApp,
  serviceValetAppointment,
  appointment,
  appointmentByKey,
}: TDateParams): string => {
  if (isServiceValetApp) {
    return dayjs.utc(serviceValetAppointment?.date).format(calendarDateFormat);
  }

  if (appointment) {
    return dayjs(appointment.date).format(dateTimeString);
  }

  if (!appointmentByKey?.dateInUtc) {
    return dayjs.utc().format(dateTimeString);
  }

  const isValetByKey =
    appointmentByKey.serviceTypeOption?.type === EServiceType.PickUpDropOff ||
    appointmentByKey.transportationOption?.type === ETransportationType.PickUpDelivery;

  if (isValetByKey) {
    return dayjs(appointmentByKey.dateInUtc).utc().format(calendarDateFormat);
  }

  const [hh, mm] = appointmentByKey.timeSlot.split(':');
  return dayjs(appointmentByKey.dateInUtc)
    .utc()
    .set('hour', Number(hh))
    .set('minute', Number(mm))
    .format(dateTimeString);
};

export const getVehicleData = ({
  selectedVehicle,
  valueService,
  engineName,
}: {
  selectedVehicle: TFrameState['selectedVehicle'];
  valueService: TFrameState['valueService'];
  engineName?: string;
}): string | JSX.Element[] => {
  if (selectedVehicle?.year) {
    return [
      <div key={selectedVehicle.vin}>
        {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
      </div>,
      engineName ? <div key="engineName">{engineName}</div> : <div key="engineName-empty" />,
      selectedVehicle.vin ? <div key="vin">{selectedVehicle.vin}</div> : <div key="vin-empty" />,
    ];
  }

  if (valueService?.year) {
    return `${valueService.year.year} BMW ${valueService.series?.name} ${valueService.model?.name}`;
  }

  return '';
};
