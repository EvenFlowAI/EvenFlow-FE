import {DialogProps} from "../../../components/modals/BaseModal/types";
import {ICapacitySetting} from "../../../store/reducers/capacityManagement/types";
import {TOption} from "../PodsTable/PODModal/types";

export type TProps = DialogProps & { editingItem: ICapacitySetting };

export type TDayTime = {
    day: string;
    time: string;
}

export interface TForm {
    serviceBookName: string;
    gapSlotsType: TOption | null;
    appointmentPerSlots: number | null;
    appointmentLeadTime: number | null;
    technicianEfficiency: number | null;
    avarageBillHoursPerRO: number | null;
    cutOffTime: TDayTime[];
}