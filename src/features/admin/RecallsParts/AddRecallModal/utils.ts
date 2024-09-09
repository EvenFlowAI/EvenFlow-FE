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
    if (!form.serviceRequest) showError('"Op Code Assignment" must not be empty')

    return form.recallCampaignNumber.length
        && form.make
        && form.model
        && form.recallComponent.length
        && form.recallSummary.length
        && form.serviceRequest;
}