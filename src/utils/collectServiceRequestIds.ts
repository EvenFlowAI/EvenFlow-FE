import { IPackageOptions, IServiceCategory, IServiceRequestIds } from '../api/types';
import { IRecallByVin } from '../types/types';
import { EServiceCategoryType, ICategory } from '../store/reducers/categories/types';
import { TServiceCategory } from '../store/reducers/appointmentFrameReducer/types';

type TCategoryWithRequests = {
  id: number;
  type?: EServiceCategoryType;
  serviceRequests: { id: number }[];
};

/**
 * Service requests already saved on the appointment (received from the `by-key` request).
 * Their `categoryId` is the source of truth and must not be recalculated.
 */
type TExistingServiceRequest = {
  id: number;
  categoryId?: number | null;
};

/**
 * Returns full category data (with service requests) for categories selected during the flow.
 * Used to resolve which category a particular ops code belongs to.
 */
export const getSelectedCategoriesWithRequests = (
  allCategories: ICategory[],
  serviceCategories: TServiceCategory[]
): ICategory[] =>
  allCategories.filter(category => serviceCategories.some(item => item.id === category.id));

/**
 * Resolves the Open Recalls category id for the current flow,
 * so recall ops codes can be sent with their own `categoryId`.
 */
export const getRecallCategoryId = (
  s: IServiceCategory | null,
  sub: IServiceCategory | null,
  allCategories: ICategory[],
  serviceCategories: TServiceCategory[]
): number | undefined => {
  const isRecallCategory = (category?: { type?: EServiceCategoryType } | null) =>
    category?.type === EServiceCategoryType.OpenRecalls;

  // 1. Open Recalls category selected as a current (sub)service
  const currentRecallCategory = [sub, s].find(isRecallCategory);
  if (currentRecallCategory) return currentRecallCategory.id;

  // 2. Open Recalls category selected during the flow
  const selectedRecallCategory = getSelectedCategoriesWithRequests(
    allCategories,
    serviceCategories
  ).find(isRecallCategory);
  if (selectedRecallCategory) return selectedRecallCategory.id;

  // 3. Fallback: recalls can be selected without opening the Open Recalls card
  const recallCategories = allCategories.filter(isRecallCategory);
  const page = sub?.page ?? s?.page;

  return (
    (page !== undefined ? recallCategories.find(category => category.page === page) : undefined)
      ?.id ?? recallCategories[0]?.id
  );
};

const buildCategoryIdByRequestId = (
  s: IServiceCategory | null,
  sub: IServiceCategory | null,
  selectedRecalls?: IRecallByVin[],
  selectedCategories?: TCategoryWithRequests[],
  existingServiceRequests?: TExistingServiceRequest[]
): Map<number, number> => {
  const categoryIdByRequestId = new Map<number, number>();

  // all categories selected during the flow (e.g. Individual Services + Diagnose)
  selectedCategories?.forEach(category => {
    category.serviceRequests?.forEach(serviceRequest => {
      if (!categoryIdByRequestId.has(serviceRequest.id)) {
        categoryIdByRequestId.set(serviceRequest.id, category.id);
      }
    });
  });

  // currently selected sub service has the highest priority
  sub?.serviceRequests?.forEach(serviceRequest => {
    categoryIdByRequestId.set(serviceRequest.id, sub.id);
  });

  // recall ops codes belong to the Open Recalls category even if it has no service requests
  if (selectedRecalls?.length) {
    const recallCategoryId =
      [sub, s].find(category => category?.type === EServiceCategoryType.OpenRecalls)?.id ??
      selectedCategories?.find(category => category.type === EServiceCategoryType.OpenRecalls)?.id;

    if (recallCategoryId !== undefined) {
      selectedRecalls.forEach(recall =>
        categoryIdByRequestId.set(recall.serviceRequestId, recallCategoryId)
      );
    }
  }

  // categories that came from the `by-key` appointment have the highest priority:
  // an already saved `categoryId` must be sent back as is
  existingServiceRequests?.forEach(serviceRequest => {
    if (serviceRequest.categoryId !== undefined && serviceRequest.categoryId !== null) {
      categoryIdByRequestId.set(serviceRequest.id, serviceRequest.categoryId);
    }
  });

  return categoryIdByRequestId;
};

export const collectServiceRequestIds = (
  s: IServiceCategory | null,
  sub: IServiceCategory | null,
  selectedPackage?: IPackageOptions | null,
  individualOpsCodes?: number[],
  selectedRecalls?: IRecallByVin[],
  individualOpsCodesComments?: Record<number, string>,
  selectedCategories?: TCategoryWithRequests[],
  existingServiceRequests?: TExistingServiceRequest[]
): IServiceRequestIds[] => {
  const ids: number[] = [];

  if (selectedRecalls?.length) {
    selectedRecalls.forEach(item => ids.push(item.serviceRequestId));
  }
  if (individualOpsCodes?.length) {
    for (const c of individualOpsCodes) {
      ids.push(c);
    }
  }

  const set = new Set<number>(ids);
  const categoryIdByRequestId = buildCategoryIdByRequestId(
    s,
    sub,
    selectedRecalls,
    selectedCategories,
    existingServiceRequests
  );

  return Array.from(set).map(i => {
    const currComment = individualOpsCodesComments ? individualOpsCodesComments[i] : null;
    const categoryId = categoryIdByRequestId.get(i);
    return {
      id: i,
      comment: currComment ?? '',
      ...(categoryId !== undefined ? { categoryId } : {}),
    };
  });
};
