import React from 'react';
import {ConfirmationTitle} from '../Title';
import {Checkbox, FormControlLabel, FormGroup, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setReminders} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {EReminderType} from "../../../../store/reducers/appointment/types";


const FlexGroup = styled(FormGroup)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "32px",
    "& label": {
        marginRight: 0
    }
})

export const Reminders = () => {
    const dispatch = useDispatch();
    const reminders = useSelector((state: RootState) => state.appointmentFrame.reminders);
    const handleChange = (t: EReminderType) => () => {
        if (reminders.includes(t)) {
            dispatch(setReminders(reminders.filter(r => r !== t)));
        } else {
            dispatch(setReminders([...reminders, t]));
        }
    }
    return (
        <div>
            <ConfirmationTitle>Reminders</ConfirmationTitle>
            <FlexGroup>
                <FormControlLabel
                    label="Text"
                    control={<Checkbox
                        checked={reminders.includes(EReminderType.Sms)}
                        onChange={handleChange(EReminderType.Sms)}
                        color="primary" />}
                />
                <FormControlLabel
                    label="E-mail"
                    control={<Checkbox
                        checked={reminders.includes(EReminderType.Email)}
                        onChange={handleChange(EReminderType.Email)}
                        color="primary" />}
                />
            </FlexGroup>
        </div>
    );
};