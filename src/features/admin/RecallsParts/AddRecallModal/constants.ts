import {TForm} from "./types";
import {getYearOptions} from "../../../../utils/utils";

export const initialForm: TForm = {
    recallCampaignNumber: '',
    make: null,
    model: null,
    yearTo: '',
    yearFrom: '',
    recallComponent: '',
    recallSummary: '',
    partLeadDaysCount: '',
    dailyPartsCount: '',
    serviceRequest: null,
}
export const yearOptions = getYearOptions()