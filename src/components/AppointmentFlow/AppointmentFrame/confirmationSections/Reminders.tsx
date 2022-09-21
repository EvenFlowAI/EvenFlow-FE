import React from 'react';
import {ConfirmationTitle} from '../Title';
import {Checkbox, FormControlLabel, FormGroup, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setReminders} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {EReminderType} from "../../../../store/reducers/appointment/types";
import {useTranslation} from "react-i18next";


const FlexGroup = styled(FormGroup)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& label": {
        marginRight: 32
    }
})

export const Reminders = () => {
    const {reminders}= useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const handleChange = (t: EReminderType) => () => {
        if (reminders.includes(t)) {
            dispatch(setReminders(reminders.filter(r => r !== t)));
        } else {
            dispatch(setReminders([...reminders, t]));
        }
    }
    return (
        <div>
            <ConfirmationTitle>{t("Reminders")}</ConfirmationTitle>
            <FlexGroup>
                <FormControlLabel
                    label={t("Text")}
                    control={<Checkbox
                        checked={reminders.includes(EReminderType.Sms)}
                        onChange={handleChange(EReminderType.Sms)}
                        color="primary" />}
                />
                <FormControlLabel
                    label={t("E-mail")}
                    control={<Checkbox
                        checked={reminders.includes(EReminderType.Email)}
                        onChange={handleChange(EReminderType.Email)}
                        color="primary" />}
                />
            </FlexGroup>
        </div>
    );
};