import {EReminderType} from "../../../store/reducers/appointment/types";
import {ITransportation} from "../../../api/types";

export type TForm = {
    date: string;
    slot: string;
    reminderTypes: EReminderType[];
    driverName: string;
    driverPhoneNumber: string;
    driverEmail: string;
    transportationOption: ITransportation|null;
    vehicleVin: string;
    vehicleMake: string;
    vehicleYear: string;
    vehicleModel: string;
    vehicleMileage: string;
    vehicleTransmission: string;
    vehicleDriveType: string;
    isNeedCall: boolean;
    comment: string;
    serviceRequestIds: number[];
    vehicleEngineTypeId: number|null;
};

export type TOption = {
    value: number;
    name: string;
}
