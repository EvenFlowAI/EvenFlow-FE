import React, {useEffect, useState} from 'react';
import {Button, Divider, Switch} from "@material-ui/core";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {RootState} from "../../../store/rootReducer";
import {updateAdvisor} from "../../../store/reducers/serviceCenters/actions";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {SquarePaper} from "../../UI/Paper";

const useStyles = makeStyles(() => ({
    switchWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 16,
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
    label: {
        fontWeight: "bold",
        fontSize: 20,
    }
}))

const ManageAppointments = () => {
    const [isManageOn, setManageOn] = useState<boolean>(false);
    const { remindersLoading } = useSelector((state: RootState) => state.serviceCenters);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        selectedSC && setManageOn(Boolean(selectedSC.isUpdateAdvisorInAppointments));
    }, [selectedSC])

    const handleSwitch = (e: any, value: boolean) => {
        setManageOn(value);
    }

    const onCancel = () => {
        if (selectedSC) {
            setManageOn(Boolean(selectedSC.isUpdateAdvisorInAppointments));
        }
    }

    const onSuccess = () => {
        showMessage('Manage Ex EvenFlow Appointments updated')
    }

    const onError = (err: string) => {
        showError(err)
    }

    const onSave = () => {
        if (selectedSC) {
            dispatch(updateAdvisor(selectedSC.id, isManageOn, onError, onSuccess))
        }
    }

    return (
        <div style={{width: '100%'}}>
            <TitleContainer title="Manage Ex EvenFlow Appointments" pad parent={optimizerRoot}/>
            <SquarePaper variant="outlined" style={{padding: 20}}>
                <p className={classes.text}>
                    By switching off, the EvenFlow app will no longer flag appointments as "Main Drive" or "Express Service".
                    This feature is only for appointments made outside of EvenFlow through some other booking channel.
                </p>
                <div className={classes.switchWrapper}>
                    <p className={classes.label}>
                        Flag Appointments as Main Drive or Express Service
                    </p>
                    <Switch
                        disabled={remindersLoading}
                        onChange={handleSwitch}
                        checked={isManageOn}
                        color="primary"
                    />
                </div>
                <Divider style={{margin: 0}}/>
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
            </SquarePaper>
        </div>
    );
};

export default ManageAppointments;