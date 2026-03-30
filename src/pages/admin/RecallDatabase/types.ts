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
