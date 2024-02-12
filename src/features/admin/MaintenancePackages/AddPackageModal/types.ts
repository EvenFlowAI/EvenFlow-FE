import {ECustomerCriteria} from "../../../../api/types";
import {DialogProps} from "../../../../components/modals/BaseModal/types";

export type TModalProps = DialogProps & {
    isEditing?: boolean;
};

export interface IVehiclesData {
    yearFrom: string;
    yearTo: string;
    customerCriteria: ECustomerCriteria;
    isApplyBusinessRules?: boolean;
}