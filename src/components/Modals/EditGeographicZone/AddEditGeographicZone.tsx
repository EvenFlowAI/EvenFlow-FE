import React, {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider, IconButton, styled} from "@material-ui/core";
import {DialogProps} from "../types";
import {TZone, TZoneNew} from "../../../store/reducers/mobileService/types";
import {TextField} from "../../UI/TextField";
import {AddCircleOutline, Close} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {addZone, updateZone} from "../../../store/reducers/mobileService/actions";
import {useException, useModal, useSCs} from "../../../utils/hooks";
import {ReactComponent as ChangeZone} from "../../../assets/img/changeZipZone.svg";
import AssignZipToZone from "../AssignZipToZone/AssignZipToZone";

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
    currentZip?: string;
    setCurrentZip?: Dispatch<SetStateAction<string>>;
}

const AddEditGeographicZone: React.FC<TEditZoneProps> = ({
                                                             isEdit,
                                                             zone,
                                                             onRemoveZipOpen,
                                                             currentZip,
                                                             setCurrentZip,
                                                             ...props}) => {
    const [zoneName, setZoneName] = useState<string>('');
    const [newZip, setNewZip] = useState<string>('');
    const [zipList, setZipList] = useState<string[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();

    const {onOpen, onClose, isOpen} = useModal();
    const dispatch = useDispatch();
    const classes = useStyles();
    const showError = useException();

    useEffect(() => {
        if (zone && props.open) {
            setZoneName(zone?.name);
            setZipList(zone.zipCodes.map(item => item.code));
        }
    }, [zone, props.open])

    const onCancel = () => {
        setFormIsChecked(false);
        setZoneName('');
        setNewZip('');
        setZipList([]);
        props.onClose();
    }
    const onSave = () => {
        setFormIsChecked(true);
        if (zoneName.length && zipList.length && selectedSC) {
            if (zone && isEdit) {
                const data: TZone = {
                    ...zone,
                    name: zoneName,
                    zipCodes: []
                }
                dispatch(updateZone(selectedSC.id, zone.id, data))
            } else {
                const data: TZoneNew = {
                    name: zoneName,
                    zipCodes: []
                }
                dispatch(addZone(selectedSC.id, data))
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
        setNewZip(e.target.value);
    }

    const onAddZip = (e: React.MouseEvent<{}>): void => {
        if (newZip.length === 5) {
            setZipList(prev => ([...prev, newZip]));
            setNewZip('');
        } else {
            setFormIsChecked(true);
            showError("It's not a valid ZIP code");
        }
    }

    const onChangeZoneClick = (code: string) => {
        if (setCurrentZip) {
            setCurrentZip(code);
            onOpen();
        }
    }

    const onRemoveZipClick = (code: string) => {
        if (isEdit) {
            if (setCurrentZip && onRemoveZipOpen) {
               setCurrentZip(code);
                onRemoveZipOpen();
            }
        } else {
            setZipList(prev => prev.filter(item => item !== code))
        }
    }

    return (
        <div>
            <BaseModal {...props} width={570} onClose={onCancel}>
                <DialogTitle onClose={onCancel}>{isEdit ? 'Edit Zone' : 'Add Zone'}</DialogTitle>
                <DialogContent style={{padding: '20px 116px'}}>
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
                                label='ZIP Code'
                                placeholder='Type Here'
                                error={newZip.length !== 5 && formIsChecked}
                                onChange={onZipChange}
                                value={newZip}/>
                        </div>
                        <AddBtn
                            variant="contained"
                            onClick={onAddZip}
                            disabled={!newZip.length}
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
            <AssignZipToZone open={isOpen} zip={currentZip} zone={zone} onClose={onClose}/>
        </div>
    );
};

export default AddEditGeographicZone;