import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {Button, Divider, IconButton} from "@mui/material";
import {DialogProps} from "../../BaseModal/types";
import {TZipCode, TZone, TZoneNew, TZonesServiceType, TZoneUpdate} from "../../../../store/reducers/mobileService/types";
import {TextField} from "../../../formControls/TextFieldStyled/TextField";
import {Close} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {
    addServiceValetZone,
    getServiceValetZoneById,
    updateServiceValetZone
} from "../../../../store/reducers/serviceValet/actions";
import {ReactComponent as ChangeZone} from "../../../../assets/img/changeZipZone.svg";
import AssignZipToZoneModal from "./AssignZipToZoneModal/AssignZipToZoneModal";
import {
    addMobServiceZone,
    getMobileZoneById,
    updateMobServiceZone
} from "../../../../store/reducers/mobileService/actions";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../wrappers/Loading/Loading";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import { Autocomplete } from '@mui/material';
import {loadFilteredZip, setFilteredZipCodes} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useStyles} from "./styles";
import {useAutocompleteStyles} from "../../../../hooks/styling/useAutocompleteStyles";
import {useModal} from "../../../../hooks/useModal/useModal";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

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
    const autocompleteClasses = useAutocompleteStyles();
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
                                            ? <IconButton
                                            disabled={zonesList.length < 2}
                                            onClick={() => onChangeZoneClick(code)}
                                            size="large">
                                                <ChangeZone/>
                                            </IconButton>
                                            : null }
                                        <IconButton onClick={() => onRemoveZipClick(code)} size="large">
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
            <AssignZipToZoneModal open={isOpen} zip={currentZip} zone={zone} onClose={onClose} serviceType={serviceType}/>
        </div>
    );
};

export default AddEditGeographicZone;