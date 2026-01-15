import { CriteriaI, TriggerI } from './Customer/types';
import { Dispatch, SetStateAction } from 'react';

export function numberToOrdinalWord(num: number): string {
  switch (num) {
    case 1:
      return 'First';
    case 2:
      return 'Second';
    case 3:
      return 'Third';
    case 4:
      return 'Fourth';
    case 5:
      return 'Fifth';
    case 6:
      return 'Sixth';
    case 7:
      return 'Seventh';
    case 8:
      return 'Eighth';
    case 9:
      return 'Ninth';
    case 10:
      return 'Tenth';
    default:
      return num.toString();
  }
}

export const validateGroup = <T>(arr: T[], validator: (el: T) => boolean): boolean => {
  return arr.length === 0 || arr.every(validator);
};

export const states = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WI',
  'WY',
];

// helpers/validationHelpers.ts
export const validateCriteriaOperator = (
  criterias: CriteriaI[],
  setCriteriaOperatorErrors: Dispatch<
    SetStateAction<{
      [index: number]: boolean;
    }>
  >
) => {
  const errors: { [index: number]: boolean } = {};
  criterias.forEach((c, i) => {
    if (!c.operator) errors[i] = true;
  });
  setCriteriaOperatorErrors(errors);
  return errors;
};

export const validateCriteriaType = (
  criterias: CriteriaI[],
  setCriteriaTypeErrors: Dispatch<
    SetStateAction<{
      [index: number]: boolean;
    }>
  >
) => {
  const errors: { [index: number]: boolean } = {};
  criterias.forEach((c, i) => {
    if (!c.type) errors[i] = true;
  });
  setCriteriaTypeErrors(errors);
  return errors;
};

export const validateRuleOperator = (
  rules: CriteriaI[],
  setRuleOperatorErrors: Dispatch<
    SetStateAction<{
      [index: number]: boolean;
    }>
  >
) => {
  const errors: { [index: number]: boolean } = {};
  rules.forEach((r, i) => {
    if (!r.operator) errors[i] = true;
  });
  setRuleOperatorErrors(errors);
  return errors;
};

export const validateRuleType = (
  rules: CriteriaI[],
  setRuleTypeErrors: Dispatch<
    SetStateAction<{
      [index: number]: boolean;
    }>
  >
) => {
  const errors: { [index: number]: boolean } = {};
  rules.forEach((r, i) => {
    if (!r.type) errors[i] = true;
  });
  setRuleTypeErrors(errors);
  return errors;
};

export const validateTriggers = (
  triggers: TriggerI[],
  setFirstTriggerDateError: Dispatch<SetStateAction<boolean>>,
  showError: (msg: string) => void
) => {
  if (triggers.length === 1 && !triggers[0].scheduledTime) {
    setFirstTriggerDateError(true);
    showError("The 'Scheduled time' selection is required.");
    return true;
  }
  return false;
};

export const checkAudienceCriteria = (
  rules: CriteriaI[],
  triggers: TriggerI[],
  criterias: CriteriaI[],
  showError: (msg: string) => void
) => {
  if ((rules.length || triggers.length) && !criterias.length) {
    showError('At least one Audience Criteria should be added.');
    return false;
  }
  return true;
};

export const validateDaysToFutureAppointment = (
  criterias: CriteriaI[],
  triggers: TriggerI[],
  showError: (msg: string) => void
) => {
  if (criterias[0].type === 'Days To Future Appointment' && triggers.length) {
    const hasInvalid = triggers.some(
      trigger => trigger.daysFromListGeneration > +criterias[0].value
    );
    if (hasInvalid) {
      showError(
        'Contact #1: Days from list generation must be less or equal to audience criteria value'
      );
      return false;
    }
  }

  return true;
};

export const validateTriggersSequence = (
  triggers: TriggerI[],
  showError: (msg: string) => void
) => {
  if (!triggers.length) return true;

  const isValid = triggers.every((t, i) => {
    if (i === 0) return true;

    const prev = triggers[i - 1];

    if (t.daysFromListGeneration > prev.daysFromListGeneration) return true;

    if (t.daysFromListGeneration === prev.daysFromListGeneration) {
      const [h1, m1] = prev.scheduledTime.split(':').map(Number);
      const [h2, m2] = t.scheduledTime.split(':').map(Number);

      const prevMinutes = h1 * 60 + m1;
      const currMinutes = h2 * 60 + m2;

      return currMinutes - prevMinutes >= 60;
    }

    return false;
  });

  if (!isValid) {
    showError(
      'Subsequent contact triggers must be at least one hour after the preceding configured contact.'
    );
    return false;
  }

  return true;
};

export const filterValidRulesAndTriggers = (
  criterias: CriteriaI[],
  rules: CriteriaI[],
  triggers: TriggerI[]
) => ({
  filterRules: [...criterias, ...rules].filter(rule => rule.operator && rule.type),
  triggers: triggers.filter(trigger => trigger.scheduledTime),
});
