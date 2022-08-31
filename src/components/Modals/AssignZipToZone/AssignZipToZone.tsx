import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider, MenuItem, Select} from "@material-ui/core";
import {TReassignZip, TZipCode, TZone, TZonesServiceType} from "../../../store/reducers/mobileService/types";
import {TextField} from "../../UI/TextField";
import {assignZipToMobServiceZone} from "../../../store/reducers/mobileService/actions";
import {
    reassignZipToServiceValetZone,
} from "../../../store/reducers/serviceValet/actions";
import {RootState} from "../../../store/rootReducer";

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

type TAssignZipToZoneProps = DialogProps & {
    serviceType: TZonesServiceType;
    zip?: TZipCode|null;
    zone?: TZone|null;
}

const AssignZipToZone:React.FC<TAssignZipToZoneProps> = ({zip, zone, serviceType, ...props}) => {
    const {zones: serviceValetZones, currentZone: currentValetZone} = useSelector((state: RootState) => state.serviceValet);
    const {zones: mobileServiceZones, currentZone: currentMobileZone} = useSelector((state: RootState) => state.mobileService);
    const [selectedZone, setSelectedZone] = useState<TZone|null>(null);
    const [data, setData] = useState<TZone[]>([]);
    const classes = useStyles();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        setData(serviceType === 'serviceValet' ? serviceValetZones : mobileServiceZones);
    }, [serviceType, serviceValetZones, mobileServiceZones])

    const onCancel = () => props.onClose();

    const onSuccess = () => {
        showMessage(`ZIP code ${zip?.code} was reassigned to the zone ${selectedZone?.name}`)
        props.onClose();
    }

    const onError = (err:string) => {
        showError(err)
    }

    const onAssign = () => {
        if (selectedSC && selectedZone && zip) {
            const data: TReassignZip = {
                id: zip.id,
                geographicZoneId: selectedZone.id,
            }
            if (serviceType === 'mobileService') {
                if (currentMobileZone) {
                    dispatch(assignZipToMobServiceZone(zip.id, selectedSC.id, data, currentMobileZone.id, onSuccess, onError));
                }
            } else {
                if (currentValetZone) {
                    dispatch(reassignZipToServiceValetZone(zip.id, selectedSC.id, data, currentValetZone.id, onSuccess, onError));
                }
            }
        }
    }
    const onChange = (e: React.ChangeEvent<{value: unknown}>) => {
        const selected = serviceType === 'serviceValet'
            ? serviceValetZones.find(item => item.id === e.target.value as number)
            : mobileServiceZones.find(item => item.id === e.target.value as number)
        if (selected) setSelectedZone(selected);
    }

    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Assign ZIP to Another Zone</DialogTitle>
            <DialogContent>
                <Select
                    fullWidth
                    input={<TextField label="Choose zone From the list" placeholder="Zone name"/>}
                    id="zone"
                    placeholder="Zone name"
                    name="zone"
                    value={selectedZone?.id ?? ''}
                    onChange={onChange}
                >
                    {data.filter(item => item.id !== zone?.id).map(item => <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>)}
                </Select>
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
                            onClick={onAssign}
                            className={classes.saveButton}>
                            Assign
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default AssignZipToZone;