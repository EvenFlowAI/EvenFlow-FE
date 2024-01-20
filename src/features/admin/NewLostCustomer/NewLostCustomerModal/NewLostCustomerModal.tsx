import React, {useEffect, useState} from "react";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {setNewLostCustomers} from "../../../../store/reducers/valueSettings/actions";
import {INewLostCustomer, NewLostEnum} from "../../../../store/reducers/valueSettings/types";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";

export const NewLostCustomerModal: React.FC<React.PropsWithChildren<DialogProps<INewLostCustomer> & {isNew: boolean}>> = ({onAction, isNew=false, payload, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [months, setMonths] = useState<string>("");

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setMonths(String(payload.periodInMonth));
            } else {
                setMonths("");
            }
        }
    }, [dispatch, props.open, payload]);

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else if (!months.length) {
            showError('"Time Period" must be greater than "0"')
        } else {
            setSaving(true);
            try {
                await dispatch(setNewLostCustomers({
                    serviceCenterId: selectedSC.id,
                    podId: selectedPod?.id,
                    periodInMonth: Number(months),
                    type: isNew ? NewLostEnum.New : NewLostEnum.Lost
                }));
                setSaving(false);
                showMessage(`${isNew ? "New" : "Lost"} Customer updated`);
                props.onClose();
            } catch (e) {
                showError(e);
                setSaving(false);
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle>Edit {isNew ? "New" : "Lost"} Customer</DialogTitle>
        <DialogContent>
            <TextField
                id="months"
                name="months"
                fullWidth
                label={`Considered ${isNew ? "new up to" : "lost after"}`}
                value={months}
                onChange={e => setMonths(e.target.value)}
                endAdornment="months"
                inputProps={{min: 0}}
                type="number"
                autoComplete="new-customer number"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
                color="primary"
                variant="contained"
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}