import { createAction } from '@reduxjs/toolkit';
import {
  ICustomerVehicle,
  ICustomerWithPhones,
  ICustomerWithVehicles,
  IRepairHistory,
  IUpdateCustomerData,
  TCustomerSearchData,
  TSearchCustomerParams,
} from './types';
import {
  AppThunk,
  IAPIResponse,
  IPageRequest,
  IPagingResponse,
  PaginatedAPIResponse,
} from '../../../types/types';
import { ActionCreator } from 'redux';
import { ICustomerLoadedData, ILoadedVehicle } from '../../../api/types';
import { saveAppointmentReducer, setCustomerLoadedData } from '../appointment/actions';
import {
  setAddress,
  setCity,
  setCurrentFrameScreen,
  setPoliticalState,
  setZipCode,
} from '../appointmentFrameReducer/actions';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import { AppDispatch } from '../../store';

export const getCustomers = createAction<ICustomerWithPhones[]>('CustomerSearch/GetCustomers');
export const setCurrentCustomer = createAction<ICustomerWithPhones | null>(
  'CustomerSearch/SetCurrentCustomer'
);
export const setLoading = createAction<boolean>('CustomerSearch/SetLoading');
export const setCustomerSearchData = createAction<Partial<TCustomerSearchData> | null>(
  'CustomerSearch/CustomerSearchData'
);

export const setPaging = createAction<IPagingResponse>('CustomerSearch/SetPaging');
export const setPageData = createAction<Partial<IPageRequest>>('CustomerSearch/SetPageData');
export const getRepairHistory = createAction<IRepairHistory | null>(
  'CustomerSearch/GetRepairHistory'
);
export const setRepairHistoryLoading = createAction<boolean>(
  'CustomerSearch/SetRepairHistoryLoading'
);
export const setRepairHistoryPaging = createAction<IPagingResponse>(
  'CustomerSearch/SetRepairHistoryPaging'
);

export const loadCustomersBySearchTerm =
  (
    serviceCenterId: number,
    onSuccess: (count: number) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => void,
    firstName?: string,
    lastName?: string,
    phoneOrEmail?: string,
    address?: string,
    lastVINCharacters?: string,
    companyName?: string
  ): AppThunk =>
  dispatch => {
    const data: TSearchCustomerParams = {};
    if (phoneOrEmail) data.phoneOrEmail = phoneOrEmail.trim();
    if (firstName) data.firstName = firstName.trim();
    if (lastName) data.lastName = lastName.trim();
    if (address) data.address = address.trim();
    if (companyName) data.companyName = companyName.trim();
    if (lastVINCharacters) data.lastVINCharacters = lastVINCharacters.trim();

    if (Object.keys(data).length) {
      dispatch(setLoading(true));
      Api.call<PaginatedAPIResponse<ICustomerWithPhones>>(Api.endpoints.Customers.GetBySearchTerm, {
        params: { serviceCenterId, ...data, pageSize: 0, pageIndex: 0 },
      })
        .then(result => {
          if (result.data?.result) {
            dispatch(getCustomers(result.data.result));
            dispatch(setPaging(result.data.paging));
            onSuccess(result.data.result.length);
          }
        })
        .catch(err => {
          console.log('get customers by search term error', err);
          onError(err);
        })
        .finally(() => dispatch(setLoading(false)));
    } else {
      onError('Please enter phone, email, first name or last name');
    }
  };

const normalizeVehicles = (vehicles: ICustomerVehicle[]) => {
  return vehicles.map(item => {
    const vehicle: ILoadedVehicle = {
      vin: item.vin,
      year: item.year,
      make: item.make,
      model: item.model,
      mileage: item.mileage,
      engineTypeId: item.engineTypeId ? +item.engineTypeId : null,
      appointmentHashKeys: item.appointmentHashKey ? [item.appointmentHashKey] : [],
      hasPlannedAppointment: item.hasPlannedAppointment,
      customerId: item.customerId,
      id: item.vehicleId,
      dmsId: item.vehicleDmsId,
    };
    if (item.hasOrders) vehicle.hasRepairOrders = true;
    return vehicle;
  });
};

const normalizeAddress = (customer: ICustomerWithVehicles, dispatch: AppDispatch) => {
  if (customer.address) {
    const { city, state, zipCode, fullAddress } = customer.address;
    dispatch(setCity(city ?? ''));
    dispatch(setPoliticalState(state ?? ''));
    dispatch(setAddress(fullAddress ?? null));
    dispatch(setZipCode(zipCode ?? ''));
    return customer.address;
  } else {
    return null;
  }
};

export const loadCustomersByPhoneOrEmail =
  (
    serviceCenterId: number,
    onError: (err: string) => void,
    phoneOrEmail: string,
    onSuccess?: () => void,
    onNullResult?: () => void
  ): AppThunk =>
  dispatch => {
    dispatch(setLoading(true));
    Api.call<IAPIResponse<ICustomerWithVehicles>>(
      Api.endpoints.Customers.GetSingleCustomerVehicles,
      { params: { serviceCenterId, phoneOrEmail: phoneOrEmail.trim() } }
    )
      .then(result => {
        if (result.data?.result) {
          const customer = result.data.result;
          const { cellPhone, homePhone, otherPhone, vehicles } = customer;
          const phoneNumber = cellPhone ?? homePhone ?? otherPhone;
          const vehiclesData = normalizeVehicles(vehicles);

          const data: ICustomerLoadedData = {
            emails: customer.email ? [customer.email] : [],
            firstName: customer.firstName,
            middleName: customer.middleName,
            lastName: customer.lastName,
            fullName: [customer.firstName, customer.middleName, customer.lastName]
              .filter(Boolean)
              .join(' '),
            id: customer.customerId ? customer.customerId.toString() : '',
            phoneNumbers: phoneNumber ? [phoneNumber] : [],
            phoneNumbersByCategory: {
              cell: customer.cellPhone,
              home: customer.homePhone,
              work: customer.workPhone,
              other: customer.otherPhone,
            },
            vehicles: vehiclesData,
            companyName: customer.companyName,
            customerProfileType: customer.customerProfileType,
          };
          data.address = normalizeAddress(customer, dispatch);
          dispatch(setCustomerLoadedData(data));
          dispatch(saveAppointmentReducer());
          dispatch(setCurrentFrameScreen('carSelection'));
          if (onSuccess) {
            onSuccess();
          }
        } else if (onNullResult) onNullResult();
      })
      .catch(err => {
        console.log('get customers by search term error', err);
        onError(err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const changePageData: ActionCreator<AppThunk> = (payload: Partial<IPageRequest>) => {
  return async dispatch => {
    dispatch(setPageData(payload));
  };
};

export const updateCustomer =
  (
    data: IUpdateCustomerData | ICustomerWithPhones,
    onSuccess: (customer: IUpdateCustomerData) => void,
    onError: (err: string) => void
  ): AppThunk =>
  (dispatch, getState) => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Customers.Update, { data })
      .then(res => {
        if (res.data) {
          const { customers } = getState().customers;
          const responseData = res.data.result ?? res.data;
          const customerData: Partial<ICustomerWithPhones> = {
            cellPhone: responseData.cellPhone ?? data.cellPhone,
            homePhone: responseData.homePhone ?? data.homePhone,
            workPhone: responseData.workPhone ?? data.workPhone,
            otherPhone: responseData.otherPhone ?? data.otherPhone,
            firstName: responseData.firstName ?? data.firstName,
            middleName: responseData.middleName ?? data.middleName,
            lastName: responseData.lastName ?? data.lastName,
            email: responseData.email ?? data.email,
            address: responseData.address ?? data.address,
            companyName: responseData.companyName ?? data.companyName,
            customerProfileType:
              responseData.customerProfileType ??
              data.customerProfileType ??
              (data as Partial<IUpdateCustomerData>).customerType,
          };
          const filtered = [...customers].map(item =>
            item.customerId === data.customerId ? { ...item, ...customerData } : item
          );
          dispatch(getCustomers(filtered));
          onSuccess({ ...data, ...customerData } as IUpdateCustomerData);
        }
      })
      .catch(err => {
        onError(err);
        console.log('update customer err', err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

export const loadRepairHistory =
  (
    customerId: number | string,
    vehicleId: string | number,
    pageIndex: number,
    pageSize: number
  ): AppThunk =>
  dispatch => {
    dispatch(setRepairHistoryLoading(true));
    Api.call(Api.endpoints.Customers.GetRepairHistory, {
      params: { customerId, vehicleId, pageIndex, pageSize },
    })
      .then(result => {
        if (result?.data?.result) {
          dispatch(getRepairHistory(result.data.result));
          dispatch(setRepairHistoryPaging(result.data.paging));
        }
      })
      .catch(err => {
        console.log('get repair history error', err);
      })
      .finally(() => dispatch(setRepairHistoryLoading(false)));
  };
