import React, {useCallback, useState} from 'react';
import {DialogProps} from "../types";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {makeStyles} from "@material-ui/core/styles";
import {TextField} from "../../UI/TextField";
import {PlusOneRounded} from "@material-ui/icons";
import {IconButton, Button} from "@material-ui/core";
import OpsCode from "./parts/OpsCodeLabel";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";

type TModalProps = DialogProps;

interface IVehiclesData {
    make: string[] | undefined;
    model: string[] | undefined;
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
    make: undefined,
    model: undefined,
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

    const openOpsCodesModal = useCallback((): void => {

    }, [])

    const addComplimentary = useCallback((): void => {

    }, [])

    const onFormFieldChange = useCallback(
        (fieldName: keyof IVehiclesData) =>
        (e: React.ChangeEvent<{}>, value: string[] | number | null): void => {
       setVehiclesData((prevData: IVehiclesData) => ({...prevData, [fieldName]: value}))
    }, [])

    const onDelete = (code: number): void => {
        setOpsCodes(prev => prev.filter(item => item !== code));
    }

    return (
        <BaseModal {...props} width={460}>
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
                    { opsCodes?.length
                        ? opsCodes.map(item => <OpsCode code={item} onDelete={onDelete}/>)
                        : <p>There are no ops codes in this list yet</p>
                    }
                </div>
                <span className={classes.label}>Add Ops Code To Package</span>
                <div className={classes.btnsWrapper}>
                    <Button
                        color="primary"
                        onClick={openOpsCodesModal}>
                        Add Ops Codes
                    </Button>
                    <Button
                        color="primary"
                        onClick={addComplimentary}>
                        Add Complimentary
                    </Button>
                </div>
                <div className={classes.formWrapper}>
                    <Autocomplete
                        multiple
                        options={['BMW', 'Ford', 'Infinity']}
                        disableCloseOnSelect
                        value={vehiclesData?.make}
                        onChange={onFormFieldChange('make')}
                        renderInput={autocompleteRender({label: "Make", fullWidth: true, placeholder: 'Select Make'})}
                    />
                    <Autocomplete
                        multiple
                        options={['2Series', '3Series', '5Series']}
                        disableCloseOnSelect
                        value={vehiclesData?.model}
                        onChange={onFormFieldChange('model')}
                        renderInput={autocompleteRender({label: "Model", fullWidth: true, placeholder: 'Select Model'})}
                    />
                    <Autocomplete
                        options={[1000, 10000, 20000]}
                        disableCloseOnSelect
                        value={vehiclesData?.mileageFrom}
                        onChange={onFormFieldChange('mileageFrom')}
                        renderInput={autocompleteRender({label: "Mileage", placeholder: 'From'})}
                    />
                    <Autocomplete
                        options={[1000, 10000, 20000]}
                        disableCloseOnSelect
                        value={vehiclesData?.mileageTo}
                        onChange={onFormFieldChange('mileageTo')}
                        renderInput={autocompleteRender({label: '', placeholder: 'To'})}
                    />
                    <Autocomplete
                        options={[1997, 1998, 2000]}
                        disableCloseOnSelect
                        value={vehiclesData?.yearFrom}
                        onChange={onFormFieldChange('yearFrom')}
                        renderInput={autocompleteRender({label: '', placeholder: 'From'})}
                    />
                    <Autocomplete
                        options={[1997, 1998, 2000]}
                        disableCloseOnSelect
                        value={vehiclesData?.yearTo}
                        onChange={onFormFieldChange('yearTo')}
                        renderInput={autocompleteRender({label: '', placeholder: 'To'})}
                    />
                </div>
            </DialogContent>
        </BaseModal>
    );
};

export default AddPackage;