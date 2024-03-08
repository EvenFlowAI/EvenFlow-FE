import {IAdvisorShort} from "../../../../store/reducers/users/types";
import {IAssignedServiceRequestShort} from "../../../../store/reducers/serviceRequests/types";
import {EDayOfWeek} from "../../../../store/reducers/offers/types";
import {ECustomerType} from "../../../../store/reducers/screenSettings/types";
import {IMakeExtended, IModel} from "../../../../api/types";
import {TZone} from "../../../../store/reducers/mobileService/types";
import {ITransportationOptionFull} from "../../../../store/reducers/transportationNeeds/types";

export type TForm = {
    name: string;
    message: string;
    title: string;
    advisors: IAdvisorShort[];
    serviceRequests: IAssignedServiceRequestShort[];
    isWaitlistEnabled: boolean;
    makes: IMakeExtended[];
    modes: IModel[];
    modelYearFrom: number;
    modelYearTo: number;
    customerType: ECustomerType;
    serviceBooks: [];
    appointmentTimeFrom: string;
    appointmentTimeTo: string;
    daysOfWeek: EDayOfWeek[];
    transportationOptions: ITransportationOptionFull[];
    mobileServiceZones: TZone[];
    serviceValetZones: TZone[];
}