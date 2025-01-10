export enum ECustomerSegmentMobileService {
  New,
  Lost,
  Existing,
  HighValue,
  MediumValue,
  LowValue,
  EndOfWarranty,
  PostWarranty,
}

export type TSegmentType = {
  type: ECustomerSegmentMobileService;
  name: string;
  enabled: boolean;
  order: number;
};
