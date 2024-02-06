import React, {useEffect, useMemo} from 'react';
import {Checkbox} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setReminders} from "../../../store/reducers/appointmentFrameReducer/actions";
import {EReminderType} from "../../../store/reducers/appointment/types";
import {useTranslation} from "react-i18next";
import {StyledLabel} from "./styles";
import {ReactComponent as CheckboxIcon} from '../../../assets/img/checkbox_outlined.svg'
import {ReactComponent as CheckboxEmptyIcon} from '../../../assets/img/checkbox_empty1.svg'
import {Info} from "../AppointmentFlow/AppointmentConfirmation/styles";

export const AppointmentReminders: React.FC<{isEmailRequired: boolean}> = ({isEmailRequired}) => {
    const {reminders, customer}= useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile}= useSelector((state: RootState) => state.appointment);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const emailReminder = useMemo(() => {
        const reminder= reminders.find(el => el.toString() === EReminderType.Email.toString());
        return typeof reminder !== "undefined"
    }, [reminders])

    const textChecked = useMemo(() => scProfile?.isSendReminders && reminders.includes(EReminderType.Sms),
        [scProfile, reminders])
    const emailChecked = useMemo(() => scProfile?.isSendReminders && reminders.includes(EReminderType.Email),
        [scProfile, reminders])

    useEffect(() => {
        if (!isEmailRequired && emailReminder && !customer?.email) {
            dispatch(setReminders(reminders.filter(el => el.toString() !== EReminderType.Email.toString())));
        }
    }, [isEmailRequired, emailReminder, customer])

    useEffect(() => {
        if (customer?.email) dispatch(setReminders(Array.from(new Set([...reminders, EReminderType.Email]))))
    }, [customer?.email])

    const handleChange = (t: EReminderType) => () => {
        if (reminders.includes(t)) {
            dispatch(setReminders(reminders.filter(r => r !== t)));
        } else {
            dispatch(setReminders([...reminders, t]));
        }
    }

    return (
        <div>
            <StyledLabel
                label={t("Text consent")}
                disabled={!scProfile?.isSendReminders}
                control={<Checkbox
                    icon={<CheckboxEmptyIcon/>}
                    checkedIcon={<CheckboxIcon/>}
                    checked={textChecked}
                    onChange={handleChange(EReminderType.Sms)}
                    color="primary" />}
            />
            <Info>{t("By checking the box, you agree to receive")} <strong>{t("text messages")}</strong> {t("regarding your upcoming service appointment from", {serviceCenterName: scProfile?.name ?? ''})}</Info>
            <StyledLabel
                label={t("Email consent")}
                control={<Checkbox
                    disabled={!scProfile?.isSendReminders || (!isEmailRequired && !customer?.email)}
                    checked={emailChecked}
                    icon={<CheckboxEmptyIcon/>}
                    checkedIcon={<CheckboxIcon/>}
                    onChange={handleChange(EReminderType.Email)}
                    color="primary" />}
            />
            <Info>{t("By checking the box, you agree to receive")} <strong>{t("emails")}</strong> {t("regarding your upcoming service appointment from", {serviceCenterName: scProfile?.name ?? ''})}</Info>
        </div>
    );
};