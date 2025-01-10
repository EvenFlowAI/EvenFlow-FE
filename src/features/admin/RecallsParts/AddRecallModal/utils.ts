import { TArgCallback } from "../../../../types/types";
import { TForm } from "./types";

export const checkIsValid = (form: TForm, showError: TArgCallback<string>) => {
  if (!form.recallCampaignNumber?.length && !form.oemProgram?.length)
    showError('"Recall Campaign Number" or "OEM Program" must not be empty');
  if (!form.make) showError('"Make" must not be empty');
  if (!form.models) showError('"Chip" must not be empty');
  if (form.yearTo && form.yearFrom && +form.yearTo < +form.yearFrom)
    showError('"Year To" must not be more than "Year From"');
  if (!form.recallComponent?.length)
    showError('"Recall Component" must not be empty');
  if (!form.recallSummary) showError('"Recall Summary" must not be empty');
  if (!form.serviceRequest) showError('"Op Code Assignment" must not be empty');

  return (
    (form.recallCampaignNumber?.length || form.oemProgram?.length) &&
    form.make &&
    form.models &&
    form.recallComponent?.length &&
    form.recallSummary?.length &&
    form.serviceRequest
  );
};
