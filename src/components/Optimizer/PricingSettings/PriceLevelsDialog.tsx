import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {DialogProps} from "../../Modals/types";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useDispatch} from "react-redux";
import {useException, useMessage} from "../../../utils/hooks";
import {TextField} from "../../UI/TextField";
import {EDemandCategory, IPricingLevel} from "../../../store/reducers/pricingSettings/types";
import {SC_UNDEFINED} from "../../../config/constants";
import {setPricingLevels} from "../../../store/reducers/pricingSettings/actions";


export const PriceLevelsDialog: React.FC<DialogProps<IPricingLevel>>
    = ({onAction, payload, ...props}) => {
    const [priceSetting, setSetting] = useState<string>("100");
    const [saving, setSaving] = useState<boolean>(false);
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();

    useEffect(() => {
        if (payload) {
            setSetting(String(payload?.percentage));
        }
    }, [payload]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSetting(e.target.value);
    }

    const handleSave = async () => {
        if (!payload) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true);
                await dispatch(setPricingLevels({...payload, percentage: Number(priceSetting)}));
                showMessage("Saved");
                setSaving(false);
                props.onClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }
    return <BaseModal {...props} width={400}>
        <DialogTitle onClose={props.onClose}>
            Edit {payload?.demandCategory === EDemandCategory.Low ? "Discount" : "Premium"}
        </DialogTitle>
        <DialogContent>
            <TextField
                label={payload?.demandCategory === EDemandCategory.Low ? "Discount" : "Premium"}
                name="discount"
                type="number"
                inputProps={{
                    min: payload?.demandCategory === EDemandCategory.Low ? 0 : 100,
                    max: payload?.demandCategory === EDemandCategory.Low ? 100 : 200
                }}
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