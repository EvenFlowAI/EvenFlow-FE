import {createAction} from "@reduxjs/toolkit";
import {
    ICustomerWithPhones,
    ICustomerWithVehicles,
    IRepairHistory,
    TCustomerSearchData,
    TSearchCustomerParams
} from "./types";
import {AppThunk, IAPIResponse, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {ActionCreator} from "redux";
import {ICustomerLoadedData, ILoadedVehicle} from "../../../api/types";
import {saveAppointmentReducer, setCustomerLoadedData} from "../appointment/actions";
import {setCurrentFrameScreen} from "../appointmentFrameReducer/actions";

export const getCustomers = createAction<ICustomerWithPhones[]>("CustomerSearch/GetCustomers");
export const setCurrentCustomer = createAction<ICustomerWithPhones|null>("CustomerSearch/SetCurrentCustomer");
export const setLoading = createAction<boolean>("CustomerSearch/SetLoading");
export const setCustomerSearchData = createAction<Partial<TCustomerSearchData>|null>("CustomerSearch/CustomerSearchData");

export const setPaging = createAction<IPagingResponse>("CustomerSearch/SetPaging");
export const setPageData = createAction<Partial<IPageRequest>>("CustomerSearch/SetPageData");
export const getRepairHistory = createAction<IRepairHistory|null>("CustomerSearch/GetRepairHistory");
export const setRepairHistoryLoading = createAction<boolean>("CustomerSearch/SetRepairHistoryLoading");
export const setRepairHistoryPaging = createAction<IPagingResponse>("CustomerSearch/SetRepairHistoryPaging");

// export const loadCustomersByName = (
//     serviceCenterId: number,
//     onSuccess: (count: number) => void,
//     onError: (err: string) => void,
//     firstName?: string,
//     lastName?: string,
// ): AppThunk => (dispatch, getState) => {
//     dispatch(setLoading(true))
//     const {pageSize, pageIndex} = getState().customers.pageData;
//     Api.call<PaginatedAPIResponse<ICustomerByName>>(Api.endpoints.Customers.GetByName, {params: {serviceCenterId, firstName, lastName, pageSize, pageIndex}})
//         .then(result => {
//             if (result.data?.result) {
//                 dispatch(getCustomers(result.data.result))
//                 dispatch(setPaging(result.data.paging))
//                 onSuccess(result.data.result.length)
//             }
//         })
//         .catch(err => {
//             console.log('get customers by name error', err)
//             onError(err)
//         })
//         .finally(() => dispatch(setLoading(false)))
// }

export const loadCustomersBySearchTerm = (
    serviceCenterId: number,
    onSuccess: (count: number) => void,
    onError: (err: string) => void,
    firstName?: string,
    lastName?: string,
    phoneOrEmail?: string,
): AppThunk => (dispatch) => {
    const data: TSearchCustomerParams = {};
    if (phoneOrEmail) data.phoneOrEmail = phoneOrEmail.trim();
    if (firstName) data.firstName = firstName.trim();
    if (lastName) data.lastName = lastName.trim();

    if (Object.keys(data).length) {
        dispatch(setLoading(true))
        Api.call<PaginatedAPIResponse<ICustomerWithPhones>>(Api.endpoints.Customers.GetBySearchTerm,
            {params: {serviceCenterId, ...data, pageSize: 0, pageIndex: 0}})
            .then(result => {
                if (result.data?.result) {
                    dispatch(getCustomers(result.data.result))
                    dispatch(setPaging(result.data.paging))
                    onSuccess(result.data.result.length)
                }
            })
            .catch(err => {
                console.log('get customers by search term error', err)
                onError(err)
            })
            .finally(() => dispatch(setLoading(false)))
    } else {
        onError("Please enter phone, email, first name or last name")
    }
}

export const loadCustomersByPhoneOrEmail = (
    serviceCenterId: number,
    onError: (err: string) => void,
    phoneOrEmail: string,
    onSuccess?: () => void,
    onNullResult?: () => void,
): AppThunk => (dispatch) => {
    dispatch(setLoading(true))
    Api.call<IAPIResponse<ICustomerWithVehicles>>(Api.endpoints.Customers.GetSingleCustomerVehicles,
        {params: {serviceCenterId, phoneOrEmail: phoneOrEmail.trim()}})
        .then(result => {
            if (result.data?.result) {
                const customer = result.data.result;
                // dispatch(getSingleCustomerVehicles(result.data.result))
                const {cellPhone, homePhone, workPhone, vehicles} = customer;
                const phoneNumber = cellPhone ?? homePhone ?? workPhone;
                const vehiclesData = vehicles.map(item => {
                    const vehicle: ILoadedVehicle = {
                        vin: item.vin,
                        year: item.year,
                        make: item.make,
                        model: item.model,
                        mileage: item.mileage,
                        engineTypeId: item.engineTypeId ? +item.engineTypeId : null,
                        appointmentHashKeys: item.appointmentHashKey ? [item.appointmentHashKey] : [],
                    }
                    if (item.hasOrders) vehicle.hasRepairOrders = true;
                    return vehicle;
                })
                const data:ICustomerLoadedData = {
                    emails: customer.email ? [customer.email] : [],
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    fullName: `${customer.firstName} ${customer.lastName}`,
                    id: customer.customerInternalId ? customer.customerInternalId.toString() : '',
                    phoneNumbers: phoneNumber ? [phoneNumber] : [],
                    vehicles: vehiclesData,
                }
                if (customer.city) data.city = customer.city;
                dispatch(setCustomerLoadedData(data));
                dispatch(saveAppointmentReducer());
                dispatch(setCurrentFrameScreen("carSelection"));
                onSuccess && onSuccess();
            } else if (onNullResult) onNullResult()
        })
        .catch(err => {
            console.log('get customers by search term error', err)
            onError(err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const changePageData: ActionCreator<AppThunk> = (payload: Partial<IPageRequest>) => {
    return async dispatch => {
        dispatch(setPageData(payload));
    }
}

export const updateCustomer = (data: ICustomerWithPhones, onSuccess: () => void, onError: (err: string) => void): AppThunk => (dispatch, getState) => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.Customers.Update, {data})
        .then(res => {
            if (res.data) {
                onSuccess();
                const {customers} = getState().customers;
                const customerData:Partial<ICustomerWithPhones> = {
                    cellPhone: res.data.cellPhone,
                    homePhone: res.data.homePhone,
                    otherPhone: res.data.otherPhone,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    address: res.data.address,
                    city: res.data.city,
                    state: res.data.state,
                }
                const filtered = [...customers].map(item => item.customerId === data.customerId ? {...item, ...customerData} : item)
                dispatch(getCustomers(filtered))
            }
        })
        .catch(err => {
            onError(err);
            console.log('update customer err', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadRepairHistory = (serviceCenterId: number, vehicleDmsId: string, pageIndex: number, pageSize: number): AppThunk => dispatch => {
    dispatch(setRepairHistoryLoading(true));
    Api.call(Api.endpoints.Customers.GetRepairHistory, {params: {serviceCenterId, vehicleDmsId, pageIndex, pageSize}})
        .then(result => {
            if (result?.data?.result) {
                dispatch(getRepairHistory(result.data.result))
                dispatch(setRepairHistoryPaging(result.data.paging))
            }
        })
        .catch(err => {
            console.log('get repair history error', err)
        })
        .finally(() => dispatch(setRepairHistoryLoading(false)))
}

export const loadMoreRepairHistory = (serviceCenterId: number, vehicleDmsId: string, pageIndex: number, pageSize: number): AppThunk => (dispatch, getState) => {
    dispatch(setRepairHistoryLoading(true));
    const {repairHistory} = getState().customers;
    Api.call(Api.endpoints.Customers.GetRepairHistory, {params: {serviceCenterId, vehicleDmsId, pageIndex, pageSize}})
        .then(result => {
            if (result?.data?.result?.repairOrders && repairHistory) {
                const data = {...repairHistory, repairOrders: [...repairHistory?.repairOrders, ...result.data.result.repairOrders]}
                dispatch(getRepairHistory(data))
                dispatch(setRepairHistoryPaging(result.data.paging))
            }
        })
        .catch(err => {
            console.log('get repair history error', err)
        })
        .finally(() => dispatch(setRepairHistoryLoading(false)))
}