export interface CriteriaI {
  type: string;
  operator: string;
  value: string;
  isCriteria?: boolean;
}

export interface TriggerI {
  id?: string;
  daysFromListGeneration: number;
  scheduledTime: string;
}
