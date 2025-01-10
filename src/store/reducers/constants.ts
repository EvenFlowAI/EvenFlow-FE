import { IPageRequest, IPagingResponse } from "../../types/types";
import { defaultRowsPerPage } from "../../config/config";
import { TCustomerSearchData } from "./enhancedCustomerSearch/types";
import { ISCAnalytics } from "./serviceCenters/types";

export const defaultPageData: IPageRequest = {
  pageSize: defaultRowsPerPage,
  pageIndex: 0,
};

export const defaultPaging: IPagingResponse = {
  numberOfRecords: 0,
  numberOfPages: 0,
};

export const initialCustomerSearch: TCustomerSearchData = {
  firstName: "",
  lastName: "",
  companyName: "",
  address: "",
  lastVINCharacters: "",
};

export const blankAnalytics: ISCAnalytics = {
  countOfAppointmentsToday: 0,
  countOfBays: 0,
  countOfPods: 0,
  countOfTechnicians: 0,
};
