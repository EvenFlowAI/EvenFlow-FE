import { IPackageOptions, IServiceCategory, IServiceRequestIds } from '../api/types';
import { IRecallByVin } from '../types/types';

export const collectServiceRequestIds = (
  s: IServiceCategory | null,
  sub: IServiceCategory | null,
  selectedPackage?: IPackageOptions | null,
  individualOpsCodes?: number[],
  selectedRecalls?: IRecallByVin[],
  individualOpsCodesComments?: Record<number, string>
): IServiceRequestIds[] => {
  const ids = [];

  if (selectedRecalls?.length) {
    selectedRecalls.forEach(item => ids.push(item.serviceRequestId));
  }
  if (individualOpsCodes?.length) {
    for (const c of individualOpsCodes) {
      ids.push(c);
    }
  }
  const set = new Set(ids);
  return Array.from(set).map(i => {
    const currComment = individualOpsCodesComments ? individualOpsCodesComments[i] : null;
    return { id: i, comment: currComment ?? '' };
  });
};
