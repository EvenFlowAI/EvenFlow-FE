import React, {useCallback, useEffect, useState} from 'react';
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {makeStyles} from "@material-ui/core/styles";
import {TextField} from "../../UI/TextField";
import {AddCircleOutline} from "@material-ui/icons";
import {IconButton, Button, Divider} from "@material-ui/core";
import OpsCode from "./parts/OpsCodeLabel";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {mileageOptions, yearOptions} from "../../AppointmentFlow/AppointmentFrame/MaintenanceDetails";
import {useModal} from "../../../utils/hooks";
import AssignOpsCode from "./parts/AssignOpsCode/AssignOpsCode";
import AddOpsCode from "./parts/AddOpsCode/AddOpsCode";
import {IAssignedServiceRequest, IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import ExistingPackages from "./parts/ExistingPackages/ExistingPackages";
import {IMake, IPackageByQuery} from "../../../api/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import PackageLabel from "./parts/PackageLabel";
import {loadMakes} from "../../../store/reducers/packages/actions";
import MakeAndModel from "./parts/MakeAndModel/MakeAndModel";

type TModalProps = DialogProps;
export type TMake = IMake & {
    id: number,
}

interface IVehiclesData {
    makesWithModels: IMake[] | undefined;
    mileageFrom: string | undefined;
    mileageTo: string | undefined;
    yearFrom: string | undefined;
    yearTo: string | undefined;
    customerCriteria: string | undefined;
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
    errorOpsCodes: {
        height: 124,
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        overflowY: 'auto',
        marginBottom: 16,
        background: '#F7F8FB',
        color: '#B8B9BF',
        border: '1px solid red'
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
    },
    twoFieldsWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: 8,
        '& .MuiAutocomplete-root': {
            width: '100%',
        }
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

const useAutocompleteStyles = makeStyles(() => ({
    clearIndicator: {
        width: 0,
    }
}))

const initialValues = {
    makesWithModels: undefined,
    mileageFrom: undefined,
    mileageTo: undefined,
    yearFrom: undefined,
    yearTo: undefined,
    customerCriteria: 'Any',
}

const initialMakes = [{
    name: '',
    models: [],
    id: 0,
}]

const criteriaOptions = ['Any', 'Own', 'Lease'];

const AddPackage: React.FC<TModalProps> = (props) => {
    const { packages, makes: makesFromDB } = useSelector((state: RootState) => state.packages);
    const { selectedSC } = useSelector((state: RootState) => state.serviceCenters);

    const [packageName, setPackageName] = useState<string | null>(null);
    const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
    const [opsCodes, setOpsCodes] = useState<IAssignedServiceRequest[]>([]);
    const [assignedOpsCodes, setAssignedOpsCodes] = useState<number[]>([]);
    const [complimentary, setComplimentary] = useState<number[]>([]);
    const [vehiclesData, setVehiclesData] = useState<IVehiclesData>(initialValues);
    const [makes, setMakes] = useState<TMake[]>(initialMakes);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

    const {isOpen: isAssignOpsCodeOpen, onOpen: onAssignOpsCodeOpen, onClose: onAssignOpsCodeClose} = useModal();
    const {isOpen: isAddOpsCodeOpen, onOpen: onAddOpsCodeOpen, onClose: onAddOpsCodeClose} = useModal();
    const {isOpen: isComplimentaryOpen, onOpen: onComplimentaryOpen, onClose: onComplimentaryClose} = useModal();
    const {isOpen: isExistingOpen, onOpen: onExistingOpen, onClose: onExistingClose} = useModal();
    const classes = useStyles();
    const autoCompleteStyles = useAutocompleteStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        selectedSC && dispatch(loadMakes(selectedSC.id))
    }, [dispatch, selectedSC])

    const onCancel = () => {
        setFormIsChecked(false);
        setVehiclesData(initialValues);
        setMakes(initialMakes);
        setPackageName(null);
        setSelectedPackages([]);
        setAssignedOpsCodes([]);
        setComplimentary([]);
        setOpsCodes([]);
        props.onClose();
    }

    const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setFormIsChecked(false);
        setPackageName(e.target.value);
    }, [])

    const onFormFieldChange = useCallback(
        (fieldName: keyof IVehiclesData) =>
        (e: React.ChangeEvent<{}>, value: string[] | string | null): void => {
            setFormIsChecked(false);
            setVehiclesData((prevData: IVehiclesData) => ({...prevData, [fieldName]: value}))
    }, [])

    const onDelete = (serviceRequest: IServiceRequest): void => {
        setFormIsChecked(false);
        setOpsCodes(prev => prev.filter(item => serviceRequest.id !== item.serviceRequest.id));
    }

    const onPackageDelete = (pack: IPackageByQuery) => {
        setFormIsChecked(false);
        setSelectedPackages(prev => prev.includes(pack.id) ? prev.filter(el => el !== pack.id) : [...prev, pack.id]);
    }

    const addNewMake = () => {
        setFormIsChecked(false);
        setMakes(prev => {
            const lastMake = makes[makes.length - 1];
            const newMake = { name: null, models: [], id: lastMake.id + 1};
            return [...prev, newMake];
        })
    }

    const getRequestsFromSelectedPackages = (): number[] => {
        const serviceRequests = opsCodes.map(item => item.id);
        if (selectedPackages) {
            selectedPackages.forEach(id => {
                const packData = packages.find(item => item.id === id);
                if (packData?.serviceRequests) {
                    serviceRequests.concat(packData.serviceRequests.map(request => request.id))
                }
            })
        }
        return serviceRequests;
    }

    const isValid = () => {
        const { yearFrom, yearTo, mileageFrom, mileageTo } = vehiclesData;
        return Boolean(packageName && opsCodes.length && yearFrom && yearTo && mileageFrom && mileageTo)
    }

    const onSave = () => {
        if (isValid()) {
            if (selectedSC) {
                const serviceRequests = getRequestsFromSelectedPackages();
                if (selectedPackages) {
                    selectedPackages.forEach(id => {
                        const packData = packages.find(item => item.id === id);
                        if (packData?.serviceRequests) {
                            serviceRequests.concat(packData.serviceRequests.map(request => request.id))
                        }
                    })
                }
                const data = {
                    name: packageName,
                    serviceRequests,
                    complimentaryServices: complimentary,
                    serviceRequestsAssigned: assignedOpsCodes,
                    serviceCenterId: selectedSC.id,
                    businessRules: {
                        vehicleMakes: [],
                        vehicleModels: [],
                        vehicleYearRange: {
                            from: vehiclesData.yearFrom,
                            to: vehiclesData.yearTo
                        },
                        vehicleMileageRange: {
                            from: vehiclesData.mileageFrom,
                            to: vehiclesData.mileageTo
                        }
                    },
                    customerCriteria: vehiclesData.customerCriteria
                }
            }
        } else setFormIsChecked(true);
    }

    return (
        <BaseModal {...props} width={540}>
            <DialogTitle onClose={onCancel}>Add Maintenance Package</DialogTitle>
            <DialogContent>
                <div className={classes.contentWrapper}>
                    <div className={classes.fullWidth}>
                        <TextField
                            label='Maintenance Package Name'
                            placeholder='Type Package Name'
                            error={!packageName && formIsChecked}
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
                    <div className={opsCodes?.length
                        ? classes.opsCodesWrapper
                        : formIsChecked
                            ? classes.errorOpsCodes
                            : classes.emptyOpsCodes}>
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

                    {makes
                        .sort((a, b) => a.id - b.id)
                        .map((make, index) => <MakeAndModel
                            key={make.name || index}
                            data={make}
                            setMakes={setMakes}
                            makes={makes}
                            formIsChecked={formIsChecked}
                    />)}

                    {makesFromDB?.length > makes.length &&
                    <div className={classes.addExisting}>
                        <IconButton onClick={addNewMake} className={classes.iconPlus}>
                            <AddCircleOutline/>
                        </IconButton>
                        <span> Add New Make</span>
                    </div>}

                    <div className={classes.formWrapper} style={{ marginBottom: 16}}>
                        <div style={{ width: '47%'}}>
                            <div className={classes.label}>Mileage</div>
                            <div className={classes.twoFieldsWrapper}>
                                <Autocomplete
                                    classes={autoCompleteStyles}
                                    options={mileageOptions}
                                    disableCloseOnSelect
                                    disableClearable
                                    value={vehiclesData?.mileageFrom}
                                    onChange={onFormFieldChange('mileageFrom')}
                                    renderInput={autocompleteRender({label: "", placeholder: 'From', error: !vehiclesData.mileageFrom && formIsChecked})}
                                />
                                <Autocomplete
                                    classes={autoCompleteStyles}
                                    options={mileageOptions}
                                    disableCloseOnSelect
                                    disableClearable
                                    value={vehiclesData?.mileageTo}
                                    onChange={onFormFieldChange('mileageTo')}
                                    renderInput={autocompleteRender({label: '', placeholder: 'To', error: !vehiclesData.mileageTo && formIsChecked})}
                                />
                            </div>
                        </div>
                        <div style={{ width: '47%'}}>
                            <div className={classes.label}>Vehicle Year</div>
                            <div className={classes.twoFieldsWrapper}>
                                <Autocomplete
                                    classes={autoCompleteStyles}
                                    disableClearable
                                    options={yearOptions}
                                    disableCloseOnSelect
                                    value={vehiclesData?.yearFrom}
                                    onChange={onFormFieldChange('yearFrom')}
                                    renderInput={autocompleteRender({label: '', placeholder: 'From', error: !vehiclesData.yearFrom && formIsChecked})}
                                />
                                <Autocomplete
                                    classes={autoCompleteStyles}
                                    options={yearOptions}
                                    disableClearable
                                    disableCloseOnSelect
                                    value={vehiclesData?.yearTo}
                                    onChange={onFormFieldChange('yearTo')}
                                    renderInput={autocompleteRender({label: '', placeholder: 'To', error: !vehiclesData.yearTo && formIsChecked})}
                                />
                            </div>
                        </div>
                    </div>
                    <Autocomplete
                        style={{ width: '50%'}}
                        classes={autoCompleteStyles}
                        disableClearable
                        options={criteriaOptions}
                        disableCloseOnSelect
                        value={vehiclesData?.customerCriteria}
                        onChange={onFormFieldChange('customerCriteria')}
                        renderInput={autocompleteRender({label: 'Customer Criteria'})}
                    />
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