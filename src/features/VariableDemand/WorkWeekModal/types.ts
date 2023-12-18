import {EDay, EDemandCategory} from "../../../store/reducers/pricingSettings/types";

export type TForm = {
    [k in EDay]: EDemandCategory
};