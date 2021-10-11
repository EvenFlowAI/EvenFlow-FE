import React, {useCallback, useState} from 'react';
import {DialogProps} from "../types";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {makeStyles} from "@material-ui/core/styles";
import {TextField} from "../../UI/TextField";
import {PlusOneRounded} from "@material-ui/icons";
import {IconButton, Button} from "@material-ui/core";

type TModalProps = DialogProps;

interface IVehiclesData {
    make: [] | null;
    model: [] | null;
    mileageFrom: number | null;
    mileageTo: number | null;
    yearFrom: number |null;
    yearTo: number | null;
    customerCriteria: string | null;
}

const baseWrapper = {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
}

const useStyles = makeStyles(() => ({
    formWrapper: {
       ...baseWrapper,
    },
    addExisting: {
        display: "flex",
        alignItems: 'center',
        color: '#7898FF',
        fontSize: 12,
        marginBottom: 30,
        '& > span:not(:first-child)': {
            marginLeft: 12,
        }
    },
    wideButton: {
        width: '100%'
    },
    label: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    btnsWrapper: {
        ...baseWrapper,
    },
    opsCodesWrapper: {
        height: 52,
        display: 'flex',
        justifyContent: 'stretch',
        overflow: 'scroll',
    },
    emptyOpsCodes: {
        height: 52,
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        overflow: 'scroll',
    }
}))

const initialValues = {
    make: null,
    model: null,
    mileageFrom: null,
    mileageTo: null,
    yearFrom: null,
    yearTo: null,
    customerCriteria: null,
}

const AddPackage: React.FC<TModalProps> = (props) => {
    const [packageName, setPackageName] = useState<string | null>(null);
    const [addedExistingPackages, setAddedExistingPackages] = useState<number[] | []>([]);
    const [opsCodes, setOpsCodes] = useState<number[]>([]);
    const [complimentary, setComplimentary] = useState<number[]>([]);
    const [vehiclesData, setVehiclesData] = useState<IVehiclesData>(initialValues);
    const classes = useStyles();

    const handleClose = useCallback(() => {
        props.onClose();
    }, [])

    const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setPackageName(e.target.value);
    }, [])

    const onAddExistingClick = useCallback((): void => {

    }, [])

    const assignOpsCode = useCallback((): void => {

    }, [])

    const addOpsCode = useCallback((): void => {

    }, [])

    const addComplimentary = useCallback((): void => {

    }, [])

    const onFormFieldChange = useCallback((value: string | number | string[], fieldName: 'string'): void => {
        setVehiclesData(prevData => ({...prevData, [fieldName]: value}))
    }, [])

    return (
        <BaseModal {...props}>
            <DialogTitle onClose={handleClose}>Add Maintenance Package</DialogTitle>
            <DialogContent>
                <TextField label='Maintenance Package Name' onChange={onNameChange} value={packageName}/>
                <div className={classes.addExisting}>
                    <IconButton onClick={onAddExistingClick}><PlusOneRounded/></IconButton>
                    <span> Add New Existing Maintenance Package</span>
                </div>
                <Button
                    className={classes.wideButton}
                    color="primary"
                    onClick={assignOpsCode}>
                    Assign Ops Code To Package
                </Button>
                <div className={opsCodes?.length ? classes.opsCodesWrapper : classes.emptyOpsCodes}>
                    {/*{opsCodes?.length ?}*/}
                </div>
                <span className={classes.label}>Add Ops Code To Package</span>
                <div className={classes.btnsWrapper}>
                    <Button
                        color="primary"
                        onClick={addOpsCode}>
                        Add Ops Codes
                    </Button>
                    <Button
                        color="primary"
                        onClick={addComplimentary}>
                        Add Complimentary
                    </Button>
                </div>
                <div className={classes.formWrapper}>
                </div>
            </DialogContent>
        </BaseModal>
    );
};

export default AddPackage;