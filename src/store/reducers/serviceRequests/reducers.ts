import {
    IAssignedServiceRequest,
    IAssignedServiceRequestShort,
    ISRAdminFilters,
    IServiceRequest,
    IServiceRequestNonAddedFilter,
    ISRAdmin, IUpsellServiceRequest
} from "./types";
import {IOrder, IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";
import {createReducer} from "@reduxjs/toolkit";
import {
    getNonSelectedServiceRequests,
    setLoadingNonSelected,
    setNonSelectedPageData,
    setNonSelectedPaging,
    setNonSelectedFilter,
    getAssignedServiceRequests,
    setAssignedLoading,
    setAssignedPaging,
    setAssignedPageData,
    setAssignedFilter,
    getUrgentServiceRequests,
    loadingUrgentServiceRequests,
    pagingUrgentServiceRequests,
    pageDataUrgentServiceRequests,
    getNonUrgentServiceRequests,
    loadingNonUrgentServiceRequests,
    pagingNonUrgentServiceRequests,
    pageDataNonUrgentServiceRequests,
    getSCRequestsShort,
    getAdminServiceRequests,
    setLoadingAdmin,
    setAdminPaging,
    setAdminPageData,
    setAdminFilter,
    setAssignedOrdering,
    setNonSelectedOrder,
    getAllAssignedServiceRequests,
    setServiceRequestsPageActiveTab,
    getUpsellServiceRequests,
    setUpsellFilter,
    setUpsellLoading,
    setUpsellOrdering,
    setUpsellPaging, setUpsellPageData,
} from "./actions";
import {defaultOrder} from "../../../config/config";

type TState = {
    adminList: ISRAdmin[];
    adminLoading: boolean;
    adminPaging: IPagingResponse;
    adminPageData: IPageRequest;
    adminFilters: ISRAdminFilters;
    nonSelectedList: IServiceRequest[];
    nonSelectedLoading: boolean;
    nonSelectedPaging: IPagingResponse;
    nonSelectedPageData: IPageRequest;
    nonSelectedOrder: IOrder<IServiceRequest>;
    nonSelectedFilter: IServiceRequestNonAddedFilter;
    assignedList: IAssignedServiceRequest[];
    allAssignedList: IAssignedServiceRequest[];
    assignedOrdering: IOrder<IAssignedServiceRequest>;
    assignedLoading: boolean;
    assignedPaging: IPagingResponse;
    assignedPageData: IPageRequest;
    assignedFilter: IServiceRequestNonAddedFilter;
    urgentList: IAssignedServiceRequestShort[];
    urgentLoading: boolean;
    urgentPaging: IPagingResponse;
    urgentPageData: IPageRequest;
    nonUrgentList: IAssignedServiceRequestShort[];
    nonUrgentLoading: boolean;
    nonUrgentPaging: IPagingResponse;
    nonUrgentPageData: IPageRequest;
    scRequestsShort: IAssignedServiceRequestShort[];
    srPageActiveTab: string;
    intervalUpsellList: IUpsellServiceRequest[];
    upsellOrdering: IOrder<IUpsellServiceRequest>;
    upsellPaging: IPagingResponse;
    upsellPageData: IPageRequest;
    upsellFilter: Partial<IServiceRequestNonAddedFilter>;
    upsellLoading: boolean;
}
const initialState: TState = {
    adminList: [],
    adminLoading: false,
    adminPaging: {...defaultPaging},
    adminPageData: {...defaultPageData},
    adminFilters: {searchTerm: ""},
    nonSelectedList: [],
    nonSelectedOrder: {...defaultOrder},
    nonSelectedLoading: false,
    nonSelectedPaging: {...defaultPaging},
    nonSelectedPageData: {...defaultPageData},
    nonSelectedFilter: {searchTerm: ""},
    assignedList: [],
    allAssignedList: [],
    assignedLoading: false,
    assignedPaging: {...defaultPaging},
    assignedOrdering: {...defaultOrder},
    assignedPageData: {...defaultPageData},
    assignedFilter: {searchTerm: ""},
    urgentList: [],
    urgentLoading: false,
    urgentPaging: {...defaultPaging},
    urgentPageData: {...defaultPageData},
    nonUrgentList: [],
    nonUrgentLoading: false,
    nonUrgentPaging: {...defaultPaging},
    nonUrgentPageData: {...defaultPageData},
    scRequestsShort: [],
    srPageActiveTab: "0",
    intervalUpsellList: [],
    upsellOrdering: {...defaultOrder},
    upsellPaging: {...defaultPaging},
    upsellPageData: {...defaultPageData},
    upsellFilter: {searchTerm: ""},
    upsellLoading: false,
};

export const serviceRequestsReducer = createReducer(
    initialState, builder => builder
        .addCase(getNonSelectedServiceRequests, (state, {payload}) => {
            return {...state, nonSelectedList: payload};
        })
        .addCase(setLoadingNonSelected, (state, {payload}) => {
            return {...state, nonSelectedLoading: payload};
        })
        .addCase(setNonSelectedPaging, (state, {payload}) => {
            return {...state, nonSelectedPaging: payload};
        })
        .addCase(setNonSelectedPageData, (state, {payload}) => {
            return {...state, nonSelectedPageData: {...state.nonSelectedPageData, ...payload}};
        })
        .addCase(setNonSelectedFilter, (state, {payload}) => {
            return {...state, nonSelectedFilter: {...state.nonSelectedFilter, ...payload}};
        })
        .addCase(setNonSelectedOrder, (state, {payload}) => {
            return {...state, nonSelectedOrder: payload, nonSelectedPageData: {...state.nonSelectedPageData, pageIndex: 0}};
        })
        .addCase(getAssignedServiceRequests, (state, {payload}) => {
            return {...state, assignedList: payload};
        })
        .addCase(getAllAssignedServiceRequests, (state, {payload}) => {
            return {...state, allAssignedList: payload};
        })
        .addCase(setAssignedLoading, (state, {payload}) => {
            return {...state, assignedLoading: payload};
        })
        .addCase(setAssignedPaging, (state, {payload}) => {
            return {...state, assignedPaging: payload};
        })
        .addCase(setAssignedPageData, (state, {payload}) => {
            return {...state, assignedPageData: {...state.assignedPageData, ...payload}};
        })
        .addCase(setAssignedFilter, (state, {payload}) => {
            return {...state, assignedFilter: {...state.assignedFilter, ...payload}};
        })
        .addCase(getUrgentServiceRequests, (state, {payload}) => {
            return {...state, urgentList: payload};
        })
        .addCase(loadingUrgentServiceRequests, (state, {payload}) => {
            return {...state, urgentLoading: payload};
        })
        .addCase(pagingUrgentServiceRequests, (state, {payload}) => {
            return {...state, urgentPaging: payload};
        })
        .addCase(pageDataUrgentServiceRequests, (state, {payload}) => {
            return {...state, urgentPageData: {...state.urgentPageData, payload}};
        })
        .addCase(getNonUrgentServiceRequests, (state, {payload}) => {
            return {...state, nonUrgentList: payload};
        })
        .addCase(loadingNonUrgentServiceRequests, (state, {payload}) => {
            return {...state, nonUrgentLoading: payload};
        })
        .addCase(pagingNonUrgentServiceRequests, (state, {payload}) => {
            return {...state, nonUrgentPaging: payload};
        })
        .addCase(pageDataNonUrgentServiceRequests, (state, {payload}) => {
            return {...state, nonUrgentPageData: {...state.urgentPageData, payload}};
        })
        .addCase(getSCRequestsShort, (state, {payload}) => {
            return {...state, scRequestsShort: payload};
        })
        .addCase(getAdminServiceRequests, (state, {payload}) => {
            return {...state, adminList: payload};
        })
        .addCase(setLoadingAdmin, (state, {payload}) => {
            return {...state, adminLoading: payload};
        })
        .addCase(setAdminPaging, (state, {payload}) => {
            return {...state, adminPaging: payload};
        })
        .addCase(setAdminPageData, (state, {payload}) => {
            return {...state, adminPageData: {...state.adminPageData, ...payload}};
        })
        .addCase(setAdminFilter, (state, {payload}) => {
            return {...state, adminFilters: {...state.adminFilters, ...payload}};
        })
        .addCase(setAssignedOrdering, (state, {payload}) => {
            return {...state, assignedOrdering: payload, assignedPageData: {...state.assignedPageData, pageIndex: 0}};
        })
        .addCase(setServiceRequestsPageActiveTab, (state, {payload}) => {
            return {...state, srPageActiveTab: payload};
        })
        .addCase(getUpsellServiceRequests, (state, {payload}) => {
            return {...state, intervalUpsellList: payload};
        })
        .addCase(setUpsellFilter, (state, {payload}) => {
            return {...state, upsellFilter: payload};
        })
        .addCase(setUpsellLoading, (state, {payload}) => {
            return {...state, upsellLoading: payload};
        })
        .addCase(setUpsellOrdering, (state, {payload}) => {
            return {...state, upsellOrdering: payload};
        })
        .addCase(setUpsellPaging, (state, {payload}) => {
            return {...state, upsellPaging: payload};
        })
        .addCase(setUpsellPageData, (state, {payload}) => {
            return {...state, upsellPageData: {...state.upsellPageData, ...payload}};
        })
)