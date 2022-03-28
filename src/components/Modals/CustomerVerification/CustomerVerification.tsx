import React, {useEffect, useState} from 'react';
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider, Switch} from "@material-ui/core";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {RootState} from "../../../store/rootReducer";
import {updateAuth} from "../../../store/reducers/serviceCenters/actions";

const useStyles = makeStyles(() => ({
    switchWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 20,
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

const CustomerVerification: React.FC<DialogProps> = (props) => {
    const [isVerificationOn, setVerificationOn] = useState<boolean>(false);
    const { remindersLoading } = useSelector((state: RootState) => state.serviceCenters);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        selectedSC && setVerificationOn(selectedSC.isAuthRequired);
    }, [selectedSC])

    const handleSwitch = (e: any, value: boolean) => {
        setVerificationOn(value);
    }

    const onCancel = () => {
        if (selectedSC) {
            setVerificationOn(selectedSC.isAuthRequired)
            props.onClose();
        }
    }

    const onSuccess = () => {
        showMessage('Customer Verification Updated')
    }

    const onError = (err: string) => {
        showError(err)
    }

    const onSave = () => {
        if (selectedSC) {
            dispatch(updateAuth(selectedSC.id, isVerificationOn, onError, onSuccess))
            props.onClose();
        }
    }

    return (
        <BaseModal {...props} width={400} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Customer Verification</DialogTitle>
            <DialogContent>
                <div className={classes.switchWrapper}>
                    <p className={classes.text}>Require customer verification</p>
                    <Switch
                        disabled={remindersLoading}
                        onChange={handleSwitch}
                        checked={isVerificationOn}
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

export default CustomerVerification;