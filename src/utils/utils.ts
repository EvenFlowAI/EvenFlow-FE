import { IAddress } from '../store/reducers/dealershipGroups/types';
import { ICurrentUser } from '../store/reducers/users/types';
import { PERMISSIONS } from '../permissions';
import { matchPath } from 'react-router-dom';
import { TRecallForRequest } from '../store/reducers/appointment/types';
import {
  IAppointmentByKey,
  IAppointmentByQuery,
  ILoadedVehicle,
  IMake,
  IModel,
  IOfferForCategory,
} from '../api/types';
import { decode, encode } from 'url-safe-base64';
import { ETransportationType } from '../store/reducers/transportationNeeds/types';
import { EServiceCategoryType, ICategory } from '../store/reducers/categories/types';
import { EOfferType } from '../store/reducers/offers/types';
import {
  EServiceType,
  IValueService,
  TServiceCategory,
} from '../store/reducers/appointmentFrameReducer/types';
import { IRecallByVin } from '../types/types';
import { TOption } from './types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { IAdvisorCapacity, ITechnicianCapacity } from '../store/reducers/employeeCapacity/types';
import { IServiceRequestIds } from '../api/types';
dayjs.extend(utc);

export const getInitials = (name?: string) => {
  if (!name) {
    return '-';
  }
  const data = name.split(' ').slice(0, 2);
  return data
    .filter(v => !!v)
    .map(l => l[0].toUpperCase())
    .join('');
};

const defaultException = 'Something went wrong';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAPIException = (e: any): string => {
  const showId = e?.response?.status === 500;
  return e
    ? e.response?.data?.id && showId && e.response?.data?.message
      ? `${e.response?.data?.message}. Error identifier: ${e.response?.data?.id}`
      : e.response?.data?.message
    : e.message && e.id && showId
      ? `${e.message}. Error identifier: ${e.id}`
      : e.message || defaultException;
};

export const concatAddress = (address?: IAddress, def?: string): string =>
  address ? `${address.street}, ${address.city}, ${address.zipCode}` : def || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pathReplace = (path: string, data?: Record<string, any>): string => {
  if (!data) return path;
  const keys = Object.keys(data).map(k => `{${k}}`);
  const re = new RegExp(keys.join('|'), 'gi');
  return path.replace(re, matched => data[matched.slice(1, -1)] as string);
};
export const noop = () => {};

export const hasPermission = (user: ICurrentUser | undefined, route: string): boolean => {
  if (!user) {
    return true;
  }
  for (const row of PERMISSIONS) {
    if (matchPath(route, row.route)) {
      if (typeof row.roles === 'boolean') {
        return row.roles;
      }
      return row.roles.includes(user.role);
    }
  }
  return true;
};

export const validatePhoneNumber = (value: string): string => {
  if (value) {
    value = `+${value.replace(/[^0-9.]/g, '')}`;
  }
  return value;
};

export const encodeSCID = (id: number): string => {
  return encode(btoa(String(id)));
};

export const decodeSCID = (id: string): number => {
  try {
    return Number(atob(decode(id)));
  } catch {
    return 0;
  }
};

export const getOptions = (optionsArray: string[]): TOption[] => {
  const options: TOption[] = [];
  optionsArray.forEach((option, index) => {
    const array = [];
    for (let i = 0; i < option.length; i++) {
      if (option[i] === option[i].toUpperCase() && i > 0 && Number.isNaN(+option[i - 1])) {
        array.push(' ');
      }
      array.push(option[i]);
    }
    options.push({ name: array.join(''), value: index });
  });
  return options;
};

export const checkEmail = (email: string | undefined): boolean => {
  if (!email) return false;
  const matches = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  return Boolean(matches);
};

export const getTransportationOptionString = (option: string) => {
  const string = ETransportationType[+option];
  const array = [];
  if (string) {
    for (let i = 0; i < string.length; i++) {
      if (string[i] === string[i].toUpperCase() && i > 0) {
        array.push(' ');
      }
      array.push(string[i]);
    }
  }
  return array.join('');
};

export const getOfferString = (offer: IOfferForCategory, isRoundPrice: boolean): string => {
  switch (offer.type) {
    case EOfferType.AmountOff:
      return `$${isRoundPrice ? offer.valueOff : offer.valueOff?.toFixed(2)} Off`;
    case EOfferType.PercentOff:
      return `${offer.valueOff}% Off`;
    case EOfferType.FreeService:
      return offer.title;
    default:
      return '';
  }
};

export const mapRecallsForRequest = (selectedRecalls: IRecallByVin[]): TRecallForRequest[] => {
  return selectedRecalls.map(recall => {
    const data: TRecallForRequest = {
      serviceRequestId: recall.serviceRequestId,
      number: recall.campaignNumber ?? recall.oemProgram,
      recallComponent: recall.recallComponent,
    };
    if (recall.id) data.id = recall.id;
    return data;
  });
};

export const getCategories = (
  allCategories: ICategory[],
  serviceCategories: TServiceCategory[]
): IServiceRequestIds[] => {
  const mergedArray = mergeArrayById(serviceCategories);
  return allCategories
    .filter(category => {
      return (
        category.type === EServiceCategoryType.GeneralCategory &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mergedArray.map((item: any) => item.id).includes(category.id)
      );
    })
    .map(item => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const comment = mergedArray.find((el: any) => el.id === item.id)?.comment ?? '';
      return { id: item.id, comment };
    });
};

export const getVehicleData = (
  selectedVehicle: ILoadedVehicle | null,
  valueService: IValueService | null
): (string | null)[] => {
  const make = selectedVehicle?.make?.length ? selectedVehicle?.make : valueService ? 'BMW' : null;
  const model = selectedVehicle?.model?.length
    ? selectedVehicle?.model
    : valueService?.series?.name
      ? valueService.series.name
      : null;
  const year = selectedVehicle?.year
    ? String(selectedVehicle.year)
    : valueService?.year?.year
      ? String(valueService.year.year)
      : null;
  return [make, model, year];
};

export const disableEmotionWarning = () => {
  const consoleError = console.error;

  console.error = function filterErrors(msg, ...args) {
    if (/server-side rendering/.test(msg)) {
      return;
    }
    consoleError(msg, ...args);
  };
};
export const sortEmployees = (
  a: IAdvisorCapacity | ITechnicianCapacity,
  b: IAdvisorCapacity | ITechnicianCapacity
): number =>
  a.localId && b.localId
    ? a.localId - b.localId
    : a.employeeName
      ? a.employeeName.localeCompare(b.employeeName)
      : a.employeeId.localeCompare(b.employeeId);

export const getAppointmentDate = (
  appointment: IAppointmentByKey | IAppointmentByQuery | null
): string => {
  if (appointment) {
    if (appointment.serviceValetTime) {
      const { serviceValetTime, dateInUtc } = appointment;
      return `${dayjs.utc(`${String(dateInUtc).split('T')[0]}`).format('dddd, MMM Do, ')} 
                from ${dayjs.utc(serviceValetTime.pickUpMin, 'hh:mm:ss').format('h:mm a')} 
                to ${dayjs.utc(serviceValetTime.pickUpMax, 'hh:mm:ss').format('h:mm a')}`;
    } else if (appointment.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
      return dayjs.utc(`${String(appointment.dateInUtc).split('T')[0]}`).format('dddd, MMM Do');
    } else {
      const { dateInUtc, timeSlot } = appointment;
      return dayjs
        .utc(`${String(dateInUtc).split('T')[0]}T${timeSlot}Z`)
        .format('dddd, MMM Do, h:mm a');
    }
  } else {
    return dayjs.utc().format('dddd, MMM Do, h:mm a');
  }
};

interface IMergedCategory {
  id: number;
  comment?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mergeArrayById = (array: any[]): IMergedCategory[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedById = array.reduce((acc: { [key: number]: any }, item) => {
    if (!acc[item.id]) {
      acc[item.id] = { id: item.id };
    }

    if (Object.keys(item).length === 2 && 'comment' in item) {
      acc[item.id].comment = item.comment;
    } else {
      acc[item.id] = {
        ...acc[item.id],
        ...item,
      };
    }

    return acc;
  }, {});

  return Object.values(groupedById);
};

export const mapModelsWithParentNames = (makes: IMake[]) => {
  return makes.map((make: IMake) => {
    return {
      ...make,
      models: make.models.map((model: IModel) => ({
        ...model,
        name:
          !make.isReadOnly && model.name === 'OTHER' ? `${model.name} ${make.name}` : model.name,
      })),
    };
  });
};
