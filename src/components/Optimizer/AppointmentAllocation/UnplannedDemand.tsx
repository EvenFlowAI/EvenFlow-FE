import React, {useState} from "react";
import {DemandTable, TableRow, TableCell, SaveEditBlock} from "./UI";
import {TableBody, TableHead} from "@material-ui/core";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {SC_UNDEFINED} from "../../../config/constants";

export const UnplannedDemand = () => {
    const [isEdit, setEdit] = useState<boolean>(false);
    const [isSaving, setSaving] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();

    const handleCancel = () => {
        setEdit(false);
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                setSaving(false);
                setEdit(false);
                showMessage("Saved");
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    return <div>
        <DemandTable>
            <TableHead>
                <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Historical Walk-in Schedule Blocks</TableCell>
                    <TableCell>Optimizer Setting</TableCell>
                    <TableCell>
                        <SaveEditBlock
                            onSave={handleSave}
                            onEdit={() => setEdit(true)}
                            onCancel={handleCancel}
                            isEdit={isEdit}
                            isSaving={isSaving}
                        />
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell />
                </TableRow>
            </TableBody>
        </DemandTable>
    </div>
}