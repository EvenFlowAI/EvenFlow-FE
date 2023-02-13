import React, {Dispatch, SetStateAction} from 'react';
import {Checkbox, FormControlLabel, FormGroup, FormLabel, Grid} from "@material-ui/core";
import {EReminderType} from "../../../../store/reducers/appointment/types";
import {TForm} from "../types";

type TRemindersProps = {
    form: TForm;
    setForm: Dispatch<SetStateAction<TForm>>;
}

const Reminders: React.FC<TRemindersProps> = ({ form, setForm }) => {
    const handleReminderChange = (t: EReminderType) => () => {
        setForm(prev => ({
            ...prev,
            reminderTypes: form.reminderTypes.includes(t)
                ? form.reminderTypes.filter(rt => rt !== t)
                : [...form.reminderTypes, t]
        }));
    }

    return (
        <Grid item xs={12}>
            <FormLabel
                style={{fontWeight: "bold", textTransform: "uppercase",
                    fontSize: "12px", marginBottom: 4, color: "#000"}}>Reminders</FormLabel>
            <FormGroup row>
                <FormControlLabel
                    control={<Checkbox
                        color="primary"
                        checked={form.reminderTypes.includes(EReminderType.Email)}
                        onChange={handleReminderChange(EReminderType.Email)} name="reminders"/>}
                    label="Email"
                />
                <FormControlLabel
                    control={<Checkbox
                        color="primary"
                        checked={form.reminderTypes.includes(EReminderType.Sms)}
                        onChange={handleReminderChange(EReminderType.Sms)} name="reminders"/>}
                    label="SMS"
                />
            </FormGroup>
        </Grid>
    );
};

export default Reminders;