import { IPagingResponse } from '../../../types/types';
import { IGlobalRecall, ServiceCenterCredit } from '../../../pages/admin/RecallDatabase/types';

export type TState = {
  pagination: IPagingResponse;
  isLoading: boolean;
  recallsDatabase: IGlobalRecall[];
  allGlobalRecalls: IGlobalRecall[];
  manufacturers: string[];
  recallCredits: ServiceCenterCredit[];
};
