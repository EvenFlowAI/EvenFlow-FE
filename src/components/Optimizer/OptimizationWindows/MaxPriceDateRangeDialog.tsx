import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {SC_UNDEFINED} from "../../../config/constants";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {TextField} from "../../UI/TextField";
import {updateMaxPriceDateRange} from "../../../store/reducers/optimizationWindows/actions";

export const MaxPriceDateRangeDialog: React.FC<DialogProps> = ({payload, onAction, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [val, setVal] = useState<number>(0);

    const {selectedSC} = useSCs();
    const {maxPriceDateRange} = useSelector((state: RootState) => state.optimizationWindows);

    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (maxPriceDateRange) setVal(maxPriceDateRange)
    }, [maxPriceDateRange])

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true)
                await dispatch(updateMaxPriceDateRange(selectedSC.id, val))
                showMessage('Max Price Date Range updated')
                props.onClose();
            } catch (e) {
                showError(e)
            } finally {
                setSaving(false)
            }
        }
    }

    const handleChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setVal(Number(value));
    }

    return <BaseModal {...props} width={300}>
        <DialogTitle onClose={props.onClose}>Max Price Date Range</DialogTitle>
        <DialogContent>
            <TextField
                value={val}
                fullWidth
                label="Days"
                type="number"
                inputProps={{min: 0}}
                onChange={handleChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Close
            </Button>
            <LoadingButton
                onClick={handleSave}
                color="primary"
                variant="contained"
                loading={saving}>
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};