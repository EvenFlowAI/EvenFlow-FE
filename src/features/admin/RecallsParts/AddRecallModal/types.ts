import {IMakeExtended, IModel} from "../../../../api/types";
import {IAssignedServiceRequest} from "../../../../store/reducers/serviceRequests/types";

export type TForm = {
    recallCampaignNumber: string;
    make: IMakeExtended|null;
    model: IModel|null;
    yearTo: string;
    yearFrom: string;
    recallComponent: string;
    recallSummary: string;
    partLeadDaysCount: string;
    dailyPartsCount: string;
    serviceRequest: IAssignedServiceRequest|null;
}