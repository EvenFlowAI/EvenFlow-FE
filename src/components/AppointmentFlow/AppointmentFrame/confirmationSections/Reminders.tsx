import React, {useMemo} from 'react';
import {ConfirmationTitle} from '../Title';
import {Checkbox, FormControlLabel, FormGroup, styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setReminders} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {EReminderType} from "../../../../store/reducers/appointment/types";
import {EServiceCenterName} from "../../../../api/types";


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
    const {scProfile}= useSelector((state: RootState) => state.appointment);
    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);
    const dispatch = useDispatch();

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
                        disabled={isBmWService}
                        onChange={handleChange(EReminderType.Sms)}
                        color="primary" />}
                />
                <FormControlLabel
                    label="E-mail"
                    control={<Checkbox
                        checked={reminders.includes(EReminderType.Email)}
                        onChange={handleChange(EReminderType.Email)}
                        disabled={isBmWService}
                        color="primary" />}
                />
            </FlexGroup>
        </div>
    );
};