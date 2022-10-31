import React, {useEffect, useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {useConfirm, useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {createDemandSegment, loadDemandSegments} from "../../../store/reducers/demandSegments/actions";
import {defaultDemandSegment} from "../../../store/reducers/demandSegments/reducer";
import {SC_UNDEFINED} from "../../../config/constants";
import {LoadingButton} from "../../UI/Button";
import {RootState} from "../../../store/rootReducer";
import {Table} from "../../UI/Table";
import {IDemandSegment} from "../../../store/reducers/demandSegments/types";
import {TableRowDataType} from "../../UI/types";
import {Api} from "../../../config/requests";

const rowData: TableRowDataType<IDemandSegment>[] = [
    {header: "Demand Segments",
        val: (el, idx) => String(idx + 1), align: "center"},
    {header: "Window 1", val: el => `${el.window1Point} %`, align: "center"},
    {header: "Window 2", val: el => `${el.window2Point} %`, align: "center"},
    {header: "Window 3", val: el => `${el.window3Point} %`, align: "center"},
];

export const DemandSegments: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const [isSaving, setSaving] = useState<boolean>(false);

    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const {askConfirm} = useConfirm();

    const [demandSegmentsList, isLoading] = useSelector((state: RootState) => [
        state.demandSegments.demandSegmentList,
        state.demandSegments.listLoading
    ]);

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
        askConfirm({
            onConfirm: handleRemoveSegment(el),
            isRemove: true,
            title: "Please confirm you want to remove this Demand Segment",
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
                data={demandSegmentsList}
                index="id"
                isLoading={isLoading}
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