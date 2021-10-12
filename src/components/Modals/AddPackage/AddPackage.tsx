import React, {useCallback, useState} from 'react';
import {DialogProps} from "../types";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {makeStyles} from "@material-ui/core/styles";
import {TextField} from "../../UI/TextField";
import {AddCircleOutline} from "@material-ui/icons";
import {IconButton, Button} from "@material-ui/core";
import OpsCode from "./parts/OpsCodeLabel";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {mileageOptions, yearOptions} from "../../AppointmentFlow/AppointmentFrame/MaintenanceDetails";
import {useModal} from "../../../utils/hooks";
import AssignOpsCode from "./parts/AssignOpsCode/AssignOpsCode";
import AddOpsCode from "./parts/AddOpsCode/AddOpsCode";
import {IAssignedServiceRequest, IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import ExistingPackages from "./parts/ExistingPackages/ExistingPackages";
import {IPackageByQuery} from "../../../api/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import PackageLabel from "./parts/PackageLabel";

type TModalProps = DialogProps;

interface IVehiclesData {
    make: string[] | undefined;
    model: string[] | undefined;
    mileageFrom: string | null;
    mileageTo: string | null;
    yearFrom: string |null;
    yearTo: string | null;
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
        '& .MuiAutocomplete-root': {
            width: '47%',
        }
    },
    addExisting: {
        display: "flex",
        alignItems: 'center',
        color: '#7898FF',
        fontSize: 12,
        paddingLeft: 5,
        marginBottom: 30,
    },
    wideButton: {
        width: '100%',
        color: '#7898FF',
        border: '1px solid #7898FF',
        borderRadius: 0,
        marginBottom: 16,
        fontSize: 12,
    },
    label: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
        marginBottom: 10,
    },
    btnsWrapper: {
        ...baseWrapper,
        marginBottom: 24,

        '& > button:first-child': {
            marginRight: 24,
        },
        '& > button': {
            fontSize: 12,
        }
    },
    opsCodesWrapper: {
        height: 124,
        display: 'flex',
        alignItems: 'start',
        alignContent: 'start',
        justifyContent: 'stretch',
        flexWrap: 'wrap',
        overflowY: 'auto',
        marginBottom: 16,
        background: '#F7F8FB',
        color: '#B8B9BF',
        padding: '6px 12px',
    },
    emptyOpsCodes: {
        height: 124,
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        overflowY: 'auto',
        marginBottom: 16,
        background: '#F7F8FB',
        color: '#B8B9BF',
    },
    fullWidth: {
        '& .MuiInputBase-root': {
            width: '100%',
        }
    },
    contentWrapper: {
        padding: 20,
    },
    iconPlus: {
        '& .MuiSvgIcon-root': {
            fill: '#7898FF',
        }
    },
    checkbox: {
      '& > span > input': {
          padding: 0,
      }
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
    const { packages } = useSelector((state: RootState) => state.packages);

    const [packageName, setPackageName] = useState<string | null>(null);
    const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
    const [opsCodes, setOpsCodes] = useState<IAssignedServiceRequest[]>([]);
    const [assignedOpsCodes, setAssignedOpsCodes] = useState<number[]>([]);
    const [complimentary, setComplimentary] = useState<number[]>([]);
    const [vehiclesData, setVehiclesData] = useState<IVehiclesData>(initialValues);

    const {isOpen: isAssignOpsCodeOpen, onOpen: onAssignOpsCodeOpen, onClose: onAssignOpsCodeClose} = useModal();
    const {isOpen: isAddOpsCodeOpen, onOpen: onAddOpsCodeOpen, onClose: onAddOpsCodeClose} = useModal();
    const {isOpen: isComplimentaryOpen, onOpen: onComplimentaryOpen, onClose: onComplimentaryClose} = useModal();
    const {isOpen: isExistingOpen, onOpen: onExistingOpen, onClose: onExistingClose} = useModal();
    const classes = useStyles();

    const handleClose = useCallback(() => {
        props.onClose();
    }, [])

    const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setPackageName(e.target.value);
    }, [])

    const onFormFieldChange = useCallback(
        (fieldName: keyof IVehiclesData) =>
        (e: React.ChangeEvent<{}>, value: string[] | string | null): void => {
       setVehiclesData((prevData: IVehiclesData) => ({...prevData, [fieldName]: value}))
    }, [])

    const onDelete = (serviceRequest: IServiceRequest): void => {
        setOpsCodes(prev => prev.filter(item => serviceRequest.id !== item.serviceRequest.id));
    }

    const onPackageDelete = (pack: IPackageByQuery) => {
        setSelectedPackages(prev => prev.includes(pack.id) ? prev.filter(el => el !== pack.id) : [...prev, pack.id]);
    }

    return (
        <BaseModal {...props} width={460}>
            <DialogTitle onClose={handleClose}>Add Maintenance Package</DialogTitle>
            <DialogContent>
                <div className={classes.contentWrapper}>
                    <div className={classes.fullWidth}>
                        <TextField
                            label='Maintenance Package Name'
                            placeholder='Type Package Name'
                            onChange={onNameChange}
                            value={packageName}/>
                    </div>
                    {selectedPackages.map(item => {
                        const pack = packages.find(el => el.id === item)
                        return pack ? <PackageLabel pack={pack} onDelete={onPackageDelete}/> : null
                    })}

                    <div className={classes.addExisting}>
                        <IconButton onClick={onExistingOpen} className={classes.iconPlus}>
                            <AddCircleOutline/>
                        </IconButton>
                        <span> Add New Existing Maintenance Package</span>
                    </div>

                    <Button
                        className={classes.wideButton}
                        color="primary"
                        onClick={onAssignOpsCodeOpen}>
                        Assign Ops Code To Package
                    </Button>

                    <div className={classes.label}>Ops Codes</div>
                    <div className={opsCodes?.length ? classes.opsCodesWrapper : classes.emptyOpsCodes}>
                        { opsCodes?.length
                            ? opsCodes.map(item => <OpsCode serviceRequest={item.serviceRequest} onDelete={onDelete}/>)
                            : <p>There are no ops codes in this list yet</p>
                        }
                    </div>

                    <div className={classes.label}>Add Ops Code To Package</div>
                    <div className={classes.btnsWrapper}>
                        <Button
                            color="primary"
                            className={classes.wideButton}
                            onClick={onAddOpsCodeOpen}>
                            Add Ops Codes
                        </Button>
                        <Button
                            color="primary"
                            className={classes.wideButton}
                            onClick={onComplimentaryOpen}>
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
                    </div>

                    <div className={classes.formWrapper}>
                        <Autocomplete
                            options={mileageOptions}
                            disableCloseOnSelect
                            value={vehiclesData?.mileageFrom}
                            onChange={onFormFieldChange('mileageFrom')}
                            renderInput={autocompleteRender({label: "Mileage", placeholder: 'From'})}
                        />
                        <Autocomplete
                            options={mileageOptions}
                            disableCloseOnSelect
                            value={vehiclesData?.mileageTo}
                            onChange={onFormFieldChange('mileageTo')}
                            renderInput={autocompleteRender({label: '', placeholder: 'To'})}
                        />
                    </div>

                    <div className={classes.formWrapper}>
                        <Autocomplete
                            options={yearOptions}
                            disableCloseOnSelect
                            value={vehiclesData?.yearFrom}
                            onChange={onFormFieldChange('yearFrom')}
                            renderInput={autocompleteRender({label: 'Vehicle Year', placeholder: 'From'})}
                        />
                        <Autocomplete
                            options={yearOptions}
                            disableCloseOnSelect
                            value={vehiclesData?.yearTo}
                            onChange={onFormFieldChange('yearTo')}
                            renderInput={autocompleteRender({label: '', placeholder: 'To'})}
                        />
                    </div>
                </div>
            </DialogContent>

            <AssignOpsCode
                open={isAssignOpsCodeOpen}
                onClose={onAssignOpsCodeClose}
                selectedCodes={assignedOpsCodes}
                setSelectedCodes={setAssignedOpsCodes}/>
            <AssignOpsCode
                isComplimentary
                open={isComplimentaryOpen}
                onClose={onComplimentaryClose}
                selectedCodes={complimentary}
                setSelectedCodes={setComplimentary}/>
            <AddOpsCode
                open={isAddOpsCodeOpen}
                onClose={onAddOpsCodeClose}
                selectedCodes={opsCodes}
                setSelectedCodes={setOpsCodes}/>
            <ExistingPackages
                open={isExistingOpen}
                onClose={onExistingClose}
                selectedPackages={selectedPackages}
                setSelectedPackages={setSelectedPackages}/>
        </BaseModal>
    );
};

export default AddPackage;