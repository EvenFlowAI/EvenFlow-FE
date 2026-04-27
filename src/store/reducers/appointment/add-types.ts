interface DayCapacity {
  id: number;
  dayOfWeek: number;
  capacity: number;
  serviceCenterId: number;
  created: string;
  createdBy?: string;
  lastModifiedBy?: string;
  lastModified?: string;
  pickUpMin?: string;
  pickUpMax?: string;
  dropOffMin?: string;
  dropOffMax?: string;
}

export type ServiceValetCapacity = Record<string, DayCapacity>;
