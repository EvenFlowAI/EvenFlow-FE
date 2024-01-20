import React, {useEffect, useState} from "react";
import {BaseModal, DialogContent, DialogTitle, DialogActions} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {IBay, IBayForm} from "../../../../store/reducers/bays/types";
import {createBay, updateBay} from "../../../../store/reducers/bays/actions";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {TBayForm} from "../types";
import {CreateBayForm} from "../CreateBayForm/CreateBayForm";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const initialForm: TBayForm = {
    onlyQuickService: false,
    carryingCapacity: false,
    alignmentEquipment: false,
    name: ""
}

export const CreateBayModal: React.FC<React.PropsWithChildren<DialogProps<IBay>>> = ({payload, onAction, ...props}) => {
    const [form, setForm] = useState<TBayForm>(initialForm);
    const [saving] = useSelector((state: RootState) => [
        state.bays.saving
    ]);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (props.open) {
            setForm({...initialForm, ...payload});
        }
    }, [props.open, payload]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };
    const handleCheck: React.ChangeEventHandler<HTMLInputElement> = e => {
        setForm({...form, [e.target.name]: e.target.checked});
    };

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                const data = {...form, serviceCenterId: selectedSC.id} as IBayForm;
                if (!payload) {
                    await dispatch(createBay(data));
                } else {
                    await dispatch(updateBay(data, payload.id));
                }
                showMessage(payload ? "Bay updated" : "Bay created");
                props.onClose();
            } catch (e) {
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>{!payload ? "Add" : "Edit"} Bay</DialogTitle>
        <DialogContent>
            <CreateBayForm
                form={form}
                onCheck={handleCheck}
                onChange={handleChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
                variant="contained"
                color="primary">
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}