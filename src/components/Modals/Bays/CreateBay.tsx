import React, {useEffect, useState} from "react";
import {BaseModal, DialogContent, DialogTitle, DialogActions} from "../BaseModal";
import {DialogProps} from "../types";
import {Button, FormControlLabel, Checkbox, FormGroup} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {IBay, IBayForm} from "../../../store/reducers/bays/types";
import {TextField} from "../../UI/TextField";

const Form: React.FC<{
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    form: TForm,
    onCheck: (e: React.ChangeEvent<HTMLInputElement>) => void
}> = props => {
    return <div>
        <TextField
            label="Name"
            id="name"
            name="name"
            value={props.form.name}
            onChange={props.onChange}
            fullWidth
        />
        <FormGroup>
            <FormControlLabel
            label="Alignment Equipment"
            control={
                <Checkbox
                    checked={props.form.alignmentEquipment}
                    onChange={props.onCheck}
                    name="alignmentEquipment"
                    color="primary"
                />
            }
            labelPlacement="end"
        />
        <FormControlLabel
            label="Carrying Capacity"
            control={
                <Checkbox
                    checked={props.form.carryingCapacity}
                    onChange={props.onCheck}
                    name="carryingCapacity"
                    color="primary"
                />
            }
            labelPlacement="end"
        />
        <FormControlLabel
            label="Only Quick Service"
            control={
                <Checkbox
                    checked={props.form.onlyQuickService}
                    onChange={props.onCheck}
                    name="onlyQuickService"
                    color="primary"
                />
            }
            labelPlacement="end"
        />
        </FormGroup>
    </div>
}

type TForm = {
    onlyQuickService: boolean;
    carryingCapacity: boolean;
    alignmentEquipment: boolean;
    name: string;
};
const initialForm: TForm = {
    onlyQuickService: false,
    carryingCapacity: false,
    alignmentEquipment: false,
    name: ""
}
export const CreateBay: React.FC<DialogProps<IBay>> = ({payload, onAction, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
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
            showError("Service center is not loaded");
        } else {
            try {
                // await dispatch(createBay({
                //
                // }));
                showMessage("Bay saved.");
                props.onClose();
            } catch (e) {
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>{!payload ? "Add new" : "Edit"} bay</DialogTitle>
        <DialogContent>
            <Form
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