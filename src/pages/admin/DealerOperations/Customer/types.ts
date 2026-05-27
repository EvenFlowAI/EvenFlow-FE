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

export enum RecallEventStatus {
  NotConfigured = 0,
  Configured = 1,
  CheckRequested = 2,
  ResultsAvailable = 3,
  Running = 4,
  Completed = 5,
  Failed = 6,
}
