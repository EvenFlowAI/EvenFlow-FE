import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider, IconButton} from "@material-ui/core";
import {DialogProps} from "../types";
import {TZone, TZoneNew} from "../../../store/reducers/mobileService/types";
import {TextField} from "../../UI/TextField";
import {AddCircleOutline, Close} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {addZone, updateZone} from "../../../store/reducers/mobileService/actions";
import {useSCs} from "../../../utils/hooks";
import {ReactComponent as ChangeZone} from "../../../assets/img/changeZipZone.svg";

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
        alignItems: 'center',
        marginTop: 16,
    },
    zipsWrapper: {

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
    zone?: TZone|null,
    isEdit: boolean;
}

const AddEditGeographicZone: React.FC<TEditZoneProps> = (props) => {
    const [zoneName, setZoneName] = useState<string>('');
    const [newZip, setNewZip] = useState<string>('');
    const [zipList, setZipList] = useState<string[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.zone) {
            setZoneName(props.zone?.name);
            setZipList(props.zone.zipCodes.map(item => item.code));
        }
    }, [props.zone])

    const onCancel = () => {
        setFormIsChecked(false);
        setZoneName('');
        props.onClose();
    }
    const onSave = () => {
        setFormIsChecked(true);
        if (zoneName.length && zipList.length && selectedSC) {
            if (props.zone && props.isEdit) {
                const data: TZone = {
                    ...props.zone,
                    name: zoneName,
                    zipCodes: []
                }
                dispatch(updateZone(selectedSC.id, props.zone.id, data))
            } else {
                const data: TZoneNew = {
                    name: zoneName,
                    zipCodes: []
                }
                dispatch(addZone(selectedSC.id, data))
            }
        }
    }

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(true);
        setZoneName(e.target.value);
    }

    const onZipChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(true);
        setNewZip(e.target.value);
    }

    const onAddZip = (e: React.MouseEvent<{}>): void => {
        if (newZip.length === 5) {
            setZipList(prev => ([...prev, newZip]));
        }
    }

    const onChangeZoneClick = (code: string) => {
        // todo open new modal
    }

    const onRemoveZipClick = (code: string) => {
        // todo open new modal
    }

    return (
        <BaseModal {...props} width={570} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>{props.isEdit ? 'Edit Zone' : 'Add Zone'}</DialogTitle>
            <DialogContent style={{padding: '20px 116px'}}>
                <TextField
                    fullWidth
                    label='Zone'
                    placeholder='Type Here'
                    error={!zoneName && formIsChecked}
                    onChange={onNameChange}
                    value={zoneName}/>
                <div className={classes.fieldWrapper}>
                    <div>
                        <TextField
                            fullWidth
                            style={{width: "80%"}}
                            label='ZIP Code'
                            placeholder='Type Here'
                            error={!newZip && formIsChecked}
                            onChange={onZipChange}
                            value={newZip}/>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.addZipBtn}
                        onClick={onAddZip}
                        disabled={!zoneName.length}
                        startIcon={<AddCircleOutline/>}>
                        Add
                    </Button>
                </div>
                <div className={classes.zipsWrapper}>
                    {zipList.map(code => <div className={classes.zip}>
                        <div className={classes.zipCode}>{code}</div>
                        <div className={classes.zipActions}>
                            <IconButton onClick={() => onChangeZoneClick(code)}>
                                <ChangeZone/>
                            </IconButton>
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
    );
};

export default AddEditGeographicZone;