import React, {useEffect, useState} from "react";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button, Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import {IAssignedServiceRequest, IRequiredSkill} from "../../../../store/reducers/serviceRequests/types";
import {useDispatch} from "react-redux";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {setRequiredSkills} from "../../../../store/reducers/serviceRequests/actions";
import {useStyles} from "./styles";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";

type TForm = IRequiredSkill;

const initialForm: TForm = {
    technicianLevel1: false,
    technicianLevel2: false,
    technicianLevel3: false
};

export const RequiredSkillsModal: React.FC<DialogProps<IAssignedServiceRequest>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const classes = useStyles();

    useEffect(() => {
        if (props.open) {
            setForm({...initialForm, ...payload?.requiredSkill});
        }
    }, [payload, props.open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setForm({...form, [e.target.name]: checked});
    }

    const handleSave = async () => {
        if (!payload) {
            showError("Data is not loaded");
        } else {
            setLoading(true);
            try {
                await dispatch(setRequiredSkills({
                    ...form,
                    serviceRequestId: payload.id
                }, payload.serviceCenterId));
                setLoading(false);
                showMessage("Required Skills updated");
                props.onClose();
            } catch (e) {
                setLoading(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>Set Required Skills</DialogTitle>
        <DialogContent>
            <TextField
                disabled
                className={classes.input}
                fullWidth
                label="Service code"
                value={payload?.serviceRequest.code}
            />
            <TextField
                disabled
                className={classes.input}
                fullWidth
                label="Description"
                value={
                    payload?.serviceRequestOverride?.description
                    || payload?.serviceRequest.description
                }
            />
            <FormGroup>
                <FormControlLabel
                    label="Technician Level 1"
                    labelPlacement="end"
                    control={<Checkbox
                        color="primary"
                        onChange={handleChange}
                        name="technicianLevel1"
                        checked={form.technicianLevel1}
                    />}
                />
                <FormControlLabel
                    label="Technician Level 2"
                    labelPlacement="end"
                    control={<Checkbox
                        color="primary"
                        onChange={handleChange}
                        name="technicianLevel2"
                        checked={form.technicianLevel2}
                    />}
                />
                <FormControlLabel
                    label="Technician Level 3"
                    labelPlacement="end"
                    control={<Checkbox
                        color="primary"
                        onChange={handleChange}
                        name="technicianLevel3"
                        checked={form.technicianLevel3}
                    />}
                />
            </FormGroup>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                loading={loading}
                color="primary"
                variant="contained"
                onClick={handleSave}
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}