export interface IGlobalRecall {
  id: number;
  nhtsaCampaign: string;
  oemProgram: string;
  manufacturer: string;
  recallComponent: string;
  recallComponentBookingFlow: string;
  impactedVehicles: number;
  reportedDate: string;
}

export enum OrderByField {
  ReportedDate = 0,
  NhtsaCampaign = 1,
  OemProgram = 2,
  Manufacturer = 3,
  RecallComponent = 4,
  ImpactedVehicles = 5,
}

export interface GlobalRecallComponent {
  id: number;
  recallComponent: string;
  nhtsaCampaign: string;
  oemProgram: string;
  makes: {
    name: string;
    models: { name: string; year: number }[];
  }[];
  reportedDate: string;
  impactedVehicles: number;
  doNotDrive: boolean;
  fireRisk: boolean;
  summary: string;
  safetyRisk: string;
  remedy: string;
}
