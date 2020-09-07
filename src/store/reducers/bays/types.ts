export interface IBayForm {
    serviceCenterId: number;
    name: string;
    alignmentEquipment: boolean;
    carryingCapacity: boolean;
    onlyQuickService: boolean;
}
export interface IBay extends IBayForm {
    id: number;
}
