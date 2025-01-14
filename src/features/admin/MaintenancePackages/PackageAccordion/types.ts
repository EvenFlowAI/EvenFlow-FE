import { TSummaryCell } from '../types';

export interface IDetailsData {
  invoicedRequestLaborHours: TSummaryCell[];
  complimentaryLaborHours: TSummaryCell[];
  requestsPrice: TSummaryCell[];
  complimentaryPrice: TSummaryCell[];
  suggestedRequestHours: TSummaryCell[];
  suggestedRequestPrice: TSummaryCell[];
  suggestedComplimentaryHours: TSummaryCell[];
  suggestedComplimentaryPrice: TSummaryCell[];
  intervalUpsellLaborHours: TSummaryCell[];
  intervalUpsellPrice: TSummaryCell[];
  suggestedUpsellPrice: TSummaryCell[];
  suggestedUpsellHours: TSummaryCell[];
}
