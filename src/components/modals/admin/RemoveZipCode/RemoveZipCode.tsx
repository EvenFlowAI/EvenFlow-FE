import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {Button, Divider} from "@material-ui/core";
import {DialogProps} from "../../BaseModal/types";
import {useDispatch} from "react-redux";
import {removeZipFromMobServiceZone} from "../../../../store/reducers/mobileService/actions";
import {TZipCode, TZone, TZonesServiceType} from "../../../../store/reducers/mobileService/types";
import {removeZipFromServiceValetZone} from "../../../../store/reducers/serviceValet/actions";
import {useStyles} from "./styles";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

type TRemoveGeographicZoneProps = DialogProps & {
    zone: TZone|null;
    zip: TZipCode|null;
    serviceType: TZonesServiceType;
}

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
        <DialogTitle onClose={onCancel}>Remove Zip code</DialogTitle>
        <DialogContent>
            <div className={classes.text}>Please confirm you want to remove Zip code from the {zone?.name}</div>
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