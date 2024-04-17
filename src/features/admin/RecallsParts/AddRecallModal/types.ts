import {IMakeExtended, IModel} from "../../../../api/types";
import {IAssignedServiceRequest} from "../../../../store/reducers/serviceRequests/types";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {IRecall} from "../../../../store/reducers/recall/types";
import {Dispatch, SetStateAction} from "react";

export type TForm = {
    recallCampaignNumber: string;
    make: IMakeExtended|null;
    model: IModel|null;
    yearTo: string;
    yearFrom: string;
    recallComponent: string;
    recallSummary: string;
    partLeadDaysCount: string;
    dailyPartsCount: string;
    serviceRequest: IAssignedServiceRequest|null;
}
export type TAddRecallProps = DialogProps & {
    editingItem: IRecall | null;
    setEditingItem: Dispatch<SetStateAction<IRecall | null>>;
}