import React, {useEffect, useMemo} from 'react';
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

type TRemindersProps = {
    isEmailRequired: boolean
}

export const Reminders: React.FC<TRemindersProps> = ({isEmailRequired}) => {
    const {reminders, customer}= useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile}= useSelector((state: RootState) => state.appointment);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const emailReminder = useMemo(() => {
        const reminder= reminders.find(el => el.toString() === EReminderType.Email.toString());
        return typeof reminder !== "undefined"
    }, [reminders])

    useEffect(() => {
        if (!isEmailRequired && emailReminder && !customer?.email) {
            dispatch(setReminders(reminders.filter(el => el.toString() !== EReminderType.Email.toString())));
        }
    }, [isEmailRequired, emailReminder, customer])

    useEffect(() => {
        if (customer?.email) dispatch(setReminders(Array.from(new Set([...reminders, EReminderType.Email]))))
    }, [customer])

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
                    disabled={!scProfile?.isSendReminders}
                    control={<Checkbox
                        checked={scProfile?.isSendReminders && reminders.includes(EReminderType.Sms)}
                        onChange={handleChange(EReminderType.Sms)}
                        color="primary" />}
                />
                <FormControlLabel
                    label={t("E-mail")}
                    control={<Checkbox
                        disabled={!scProfile?.isSendReminders || (!isEmailRequired && !customer?.email)}
                        checked={scProfile?.isSendReminders && reminders.includes(EReminderType.Email)}
                        onChange={handleChange(EReminderType.Email)}
                        color="primary" />}
                />
            </FlexGroup>
        </div>
    );
};