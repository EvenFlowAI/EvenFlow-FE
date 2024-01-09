import {TArgCallback} from "../../../../types/types";
import {TForm} from "./types";

export const checkIsValid = (form: TForm, showError: TArgCallback<string>) => {
    if (!form.recallCampaignNumber.length) showError('"Recall Campaign Number" must not be empty')
    if (!form.make) showError('"Make" must not be empty')
    if (!form.model) showError('"Chip" must not be empty')
    if (!form.yearTo?.length) showError('"Year To" must not be empty')
    if (!form.yearFrom?.length) showError('"Year From" must not be empty')
    if (!form.recallComponent.length) showError('"Recall Component" must not be empty')
    if (!form.recallSummary) showError('"Recall Summary" must not be empty')
    if (!form.partLeadDaysCount.length) showError('"Part Lead Dais Count" must not be empty')
    if (+form.partLeadDaysCount < 0) showError('"Part Lead Dais Count" must be equal to or more than "0"')
    if (!form.dailyPartsCount.length) showError('"Daily Parts" must not be empty')
    if (+form.dailyPartsCount < 0) showError('"Daily Parts" must be equal to or more than "0"')
    if (!form.serviceRequest) showError('"Ops Code Assignment" must not be empty')

    return form.recallCampaignNumber.length
        && form.make
        && form.model
        && form.recallComponent.length
        && form.recallSummary.length
        && form.partLeadDaysCount.length
        && Number.isInteger(+form.partLeadDaysCount)
        && +form.partLeadDaysCount >= 0
        && form.dailyPartsCount.length
        && Number.isInteger(+form.dailyPartsCount)
        && +form.dailyPartsCount >= 0
        && form.serviceRequest;
}