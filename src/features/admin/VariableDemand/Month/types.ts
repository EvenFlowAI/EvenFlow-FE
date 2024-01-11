import moment from "moment";
import {ITimeOfYearSetting} from "../../../../store/reducers/pricingSettings/types";

export type TDate = {
    date: moment.Moment;
    data?: ITimeOfYearSetting;
}