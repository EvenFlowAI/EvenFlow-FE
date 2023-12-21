import React, {useEffect, useState} from "react";
import {DialogProps} from "../../../../components/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/BaseModal/BaseModal";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    loadNonUrgentServiceRequests,
    pageDataNonUrgentServiceRequests,
    setUrgentRequests
} from "../../../../store/reducers/serviceRequests/actions";
import {Table} from "../../../../components/Table/Table";
import {IAssignedServiceRequestShort} from "../../../../store/reducers/serviceRequests/types";
import {SC_UNDEFINED} from "../../../../config/constants";
import {LoadingButton} from "../../../../components/LoadingButton/LoadingButton";
import {TableRowDataType} from "../../../../types/types";
import {usePagination} from "../../../../hooks/usePaginations/usePaginations";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";

const rowData: TableRowDataType<IAssignedServiceRequestShort>[] = [
    {header: "Service Ops Code", val: el => el.code},
    {header: "Description", val: el => el.description}
];

export const UrgentRequestModal: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [selected, setSelected] = useState<number[]>([]);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const showError = useException();
    const showMessage = useMessage();
    const [data, isLoading, count] = useSelector((state: RootState) => [
        state.serviceRequests.nonUrgentList,
        state.serviceRequests.nonUrgentLoading,
        state.serviceRequests.nonUrgentPaging.numberOfRecords
    ]);
    const {pageIndex, pageSize, changePage, changeRowsPerPage} = usePagination(
        state => state.serviceRequests.nonUrgentPageData,
        pageDataNonUrgentServiceRequests
    );

    useEffect(() => {
        if (props.open) {
            setSelected([]);
        }
    }, [props.open]);

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadNonUrgentServiceRequests(selectedSC.id, selectedPod?.id));
        }
    }, [props.open, dispatch, selectedPod, selectedSC, pageIndex, pageSize]);

    const handleCheck = (el: IAssignedServiceRequestShort) => () => {
        if (selected.includes(el.id)) {
            setSelected(selected.filter(e => e !== el.id));
        } else {
            setSelected([...selected, el.id]);
        }
    }
    const actions = (el: IAssignedServiceRequestShort) => {
        const checked: boolean = selected.includes(el.id);
        return checked
            ? <Button onClick={handleCheck(el)}>
                Uncheck
            </Button>
            : <Button color="primary" variant="outlined" onClick={handleCheck(el)}>
                Check
            </Button>
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                await dispatch(setUrgentRequests(selected, selectedSC.id, selectedPod?.id));
                setSaving(false);
                showMessage("Urgent Request updated");
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth={"md"}>
        <DialogTitle onClose={props.onClose}>Add Urgent Request</DialogTitle>
        <DialogContent>
            <Table<IAssignedServiceRequestShort>
                data={data}
                index="id"
                rowData={rowData}
                isLoading={isLoading}
                compact
                page={pageIndex}
                rowsPerPage={pageSize}
                onChangePage={changePage}
                onChangeRowsPerPage={changeRowsPerPage}
                actions={actions}
                count={count}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Close
            </Button>
            <LoadingButton
                onClick={handleSave}
                disabled={!selected.length}
                loading={saving}
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}