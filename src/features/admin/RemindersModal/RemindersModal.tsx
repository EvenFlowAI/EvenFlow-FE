import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../../components/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/BaseModal/BaseModal";
import {Button, Divider, Switch} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadReminders, updateReminders} from "../../../store/reducers/serviceCenters/actions";
import {useStyles} from "./styles";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";

const RemindersModal: React.FC<DialogProps> = (props) => {
    const [isRemindersOn, setRemindersOn] = useState<boolean>(false);
    const { reminders, remindersLoading } = useSelector((state: RootState) => state.serviceCenters);
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const classes = useStyles();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC) dispatch(loadReminders(selectedSC.id));
    }, [selectedSC, dispatch])

    useEffect(() => {
        setRemindersOn(reminders);
    }, [reminders])

    const handleSwitch = (e: any, value: boolean) => {
        setRemindersOn(value);
    }

    const onCancel = () => {
        setRemindersOn(reminders)
        props.onClose();
    }

    const onSuccess = () => {
        showMessage('Appointment Reminders Configuration updated')
    }

    const onSave = () => {
        if (selectedSC) {
            dispatch(updateReminders(selectedSC.id, isRemindersOn, showError, onSuccess))
            props.onClose();
        }
    }

    return (
        <BaseModal {...props} width={700} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Appointment Reminders Configuration</DialogTitle>
            <DialogContent>
                <p className={classes.subtitle}>
                    By switching off, the EvenFlow app will no longer send appointment reminder email and text notifications
                </p>
                <div className={classes.switchWrapper}>
                    <p className={classes.text}>Email & Text Appointment Reminders</p>
                    <Switch
                        disabled={remindersLoading}
                        onChange={handleSwitch}
                        checked={isRemindersOn}
                        color="primary"
                    />
                </div>
            </DialogContent>
            <Divider style={{margin: 0}}/>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            disabled={remindersLoading}
                            onClick={onCancel}
                            className={classes.cancelButton}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={remindersLoading}
                            className={classes.saveButton}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default RemindersModal;