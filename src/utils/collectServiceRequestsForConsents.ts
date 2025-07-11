import { IServiceCategory } from '../api/types';
import { TServiceCategory } from '../store/reducers/appointmentFrameReducer/types';
import { EServiceCategoryType, ICategory } from '../store/reducers/categories/types';
import { IRecallByVin } from '../types/types';

export const collectServiceRequestsForConsents = (
  s: IServiceCategory | null,
  sub: IServiceCategory | null,
  serviceCategories: TServiceCategory[],
  allCategories: ICategory[],
  individualOpsCodes?: number[],
  selectedRecalls?: IRecallByVin[]
): number[] => {
  const ids = [];

  if (selectedRecalls?.length) {
    selectedRecalls.forEach(item => ids.push(item.serviceRequestId));
  }
  if (individualOpsCodes?.length) {
    for (const c of individualOpsCodes) {
      ids.push(c);
    }
  }
  if (s && s.type === EServiceCategoryType.GeneralCategory) {
    for (const c of s.serviceRequests) {
      ids.push(c.id);
    }
  }
  if (sub && sub.type === EServiceCategoryType.GeneralCategory) {
    for (const c of sub.serviceRequests) {
      ids.push(c.id);
    }
  }

  ids.push(...getServiceRequestIdsFromCategories(allCategories, serviceCategories));

  const set = new Set(ids);
  return Array.from(set);
};

const getServiceRequestIdsFromCategories = (
  allCategories?: ICategory[],
  serviceCategories?: TServiceCategory[]
) => {
  const localIds: number[] = [];
  if (serviceCategories && allCategories?.length) {
    const selected = allCategories.filter(
      item =>
        serviceCategories.map(scItem => scItem.id).includes(item.id) &&
        item.type === EServiceCategoryType.GeneralCategory
    );
    if (selected.length) {
      const array = selected.map(el => el.serviceRequests);
      const serviceRequests = array.flat(1);
      for (const sr of serviceRequests) {
        localIds.push(sr.id);
      }
      return localIds;
    }
  }
  return localIds;
};
