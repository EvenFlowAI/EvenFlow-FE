import React, {Dispatch, SetStateAction} from 'react';
import {BaseModal, DialogActions, DialogContent} from "../BaseModal";
import {Button, Divider} from "@material-ui/core";
import {DialogProps} from "../types";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {removeMobServiceZone} from "../../../store/reducers/mobileService/actions";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {TZone, TZonesServiceType} from "../../../store/reducers/mobileService/types";
import {removeServiceValetZone, setCurrentZone} from "../../../store/reducers/serviceValet/actions";

type TRemoveGeographicZoneProps = DialogProps & {
    serviceType: TZonesServiceType;
    zone: TZone|null;
    setZone: Dispatch<SetStateAction<TZone|null>>;
}

const useStyles = makeStyles(() => ({
    text: {
        display: 'flex',
        justifyContent: 'center',
        padding: '16px 0 36px 0',
        fontWeight: 'bold'
    },
    wrapper: {
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

const RemoveGeographicZone: React.FC<TRemoveGeographicZoneProps> = ({serviceType, setZone, zone, ...props}) => {
    const classes = useStyles();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const onSuccess = () => showMessage(`Zone removed`)
    const onError = (err: string) => showError(err)

    const onCancel = () => props.onClose();
    const onRemove = () => {
        if (zone?.id && selectedSC) {
            dispatch(setCurrentZone(null));
            if (serviceType === 'mobileService') {
                dispatch(removeMobServiceZone(zone.id, selectedSC.id, onSuccess, onError));
            } else {
                dispatch(removeServiceValetZone(zone.id, selectedSC.id, onSuccess, onError));
            }
            setZone(null);
            props.onClose();
        }
    }

    return  <BaseModal {...props} width={540} onClose={onCancel}>
        <DialogContent>
            <div className={classes.text}>Please confirm you want to remove Zone {zone?.name ?? ''}</div>
        </DialogContent>
        <Divider style={{ margin: 0 }}/>
        <DialogActions>
            <div className={classes.wrapper}>
                <div className={classes.buttonsWrapper}>
                    <Button
                        onClick={onCancel}
                        className={classes.cancelButton}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onRemove}
                        className={classes.saveButton}>
                        Remove
                    </Button>
                </div>
            </div>
        </DialogActions>
    </BaseModal>
};

export default RemoveGeographicZone;