import React, {useEffect, useState} from 'react';
import {Button, Divider, Switch} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {updateAdvisor} from "../../../store/reducers/serviceCenters/actions";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {SquarePaper} from "../../../components/styled/Paper";
import {useStyles} from "./styles";
import {capacityManagementRoot} from "../../../utils/constants";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";

const ManageExEFAppointments = () => {
    const [isManageOn, setManageOn] = useState<boolean>(false);
    const { remindersLoading } = useSelector((state: RootState) => state.serviceCenters);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const { classes  } = useStyles();

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
            <TitleContainer title="Manage Ex EvenFlow Appointments" pad parent={capacityManagementRoot}/>
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

export default ManageExEFAppointments;