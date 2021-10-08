export interface IPackageOption {
    serviceRequestPrice: number;
    complimentaryServicePrice: number;
    serviceRequestLaborHours: number;
    complimentaryServiceLaborHours: number;
    serviceRequests: number[];
    complimentaryServices: number[];
    type: string | number;
}