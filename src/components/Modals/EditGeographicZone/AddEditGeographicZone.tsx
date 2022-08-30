import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider, IconButton, styled} from "@material-ui/core";
import {DialogProps} from "../types";
import {TZipCode, TZone, TZoneNew, TZonesServiceType, TZoneUpdate} from "../../../store/reducers/mobileService/types";
import {TextField} from "../../UI/TextField";
import {AddCircleOutline, Close} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    addServiceValetZone,
    getServiceValetZoneById,
    updateServiceValetZone
} from "../../../store/reducers/serviceValet/actions";
import {useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {ReactComponent as ChangeZone} from "../../../assets/img/changeZipZone.svg";
import AssignZipToZone from "../AssignZipToZone/AssignZipToZone";
import {
    addMobServiceZone,
    getMobileZoneById,
    updateMobServiceZone
} from "../../../store/reducers/mobileService/actions";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../UI/Loading";

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
    addZipBtn: {
        textTransform: 'none',
        marginLeft: 16,
        backgroundColor: '#F7F8FB',
        color: '#AEBEF2',
    },
    fieldWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 16,
    },
    zipsWrapper: {
        marginTop: 8,
    },
    zip: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
    },
    zipCode: {
        fontSize: 15,
    },
    zipActions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        '& > svg': {
            marginLeft: 8,
            cursor: 'pointer',
        }
    }
}))

const AddBtn = styled(Button)({
    textTransform: 'none',
    marginLeft: 16,
    backgroundColor: '#F7F8FB',
    color: '#7898FF',
    padding: '8px 16px',
    '.MuiButtonBase-root:disabled': {
        color: '#AEBEF2',
    }
})

type TEditZoneProps = DialogProps & {
    isEdit: boolean;
    zone?: TZone|null,
    onRemoveZipOpen?: () => void;
    currentZip?: TZipCode|null;
    setCurrentZip?: Dispatch<SetStateAction<TZipCode|null>>;
    serviceType: TZonesServiceType;
}

const AddEditGeographicZone: React.FC<TEditZoneProps> = ({
                                                             isEdit,
                                                             zone,
                                                             onRemoveZipOpen,
                                                             currentZip,
                                                             setCurrentZip,
                                                             serviceType,
                                                             ...props}) => {
    const {currentZone: currentMobileZone, isLoading: isMobileloading} = useSelector((state: RootState) => state.mobileService);
    const {currentZone: currentServiceValetZone, isLoading: isValetLoading} = useSelector((state: RootState) => state.serviceValet);
    const [currentZone, setCurrentZone] = useState<TZone|null>(null);
    const [zoneName, setZoneName] = useState<string>('');
    const [newZip, setNewZip] = useState<number|''>('');
    const [zipList, setZipList] = useState<number[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();

    const {onOpen, onClose, isOpen} = useModal();
    const dispatch = useDispatch();
    const classes = useStyles();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (zone && props.open) {
            if (serviceType === 'serviceValet') {
                dispatch(getServiceValetZoneById(zone.id))
            } else {
                dispatch(getMobileZoneById(zone.id))
            }
        }
    }, [serviceType, zone, props.open])

    useEffect(() => {
        if (zone) {
            setCurrentZone(serviceType === 'serviceValet' ? currentServiceValetZone : currentMobileZone);
        }
    }, [zone, serviceType, currentServiceValetZone, currentMobileZone])

    useEffect(() => {
        if (isEdit && currentZone && props.open) {
            setZoneName(currentZone?.name);
            setZipList(currentZone.zipCodes.map(item => item.code));
        }
    }, [currentZone, props.open])

    const onCancel = () => {
        setFormIsChecked(false);
        setZoneName('');
        setNewZip('');
        setZipList([]);
        props.onClose();
    }

    const onSuccess = () => {
        showMessage(`The Zone ${currentZone?.name} was ${isEdit ? 'updated' : 'created'} successfully`);
    }

    const onError = (err:string) => {
        showError(err)
    }

    const onSave = () => {
        setFormIsChecked(true);
        if (zoneName.length && selectedSC) {
            if (currentZone && isEdit) {
                const data: TZoneUpdate = {
                    ...currentZone,
                    name: zoneName,
                    zipCodes: zipList,
                    serviceType: serviceType === 'serviceValet' ? EServiceType.PikUpDropOff : EServiceType.MobileService,
                }
                if (serviceType === 'serviceValet') {
                    dispatch(updateServiceValetZone(currentZone.id, selectedSC.id, data, onSuccess, onError))
                } else {
                    dispatch(updateMobServiceZone(currentZone.id, selectedSC.id, data, onSuccess, onError))
                }
            } else {
                if (zipList.length) {
                    const data: TZoneNew = {
                        name: zoneName,
                        zipCodes: zipList,
                        serviceType: serviceType === 'serviceValet' ? EServiceType.PikUpDropOff : EServiceType.MobileService,
                        serviceCenterId: selectedSC.id,
                    }
                    if (serviceType === 'serviceValet') {
                        dispatch(addServiceValetZone(selectedSC.id, data, onSuccess, onError))
                    } else {
                        dispatch(addMobServiceZone(selectedSC.id, data, onSuccess, onError))
                    }
                } else {
                    showError('ZIP codes list must not be empty')
                }
            }
        }
        onCancel();
    }

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(false);
        setZoneName(e.target.value);
    }

    const onZipChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(false);
        setNewZip(+e.target.value);
    }

    const onAddZip = (): void => {
        if (newZip.toString().length !== 5) {
            setFormIsChecked(true);
            showError("It's not a valid ZIP code");
        } else if (newZip && zipList.includes(newZip)) {
            setFormIsChecked(true);
            showError("This ZIP code already exists in the list");
        } else {
            if (newZip) {
                setZipList(prev => ([...prev, newZip]));
                setNewZip('');
            }
        }
    }

    const onKeyUp = (e: React.KeyboardEvent) => {
        if (e.keyCode === 13) onAddZip();
    }

    const onChangeZoneClick = (code: number) => {
        if (setCurrentZip && isEdit && currentZone) {
            const codeObject = currentZone.zipCodes.find(item => item.code === code);
            if (codeObject) {
                setCurrentZip(codeObject);
                onOpen();
            } else {
                showError('This code has not been saved to the ZIP codes list of the current zone')
            }
        }
    }

    const onRemoveZipClick = (code: number) => {
        setZipList(prev => prev.filter(item => item !== code))
    }

    return (
        <div>
            <BaseModal {...props} width={570} onClose={onCancel}>
                <DialogTitle onClose={onCancel}>{isEdit ? 'Edit Zone' : 'Add Zone'}</DialogTitle>
                <DialogContent style={{padding: '20px 116px'}}>
                    { isMobileloading || isValetLoading
                        ? <Loading/>
                        : <>
                            <TextField
                                fullWidth
                                label='Zone'
                                placeholder='Type Here'
                                error={!zoneName && formIsChecked}
                                onChange={onNameChange}
                                value={zoneName}/>
                            <div className={classes.fieldWrapper}>
                                <div style={{width: "80%"}}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label='ZIP Code'
                                        placeholder='Type Here'
                                        onKeyUp={onKeyUp}
                                        error={newZip.toString().length !== 5 && formIsChecked}
                                        onChange={onZipChange}
                                        value={newZip}/>
                                </div>
                                <AddBtn
                                    variant="contained"
                                    onClick={onAddZip}
                                    disabled={!newZip.toString().length}
                                    startIcon={<AddCircleOutline/>}>
                                    Add
                                </AddBtn>
                            </div>
                            <div className={classes.zipsWrapper}>
                                {zipList.map(code => <div className={classes.zip} key={code}>
                                    <div className={classes.zipCode}>{code}</div>
                                    <div className={classes.zipActions}>
                                        { isEdit
                                            ? <IconButton onClick={() => onChangeZoneClick(code)}>
                                                <ChangeZone/>
                                            </IconButton>
                                            : null }
                                        <IconButton onClick={() => onRemoveZipClick(code)}>
                                            <Close/>
                                        </IconButton>
                                    </div>
                                </div>)}
                            </div>
                        </>
                    }
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
                                onClick={onSave}
                                className={classes.saveButton}>
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogActions>
            </BaseModal>
            <AssignZipToZone open={isOpen} zip={currentZip} zone={zone} onClose={onClose} serviceType={serviceType}/>
        </div>
    );
};

export default AddEditGeographicZone;