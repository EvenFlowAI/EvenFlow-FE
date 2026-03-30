import { IPagingResponse } from '../../../types/types';
import { IGlobalRecall } from '../../../pages/admin/RecallDatabase/types';

export type TState = {
  pagination: IPagingResponse;
  isLoading: boolean;
  recallsDatabase: IGlobalRecall[];
};
