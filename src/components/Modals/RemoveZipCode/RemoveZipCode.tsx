import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider} from "@material-ui/core";
import {DialogProps} from "../types";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {removeZipFromMobServiceZone} from "../../../store/reducers/mobileService/actions";
import {useSCs} from "../../../utils/hooks";
import {TZipCode, TZone, TZonesServiceType} from "../../../store/reducers/mobileService/types";
import {removeZipFromServiceValetZone} from "../../../store/reducers/serviceValet/actions";

type TRemoveGeographicZoneProps = DialogProps & {
    zone: TZone|null;
    zip: TZipCode|null;
    serviceType: TZonesServiceType;
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

const RemoveZipCode: React.FC<TRemoveGeographicZoneProps> = ({serviceType, zip, zone, ...props}) => {
    const classes = useStyles();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    const onCancel = () => props.onClose();
    const onRemove = async () => {
        if (zone?.id && selectedSC && zip) {
            if (serviceType === 'mobileService') {
                await dispatch(removeZipFromMobServiceZone(selectedSC.id, zip));
            } else {
                await dispatch(removeZipFromServiceValetZone(selectedSC.id, zip));
            }
            await props.onClose();
        }
    }

    return  <BaseModal {...props} width={540} onClose={onCancel}>
        <DialogTitle onClose={onCancel}>Remove ZIP code</DialogTitle>
        <DialogContent>
            <div className={classes.text}>Are you sure you want to remove ZIP code from the {zone?.name}?</div>
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

export default RemoveZipCode;