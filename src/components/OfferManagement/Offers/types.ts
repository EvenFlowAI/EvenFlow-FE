import {
    ECustomerPresence,
    ECustomerSegment,
    EDayOfWeek,
    EOfferType,
    IServiceType
} from "../../../store/reducers/offers/types";
import {IAssignedServiceRequestShort, IServiceRequestPriority} from "../../../store/reducers/serviceRequests/types";
import {TEnumMap} from "../../../store/reducers/utils";
import moment from "moment";

export type TOfferForm = {
    offerValue?: string;
    offerTitle?: string;
    offerType: EOfferType;
    serviceRequests: IAssignedServiceRequestShort[];
    customerSegments: TEnumMap<ECustomerSegment>[];
    customerPresence: ECustomerPresence;
    dayOfWeek: TEnumMap<EDayOfWeek>[];
    timeOfDayFrom?: moment.Moment;
    timeOfDayTo?: moment.Moment;
    durationFrom?: moment.Moment;
    durationTo?: moment.Moment;
    serviceType?: (IServiceType & {inputValue?: string})[];
}
export const selectAllSR: IAssignedServiceRequestShort = {
    id: 0,
    code: "All",
    priority: IServiceRequestPriority.Default,
    description: ""
}