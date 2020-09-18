export interface IBayForm {
    serviceCenterId: number;
    name: string;
    alignmentEquipment: boolean;
    carryingCapacity: boolean;
    onlyQuickService: boolean;
}
export interface IBay extends IBayForm {
    id: number;
    podId?: number;
}
export interface IBayShort {
    id: number;
    name: string;
    podId?: number;
}
