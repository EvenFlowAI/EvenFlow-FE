import { TArgCallback } from '../../../../types/types';
import { TForm } from './types';

const getValidationMessages = (form: TForm): string[] => {
  const checks: Array<{ invalid: boolean; message: string }> = [
    {
      invalid: !form.recallCampaignNumber?.length && !form.oemProgram?.length,
      message: '"Recall Campaign Number" or "OEM Program" must not be empty',
    },
    {
      invalid: !form.make,
      message: '"Make" must not be empty',
    },
    {
      invalid: !form.models,
      message: '"Chip" must not be empty',
    },
    {
      invalid: Boolean(form.yearTo && form.yearFrom && +form.yearTo < +form.yearFrom),
      message: '"Year To" must not be more than "Year From"',
    },
    {
      invalid: !form.recallComponent?.length,
      message: '"Recall Component" must not be empty',
    },
    {
      invalid: !form.recallSummary,
      message: '"Recall Summary" must not be empty',
    },
    {
      invalid: !form.serviceRequest,
      message: '"Op Code Assignment" must not be empty',
    },
  ];

  return checks.filter(check => check.invalid).map(check => check.message);
};

const hasRequiredFields = (form: TForm): boolean => {
  return [
    Boolean(form.recallCampaignNumber?.length || form.oemProgram?.length),
    Boolean(form.make),
    Boolean(form.models),
    Boolean(form.recallComponent?.length),
    Boolean(form.recallSummary?.length),
    Boolean(form.serviceRequest),
  ].every(Boolean);
};

export const checkIsValid = (form: TForm, showError: TArgCallback<string>) => {
  getValidationMessages(form).forEach(showError);
  return hasRequiredFields(form);
};
