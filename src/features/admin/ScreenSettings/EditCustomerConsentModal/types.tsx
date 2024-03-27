import {IAdvisorShort} from "../../../../store/reducers/users/types";
import {IAssignedServiceRequestShort} from "../../../../store/reducers/serviceRequests/types";
import {TGeographicZone} from "../../../../store/reducers/screenSettings/types";
import {IMakeExtended, IModel} from "../../../../api/types";
import {TTransportationShort} from "../../../../store/reducers/transportationNeeds/types";
import {EUserType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {IPodShort} from "../../../../store/reducers/pods/types";
import {EDay} from "../../../../store/reducers/demandSegments/types";

export type TForm = {
    name: string;
    message: string;
    title: string;
    advisors: IAdvisorShort[];
    serviceRequests: IAssignedServiceRequestShort[];
    isWaitlistEnabled: boolean;
    makes: IMakeExtended[];
    models: IModel[];
    modelYearFrom: number|null;
    modelYearTo: number|null;
    customerType: EUserType|null;
    serviceBooks: IPodShort[];
    appointmentTimeFrom: string;
    appointmentTimeTo: string;
    daysOfWeek: EDay[];
    transportationOptions: TTransportationShort[];
    mobileServiceZones: TGeographicZone[];
    serviceValetZones: TGeographicZone[];
}