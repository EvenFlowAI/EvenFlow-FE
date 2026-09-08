import React from 'react';
import dayjs from 'dayjs';
import { TItem } from './types';
import { getAddressLabel } from './utils';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import { time24HourFormat, timeSpanString } from '../../../../../utils/constants';

type TTranslate = (key: string) => string;

type TServiceValetAppointment = {
  pickUpMin?: string;
  pickUpMax?: string;
  dropOffMin?: string;
  dropOffMax?: string;
} | null;

type TServiceValetTime = {
  pickUpMin?: string;
  pickUpMax?: string;
  dropOffMin?: string;
  dropOffMax?: string;
};

const getTimeSpan = (min?: string, max?: string, t?: TTranslate): string =>
  `${dayjs.utc(min, timeSpanString).format(time24HourFormat)} ${t?.('to')} ${dayjs
    .utc(max, timeSpanString)
    .format(time24HourFormat)}`;

export const withPickUpTime = ({
  list,
  isServiceValetApp,
  isServiceValetManage,
  serviceValetAppointment,
  serviceValetTime,
  showDropOffTime,
  t,
}: {
  list: TItem[];
  isServiceValetApp: boolean;
  isServiceValetManage: boolean;
  serviceValetAppointment: TServiceValetAppointment;
  serviceValetTime?: TServiceValetTime;
  showDropOffTime?: boolean;
  t: TTranslate;
}): TItem[] => {
  if (isServiceValetApp) {
    list.splice(1, 0, {
      label: t('Pick Up Time'),
      content: getTimeSpan(
        serviceValetAppointment?.pickUpMin,
        serviceValetAppointment?.pickUpMax,
        t
      ),
    });
    if (
      showDropOffTime &&
      serviceValetAppointment?.dropOffMin &&
      serviceValetAppointment?.dropOffMax
    ) {
      list.splice(2, 0, {
        label: t('Drop Off Time'),
        content: getTimeSpan(
          serviceValetAppointment.dropOffMin,
          serviceValetAppointment.dropOffMax,
          t
        ),
      });
    }
    return list;
  }

  if (isServiceValetManage) {
    list.splice(1, 0, {
      label: t('Pick Up Time'),
      content: getTimeSpan(serviceValetTime?.pickUpMin, serviceValetTime?.pickUpMax, t),
    });
    if (showDropOffTime && serviceValetTime?.dropOffMin && serviceValetTime?.dropOffMax) {
      list.splice(2, 0, {
        label: t('Drop Off Time'),
        content: getTimeSpan(serviceValetTime.dropOffMin, serviceValetTime.dropOffMax, t),
      });
    }
  }

  return list;
};

export const buildConfirmationItems = ({
  t,
  isServiceValetApp,
  isServiceValetManage,
  dateContent,
  serviceType,
  serviceName,
  addressContent,
  servicesList,
  selectedPriceContent,
  customer,
  companyNameIsOn,
  vehicleData,
}: {
  t: TTranslate;
  isServiceValetApp: boolean;
  isServiceValetManage: boolean;
  dateContent: string | JSX.Element[];
  serviceType: EServiceType;
  serviceName: string;
  addressContent: string;
  servicesList: string[];
  selectedPriceContent: string;
  customer: { fullName: string; companyName?: string; phoneNumber: string; email: string };
  companyNameIsOn?: boolean;
  vehicleData: string | JSX.Element[];
}): TItem[] => {
  return [
    {
      label: isServiceValetApp || isServiceValetManage ? t('Date') : t('Date and time'),
      content: dateContent,
    },
    {
      label: serviceType !== EServiceType.VisitCenter ? t('Location of service') : '',
      content: serviceType !== EServiceType.VisitCenter ? serviceName : '',
    },
    { label: getAddressLabel(serviceType), content: addressContent },
    {
      label: servicesList.length > 1 ? t('Services type') : t('Service type'),
      content: servicesList.map(item => <div key={item}>{item}</div>),
    },
    { label: t('Selected Price'), content: selectedPriceContent },
    { label: t('Name'), content: customer.fullName },
    {
      label: t('Company Name'),
      content: companyNameIsOn && customer.companyName ? customer.companyName : '',
    },
    { label: t('Vehicle'), content: vehicleData },
    { label: t('Phone number'), content: customer.phoneNumber },
    { label: t('Email'), content: customer.email },
  ];
};
