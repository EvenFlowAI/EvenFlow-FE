import React, {useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {createDemandSegment} from "../../../store/reducers/demandSegments/actions";
import {defaultDemandSegment} from "../../../store/reducers/demandSegments/reducer";
import {SC_UNDEFINED} from "../../../config/constants";
import {LoadingButton} from "../../UI/Button";

export const DemandSegments: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const [isSaving, setSaving] = useState<boolean>(false);

    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();

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
                showMessage("Demand Segment Created");
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Demand segments settings</DialogTitle>
        <DialogContent>
            <div style={{textAlign: "right"}}>
                <LoadingButton
                    loading={isSaving}
                    variant="contained"
                    color="primary"
                    onClick={handleAddSegment}>
                    Add New Segment
                </LoadingButton>
            </div>
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