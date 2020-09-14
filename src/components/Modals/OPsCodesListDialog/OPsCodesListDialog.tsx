import React, {useEffect} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadNonSelectedServiceRequests} from "../../../store/reducers/serviceRequests/actions";
import {useSCs} from "../../../utils/hooks";
import {TableRowDataType} from "../../UI/types";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Table} from "../../UI/Table";

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPs code", val: el => el.code},
    {header: "Description", val: el => el.description}
]

export const OPsCodesListDialog: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const [serviceList, isLoading] = useSelector((state: RootState) => [
        state.serviceRequests.nonSelectedList,
        state.serviceRequests.nonSelectedLoading
    ]);

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [props.open, dispatch, selectedSC]);

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Select Service Requests</DialogTitle>
        <DialogContent>
            <Table<IServiceRequest>
                data={serviceList}
                index="id"
                compact
                rowData={tableData}
                isLoading={isLoading}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Close
            </Button>
        </DialogActions>
    </BaseModal>
}