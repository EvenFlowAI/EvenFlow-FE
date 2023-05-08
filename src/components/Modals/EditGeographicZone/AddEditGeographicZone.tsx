import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider, IconButton} from "@material-ui/core";
import {DialogProps} from "../types";
import {TZipCode, TZone, TZoneNew, TZonesServiceType, TZoneUpdate} from "../../../store/reducers/mobileService/types";
import {TextField} from "../../UI/TextField";
import {Close} from "@material-ui/icons";
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
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {loadFilteredZip, setFilteredZipCodes} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useMakeAndModelStyles} from "../AddPackage/parts/MakeAndModel/MakeAndModel";

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
    const {currentZone: currentMobileZone, isLoading: isMobileLoading, zones: mobileZones} = useSelector((state: RootState) => state.mobileService);
    const {currentZone: currentServiceValetZone, isLoading: isValetLoading, zones: valetZones} = useSelector((state: RootState) => state.serviceValet);
    const {filteredZipCodes} = useSelector((state: RootState) => state.appointmentFrame);
    const [currentZone, setCurrentZone] = useState<TZone|null>(null);
    const [zoneName, setZoneName] = useState<string>('');
    const [zipList, setZipList] = useState<string[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();

    const {onOpen, onClose, isOpen} = useModal();
    const dispatch = useDispatch();
    const classes = useStyles();
    const autocompleteClasses = useMakeAndModelStyles();
    const showError = useException();
    const showMessage = useMessage();
    const zonesList = useMemo(() => serviceType === 'serviceValet' ? valetZones : mobileZones, [serviceType, valetZones, mobileZones]);

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
        setZipList([]);
        dispatch(setFilteredZipCodes([]));
        props.onClose();
    }

    const onSuccess = () => {
        showMessage(`Zone ${isEdit ? 'updated' : 'created'}`);
        onCancel();
    }

    const onError = (err:string) => {
        showError(err)
    }

    const handleChangeZip = (e: React.ChangeEvent<{}>, option: string[]) => {
        setZipList(option);
    }

    const onInputChange = (e: React.ChangeEvent<{}>, value: string) => {
        if (selectedSC) {
            dispatch(loadFilteredZip({serviceCenterId: selectedSC.id, search: value}))
        }
    }

    const onSave = () => {
        setFormIsChecked(true);
        if (zoneName.length && selectedSC) {
            if (currentZone && isEdit) {
                const data: TZoneUpdate = {
                    ...currentZone,
                    name: zoneName,
                    zipCodes: zipList,
                    serviceType: serviceType === 'serviceValet' ? EServiceType.PickUpDropOff : EServiceType.MobileService,
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
                        serviceType: serviceType === 'serviceValet' ? EServiceType.PickUpDropOff : EServiceType.MobileService,
                        serviceCenterId: selectedSC.id,
                    }
                    if (serviceType === 'serviceValet') {
                        dispatch(addServiceValetZone(selectedSC.id, data, onSuccess, onError))
                    } else {
                        dispatch(addMobServiceZone(selectedSC.id, data, onSuccess, onError))
                    }
                } else {
                    showError('"Zip Code" must not be empty')
                }
            }
        }
    }

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(false);
        setZoneName(e.target.value);
    }

    const onChangeZoneClick = (code: string) => {
        if (setCurrentZip && isEdit && currentZone) {
            const codeObject = currentZone.zipCodes.find(item => item.code === code);
            if (codeObject) {
                setCurrentZip(codeObject);
                if (zonesList.length > 1) onOpen();
            } else {
                showError('This code is not saved to the Zip codes list of the current zone')
            }
        }
    }

    const onRemoveZipClick = (code: string) => {
        setZipList(prev => prev.filter(item => item !== code))
    }

    return (
        <div>
            <BaseModal {...props} width={570} onClose={onCancel}>
                <DialogTitle onClose={onCancel}>{isEdit ? 'Edit Zone' : 'Add Zone'}</DialogTitle>
                <DialogContent style={{padding: '20px 116px'}}>
                    { isMobileLoading || isValetLoading
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
                                <Autocomplete
                                    multiple
                                    classes={autocompleteClasses}
                                    options={filteredZipCodes}
                                    onChange={handleChangeZip}
                                    fullWidth
                                    autoComplete={true}
                                    onInputChange={onInputChange}
                                    renderInput={autocompleteRender({
                                        label: 'ZIP Code',
                                        placeholder: "Start to type ZIP",
                                        key: "zipcode",
                                    })}
                                    value={zipList}
                                />
                            </div>
                            <div className={classes.zipsWrapper}>
                                {zipList.map(code => <div className={classes.zip} key={code}>
                                    <div className={classes.zipCode}>{code}</div>
                                    <div className={classes.zipActions}>
                                        { isEdit
                                            ? <IconButton disabled={zonesList.length < 2} onClick={() => onChangeZoneClick(code)}>
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