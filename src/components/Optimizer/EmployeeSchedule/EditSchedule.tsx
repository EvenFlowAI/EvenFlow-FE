import React, {useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {DialogProps} from "../../Modals/types";
import {Button, Grid} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage} from "../../../utils/hooks";
import {TextField} from "../../UI/TextField";
import moment from "moment";
import {IEmployee} from "../../../store/reducers/employees/types";
import {ISchedule} from "../../../store/reducers/schedules/types";

type TProps = DialogProps<ISchedule> & {
    date: moment.Moment;
    employee: IEmployee;
}
export const EditSchedule: React.FC<TProps> = ({date, employee, onAction, payload, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const showMessage = useMessage();
    const showError = useException();

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Save
            setSaving(false);
            showMessage("Saved");
            props.onClose();
        } catch (e) {
            setSaving(false);
            showError(e);
        }
    }

    return <BaseModal {...props} width={400}>
        <DialogTitle onClose={props.onClose}>Edit employee schedule</DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Employee full name"
                        fullWidth
                        disabled
                        value={employee.fullName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Date"
                        fullWidth
                        disabled
                        value={date.format("MMM D, YYYY")}
                    />
                </Grid>
                <Grid item xs={6}>

                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};