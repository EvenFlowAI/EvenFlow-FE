import React, {useEffect, useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Checkbox} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {assignServiceRequests, loadNonSelectedServiceRequests} from "../../../store/reducers/serviceRequests/actions";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {TableRowDataType} from "../../UI/types";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Table} from "../../UI/Table";
import {LoadingButton} from "../../UI/Button";
import {SC_UNDEFINED} from "../../../config/constants";

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPs code", val: el => el.code},
    {header: "Description", val: el => el.description},
    {header: "Duration", val: el => el.durationInHours.toFixed(1)},
    {header: "Regular Invoice", val: el => `$${el.invoiceAmount}`}
]

export const OPsCodesListDialog: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const [serviceList, isLoading] = useSelector((state: RootState) => [
        state.serviceRequests.nonSelectedList,
        state.serviceRequests.nonSelectedLoading
    ]);
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedCodes, setSelectedCodes] = useState<number[]>([]);

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [props.open, dispatch, selectedSC]);

    const handleCheck = (el: IServiceRequest) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (checked) {
            setSelectedCodes([...selectedCodes, el.id]);
        } else {
            setSelectedCodes(selectedCodes.filter(i => i !== el.id));
        }
    }

    const preActions = (el: IServiceRequest) => {
        return <Checkbox color="primary" checked={selectedCodes.includes(el.id)} onChange={handleCheck(el)} />
    }

    const handleAdd = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true);
                await dispatch(assignServiceRequests(selectedCodes, selectedSC.id));
                setSaving(false);
                showMessage(`Successfully assigned ${selectedCodes.length} codes`);
                setSelectedCodes([]);
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Select Service Requests</DialogTitle>
        <DialogContent>
            <Table<IServiceRequest>
                data={serviceList}
                index="id"
                startActions={preActions}
                compact
                rowData={tableData}
                isLoading={isLoading}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Close
            </Button>
            <LoadingButton
                loading={saving}
                disabled={!selectedCodes.length}
                onClick={handleAdd}
                color="primary"
                variant="contained"
            >
                Add OPs Codes
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}