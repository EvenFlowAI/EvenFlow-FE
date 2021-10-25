import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
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
import {useException, useModal, useSCs} from "../../../utils/hooks";
import AssignOpsCode from "./parts/AssignOpsCode/AssignOpsCode";
import AddOpsCode from "./parts/AddOpsCode/AddOpsCode";
import {IAssignedServiceRequest, IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import ExistingPackages from "./parts/ExistingPackages/ExistingPackages";
import {ECustomerCriteria, IPackageByQuery} from "../../../api/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import PackageLabel from "./parts/PackageLabel";
import {createPackage, loadMakes, updatePackage} from "../../../store/reducers/packages/actions";
import Checkbox from "../../UI/Checkbox";
import {INewPackage, IUpdatedPackage, TAssignedRequest} from "../../../store/reducers/packages/types";
import AddComplimentary from "./parts/AddComplimentary/AddComplimentary";
import MakeAndModel from "./parts/MakeAndModel/MakeAndModel";
import {loadAssignedServiceRequests} from "../../../store/reducers/serviceRequests/actions";

type TModalProps = DialogProps & {
    isEditing?: boolean;
};

interface IVehiclesData {
    mileageFrom: string;
    mileageTo: string;
    yearFrom: string;
    yearTo: string;
    customerCriteria: ECustomerCriteria;
    isApplyBusinessRules?: boolean;
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
    redButton: {
        width: '100%',
        color: '#7898FF',
        border: '1px solid red',
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
        marginLeft: -9,
        '& .MuiSvgIcon-root': {
            fill: '#7898FF',
        }
    },
    checkbox: {
        padding: '9px 0',
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
    applyRulesWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 10,
    },
    applyText: {
        marginLeft: 5,
        fontWeight: 'bold',
    }
}))

const useAutocompleteStyles = makeStyles(() => ({
    clearIndicator: {
        width: 0,
    }
}))

const criteriaOptions = Object.keys(ECustomerCriteria).filter(key => Number.isNaN(+key));

const initialValues = {
    mileageFrom: '',
    mileageTo: '',
    yearFrom: '',
    yearTo: '',
    customerCriteria: ECustomerCriteria.Any,
    isApplyBusinessRules: false,
}

const AddPackage: React.FC<TModalProps> = (props) => {
    const { packages, currentPackage } = useSelector((state: RootState) => state.packages);
    const { assignedList } = useSelector((state: RootState) => state.serviceRequests);
    const { selectedSC } = useSCs();

    const [packageName, setPackageName] = useState<string>('');
    const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
    const [opsCodes, setOpsCodes] = useState<IAssignedServiceRequest[]>([]);
    const [assignedOpsCodes, setAssignedOpsCodes] = useState<TAssignedRequest[]>([]);
    const [complimentary, setComplimentary] = useState<number[]>([]);
    const [vehiclesData, setVehiclesData] = useState<IVehiclesData>(initialValues);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [isApplyBusinessRules, setApplyBusinessRules] = useState<boolean>(false);
    const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);

    const {isOpen: isAssignOpsCodeOpen, onOpen: onAssignOpsCodeOpen, onClose: onAssignOpsCodeClose} = useModal();
    const {isOpen: isAddOpsCodeOpen, onOpen: onAddOpsCodeOpen, onClose: onAddOpsCodeClose} = useModal();
    const {isOpen: isComplimentaryOpen, onOpen: onComplimentaryOpen, onClose: onComplimentaryClose} = useModal();
    const {isOpen: isExistingOpen, onOpen: onExistingOpen, onClose: onExistingClose} = useModal();
    const classes = useStyles();
    const autoCompleteStyles = useAutocompleteStyles();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadMakes(selectedSC.id));
            props.isEditing && dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC, props.isEditing])

    useEffect(() => {
        if (props.isEditing && currentPackage) {
            setPackageName(currentPackage.name);
            setComplimentary(currentPackage.complimentaryServices.map(item => item.id));
            setAssignedOpsCodes(currentPackage.serviceRequestsAssigned);
            setApplyBusinessRules(currentPackage.isApplyBusinessRules);
            if (assignedList) {
                setOpsCodes(() => {
                    const selectedServices = currentPackage.serviceRequests.map(item => item.id);
                    return assignedList.filter(item => selectedServices.includes(item.id));
                })
            }
            if (currentPackage.businessRules) {
                setSelectedMakes(currentPackage.businessRules.vehicleMakes);
                setSelectedModels(currentPackage.businessRules.vehicleModels);
                setVehiclesData({
                    mileageFrom: currentPackage.businessRules.vehicleMileageRange?.from?.toString(),
                    mileageTo: currentPackage.businessRules.vehicleMileageRange?.to?.toString(),
                    yearFrom: currentPackage.businessRules.vehicleYearRange?.from?.toString(),
                    yearTo: currentPackage.businessRules.vehicleYearRange?.to?.toString(),
                    customerCriteria: currentPackage.businessRules.customerCriteria,
                    isApplyBusinessRules: currentPackage.isApplyBusinessRules,
                })
            }
        }
    }, [currentPackage, props.isEditing, assignedList])

    const onCancel = useCallback(() => {
        setFormIsChecked(false);
        setVehiclesData(initialValues);
        setPackageName('');
        setSelectedPackages([]);
        setAssignedOpsCodes([]);
        setComplimentary([]);
        setOpsCodes([]);
        setSelectedModels([]);
        setSelectedMakes([]);
        setApplyBusinessRules(false);
        props.onClose();
    }, [initialValues, props.onClose])

    const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setFormIsChecked(false);
        setPackageName(e.target.value);
    }, [])


    const onFormFieldChange = useCallback(
        (fieldName: keyof IVehiclesData) =>
        (e: React.ChangeEvent<{}>, value: string[] | string | null): void => {
            setFormIsChecked(false);
            if (fieldName === 'customerCriteria') {
                // @ts-ignore
                setVehiclesData((prevData: IVehiclesData) => ({...prevData, [fieldName]: ECustomerCriteria[value]}))
            } else {
                setVehiclesData((prevData: IVehiclesData) => ({...prevData, [fieldName]: value}))
            }
    }, [])

    const onDelete = useCallback((serviceRequest: IServiceRequest): void => {
        setFormIsChecked(false);
        setOpsCodes(prev => prev.filter(item => serviceRequest.id !== item.serviceRequest.id));
    }, [])

    const onPackageDelete = useCallback((pack: IPackageByQuery) => {
        setFormIsChecked(false);
        setSelectedPackages(prev => prev.includes(pack.id) ? prev.filter(el => el !== pack.id) : [...prev, pack.id]);
    }, [])

    const onApplyBusinessRulesChange = (e: ChangeEvent<HTMLInputElement>) => setApplyBusinessRules(e.target.checked);

    const getRequestsFromSelectedPackages = useCallback((selectedPackages: number[]): number[] => {
        let serviceRequests = opsCodes.map(item => item.id);
        if (selectedPackages.length) {
            selectedPackages.forEach(id => {
                const packData = packages.find(item => item.id === id);
                if (packData?.serviceRequests) {
                    serviceRequests = serviceRequests.concat(packData.serviceRequests.map(request => request.id))
                }
            })
        }
        return Array.from(new Set(serviceRequests));
    }, [opsCodes, packages])

    const isBusinessRulesValid = () => {
        const { yearFrom, yearTo, mileageFrom, mileageTo } = vehiclesData;
        if (mileageFrom && mileageTo && (+mileageFrom > +mileageTo)) {
            showError('Check the Mileage fields - "To" must be more than "From"')
           return false
        }
        if (yearFrom && yearTo && (+yearFrom > +yearTo)) {
            showError('Check the Vehicle Year fields - "To" must be more than "From"')
            return false
        }
        return selectedModels.length && selectedMakes.length && yearFrom && yearTo && mileageFrom && mileageTo;
    }

    const isValid = () => {
        if (assignedOpsCodes.length < 3) {
            showError('Assign Ops Code for each of the Package`s Options')
            return false;
        } else {
            const mainData = packageName && opsCodes.length && assignedOpsCodes.length;
            const businessRules = isApplyBusinessRules ? isBusinessRulesValid() : true;
            return Boolean(mainData && businessRules);
        }
    }

    const onSave = () => {
        if (isValid()) {
            if (selectedSC) {
                const serviceRequests = getRequestsFromSelectedPackages(selectedPackages);
                const data: INewPackage | IUpdatedPackage = {
                    name: packageName,
                    serviceRequests,
                    complimentaryServices: complimentary,
                    serviceRequestsAssigned: assignedOpsCodes,
                    serviceCenterId: selectedSC.id,
                    isApplyBusinessRules: isApplyBusinessRules,
                }
                if (isApplyBusinessRules && isBusinessRulesValid()) {
                    data.businessRules = {
                        vehicleMakes: selectedMakes,
                            vehicleModels: selectedModels,
                            vehicleYearRange: {
                                from: +vehiclesData.yearFrom,
                                to: +vehiclesData.yearTo
                        },
                        vehicleMileageRange: {
                            from: +vehiclesData.mileageFrom,
                                to: +vehiclesData.mileageTo,
                        },
                        customerCriteria: vehiclesData.customerCriteria,
                    }
                } else {
                    if (props.isEditing) data.businessRules = currentPackage?.businessRules;
                }
                props.isEditing && currentPackage
                    ? dispatch(updatePackage(currentPackage.id, data, onCancel))
                    : dispatch(createPackage(selectedSC.id, data, onCancel))
            }
        } else setFormIsChecked(true);
    }

    const checkIsErrorField = (fieldName: string, vehiclesData: IVehiclesData) => {
        let isError = false;
        if (fieldName.includes('mileage') && vehiclesData?.mileageFrom && vehiclesData?.mileageTo) {
            isError = vehiclesData?.mileageFrom > vehiclesData?.mileageTo
        }
        if (fieldName.includes('year') && vehiclesData?.yearFrom && vehiclesData?.yearTo) {
            isError = vehiclesData?.yearFrom > vehiclesData?.yearTo
        }
        return isApplyBusinessRules && formIsChecked && isError;
    }

    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>{props.isEditing ? 'Edit': 'Add'} Maintenance Package</DialogTitle>
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
                        return pack ? <PackageLabel pack={pack} onDelete={onPackageDelete} key={pack.name}/> : null
                    })}

                    <div className={classes.addExisting}>
                        <IconButton onClick={onExistingOpen} className={classes.iconPlus}>
                            <AddCircleOutline/>
                        </IconButton>
                        <span> Add New Existing Maintenance Package</span>
                    </div>

                    <Button
                        className={formIsChecked && assignedOpsCodes.length < 3 ? classes.redButton : classes.wideButton}
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
                            ? opsCodes.map(item => <OpsCode serviceRequest={item.serviceRequest} onDelete={onDelete} key={item.serviceRequest.id}/>)
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

                    <div className={classes.applyRulesWrapper}>
                        <Checkbox
                            className={classes.checkbox}
                            color="primary"
                            checked={isApplyBusinessRules}
                            onChange={onApplyBusinessRulesChange}
                        />
                        <span className={classes.applyText}>Apply Business Rules To Package</span>
                    </div>

                    <MakeAndModel
                        selectedMakes={selectedMakes}
                        selectedModels={selectedModels}
                        setSelectedMakes={setSelectedMakes}
                        setSelectedModels={setSelectedModels}
                        setFormIsChecked={setFormIsChecked}
                        disabled={!isApplyBusinessRules}
                        formIsChecked={formIsChecked}
                        isApplyBusinessRules={isApplyBusinessRules}
                    />

                    <div className={classes.formWrapper} style={{ marginBottom: 16}}>
                        <div style={{ width: '47%'}}>
                            <div className={classes.label}>Mileage</div>
                            <div className={classes.twoFieldsWrapper}>
                                <Autocomplete
                                    disabled={!isApplyBusinessRules}
                                    classes={autoCompleteStyles}
                                    options={mileageOptions}
                                    disableCloseOnSelect
                                    disableClearable
                                    getOptionSelected={(option, value) => option === value}
                                    value={vehiclesData?.mileageFrom}
                                    onChange={onFormFieldChange('mileageFrom')}
                                    renderInput={autocompleteRender({
                                        label: "",
                                        placeholder: 'From',
                                        error: !vehiclesData.mileageFrom && isApplyBusinessRules && formIsChecked || checkIsErrorField('mileage', vehiclesData)
                                    })}
                                />
                                <Autocomplete
                                    disabled={!isApplyBusinessRules}
                                    classes={autoCompleteStyles}
                                    options={mileageOptions}
                                    disableCloseOnSelect
                                    disableClearable
                                    getOptionSelected={(option, value) => option === value}
                                    value={vehiclesData?.mileageTo}
                                    onChange={onFormFieldChange('mileageTo')}
                                    renderInput={autocompleteRender({
                                        label: '',
                                        placeholder: 'To',
                                        error: !vehiclesData.mileageTo && isApplyBusinessRules && formIsChecked || checkIsErrorField('mileage', vehiclesData)
                                    })}
                                />
                            </div>
                        </div>
                        <div style={{ width: '47%'}}>
                            <div className={classes.label}>Vehicle Year</div>
                            <div className={classes.twoFieldsWrapper}>
                                <Autocomplete
                                    disabled={!isApplyBusinessRules}
                                    classes={autoCompleteStyles}
                                    disableClearable
                                    options={yearOptions}
                                    disableCloseOnSelect
                                    getOptionSelected={(option, value) => option === value}
                                    value={vehiclesData?.yearFrom}
                                    onChange={onFormFieldChange('yearFrom')}
                                    renderInput={autocompleteRender({
                                        label: '',
                                        placeholder: 'From',
                                        error: !vehiclesData.yearFrom && isApplyBusinessRules && formIsChecked || checkIsErrorField('year', vehiclesData)
                                    })}
                                />
                                <Autocomplete
                                    disabled={!isApplyBusinessRules}
                                    classes={autoCompleteStyles}
                                    options={yearOptions}
                                    disableClearable
                                    disableCloseOnSelect
                                    getOptionSelected={(option, value) => option === value}
                                    value={vehiclesData?.yearTo}
                                    onChange={onFormFieldChange('yearTo')}
                                    renderInput={autocompleteRender({
                                        label: '',
                                        placeholder: 'To',
                                        error: !vehiclesData.yearTo && isApplyBusinessRules && formIsChecked || checkIsErrorField('year', vehiclesData)
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                    <Autocomplete
                        style={{ width: '50%'}}
                        classes={autoCompleteStyles}
                        disableClearable
                        options={criteriaOptions}
                        getOptionSelected={(option, value) => option === ECustomerCriteria[+value]}
                        disabled={!isApplyBusinessRules}
                        value={vehiclesData?.customerCriteria ? ECustomerCriteria[vehiclesData.customerCriteria].toString() : ECustomerCriteria[0]}
                        onChange={onFormFieldChange('customerCriteria')}
                        renderInput={autocompleteRender({label: 'Customer Criteria', placeholder: 'Select Customer Criteria'})}
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
                title="ASSIGN OPS CODE"
                open={isAssignOpsCodeOpen}
                onClose={onAssignOpsCodeClose}
                selectedCodes={assignedOpsCodes}
                isEditing={props.isEditing}
                setSelectedCodes={setAssignedOpsCodes}/>
            <AddComplimentary
                title="Add Complimentary"
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