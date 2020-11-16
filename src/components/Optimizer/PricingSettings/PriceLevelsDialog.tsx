import React, {useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {DialogProps} from "../../Modals/types";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useDispatch} from "react-redux";
import {useException, useMessage} from "../../../utils/hooks";
import {TextField} from "../../UI/TextField";

export type TPriceLevelType = "Discount" | "Premium";
type TProps = DialogProps & {
    type: TPriceLevelType;
}
export const PriceLevelsDialog: React.FC<TProps>
    = ({type, onAction, payload, ...props}) => {
    const [priceSetting, setSetting] = useState<string>("100");
    const [saving, setSaving] = useState<boolean>(false);
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSetting(e.target.value);
    }

    const handleSave = async () => {
        try {
            setSaving(true);
            showMessage("Saved");
            setSaving(false);
            props.onClose();
        } catch (e) {
            setSaving(false);
            showError(e);
        }
    }
    return <BaseModal {...props} width={400}>
        <DialogTitle onClose={props.onClose}>Edit Discount|Premium</DialogTitle>
        <DialogContent>
            <TextField
                label={"Discount"}
                name="discount"
                type="number"
                value={priceSetting}
                onChange={handleChange}
                fullWidth
                id="discount"
                endAdornment="%"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Close</Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
                color="primary"
                variant="contained">
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};