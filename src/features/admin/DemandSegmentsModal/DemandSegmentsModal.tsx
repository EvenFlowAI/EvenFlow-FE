import React, {useEffect, useState} from "react";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {createDemandSegment, loadDemandSegments} from "../../../store/reducers/demandSegments/actions";
import {defaultDemandSegment} from "../../../store/reducers/demandSegments/reducer";
import {SC_UNDEFINED} from "../../../utils/constants";
import {RootState} from "../../../store/rootReducer";
import {Table} from "../../../components/tables/Table/Table";
import {IDemandSegment} from "../../../store/reducers/demandSegments/types";
import {LoadingButton} from "../../../components/buttons/LoadingButton/LoadingButton";
import {TableRowDataType} from "../../../types/types";
import {useConfirm} from "../../../hooks/useConfirm/useConfirm";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../hooks/useSelectedPod/useSelectedPod";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";

const rowData: TableRowDataType<IDemandSegment>[] = [
    {header: "Demand Segments",
        val: (el, idx) => String(idx + 1), align: "center"},
    {header: "Window 1", val: el => `${el.window1Point} %`, align: "center"},
    {header: "Window 2", val: el => `${el.window2Point} %`, align: "center"},
    {header: "Window 3", val: el => `${el.window3Point} %`, align: "center"},
];

export const DemandSegmentsModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = ({onAction, payload, ...props}) => {
    const {demandSegmentList, listLoading} = useSelector((state: RootState) => state.demandSegments)
    const [isSaving, setSaving] = useState<boolean>(false);

    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const {askConfirm} = useConfirm();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadDemandSegments(selectedSC.id, selectedPod?.id));
        }
    }, [dispatch, selectedSC, selectedPod]);

    const handleAddSegment = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                await dispatch(createDemandSegment({
                    ...defaultDemandSegment,
                    serviceCenterId: selectedSC.id,
                    podId: selectedPod?.id
                }));
                setSaving(false);
                showMessage("Demand Segment created");
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }
    const actions = (el: IDemandSegment) => {
        return <Button onClick={askRemove(el)} variant="outlined" color="primary">
            Delete
        </Button>
    }
    const askRemove = (el: IDemandSegment) => () => {
        const segmentIndex = demandSegmentList.findIndex(item => item.id === el.id);
        askConfirm({
            onConfirm: handleRemoveSegment(el),
            isRemove: true,
            title: `Please confirm you want to remove Demand Segment ${segmentIndex + 1}`,
        });
    }
    const handleRemoveSegment = (el: IDemandSegment) => async () => {
        try {
            await Api.call(
                Api.endpoints.AppointmentAllocation.RemoveDemandSegment,
                {urlParams: {id: el.id}}
                );
            showMessage("Demand Segment removed");
            dispatch(loadDemandSegments(selectedSC?.id || 0, selectedPod?.id));
        } catch (e) {
            showError(e);
        }
    }

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Demand Segments Settings</DialogTitle>
        <DialogContent>
            <div style={{textAlign: "right"}}>
                <LoadingButton
                    loading={isSaving}
                    variant="contained"
                    color="primary"
                    onClick={handleAddSegment}>
                    Add Segment
                </LoadingButton>
            </div>
            <Table<IDemandSegment>
                hidePagination
                data={demandSegmentList}
                index="id"
                isLoading={listLoading}
                compact
                rowData={rowData}
                actions={actions}
            />
        </DialogContent>
        <DialogActions>
            <Button
                onClick={props.onClose}
                variant="contained"
                color="primary">
                Close
            </Button>
        </DialogActions>
    </BaseModal>
}