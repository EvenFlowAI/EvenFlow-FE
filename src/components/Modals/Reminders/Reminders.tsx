import React, {useEffect, useState} from 'react';
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider, Switch} from "@material-ui/core";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {RootState} from "../../../store/rootReducer";
import {loadReminders, updateEmailIsRequired, updateReminders} from "../../../store/reducers/serviceCenters/actions";
import {TRemindersField} from "../../../store/reducers/serviceCenters/types";

const useStyles = makeStyles(() => ({
    switchWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
}))

const Reminders: React.FC<DialogProps> = (props) => {
    const [isRemindersOn, setRemindersOn] = useState<boolean>(false);
    const [isEmailRequired, setEmailRequired] = useState<boolean>(false);
    const { reminders, remindersLoading } = useSelector((state: RootState) => state.serviceCenters);
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const classes = useStyles();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadReminders(selectedSC.id));
            setEmailRequired(selectedSC.isEmailRequired)
        }
    }, [selectedSC])

    useEffect(() => {
        setRemindersOn(reminders);
    }, [reminders])

    const handleSwitch = (field: TRemindersField) => (e: any, value: boolean) => {
        if (field === "reminders") {
            setRemindersOn(value);
        } else {
            setEmailRequired(value);
        }
    }

    const onCancel = () => {
        setRemindersOn(reminders)
        selectedSC && setEmailRequired(selectedSC.isEmailRequired)
        props.onClose();
    }

    const onSuccess = (field: TRemindersField) => {
        if (field === "email") {
            showMessage('Email Configuration updated')
        } else {
            showMessage('Appointment Reminders Configuration updated')
        }
    }

    const onError = (err: string) => {
        showError(err)
    }

    const onSave = () => {
        if (selectedSC) {
            dispatch(updateReminders(selectedSC.id, isRemindersOn, onError, () => onSuccess("reminders")))
            dispatch(updateEmailIsRequired(selectedSC.id, isEmailRequired, onError, () => onSuccess("email")))
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
                        onChange={handleSwitch("reminders")}
                        checked={isRemindersOn}
                        color="primary"
                    />
                </div>
                <div className={classes.switchWrapper}>
                    <p className={classes.text}>Email field as required</p>
                    <Switch
                        disabled={remindersLoading}
                        onChange={handleSwitch("email")}
                        checked={isEmailRequired}
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

export default Reminders;