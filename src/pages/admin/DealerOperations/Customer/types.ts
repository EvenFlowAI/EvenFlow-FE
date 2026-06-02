export interface CriteriaI {
  type: string;
  operator: string;
  value: string;
  isCriteria?: boolean;
}

export interface TriggerI {
  id?: string;
  daysFromListGeneration: number;
  date?: string;
  scheduledTime: string;
  estimatedRecipients?: number;
  actualRecipients?: number;
  isPaused?: boolean;
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
