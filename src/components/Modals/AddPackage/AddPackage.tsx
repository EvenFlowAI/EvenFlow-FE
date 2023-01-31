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
import {yearOptions} from "../../AppointmentFlow/AppointmentFrame/MaintenanceDetails";
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
import {
    loadAllAssignedServiceRequests,
} from "../../../store/reducers/serviceRequests/actions";
import {loadEngineType, loadMileage} from "../../../store/reducers/vehicleDetails/actions";
import Mileage from "./parts/Mileage/Mileage";
import AssignedOpsCodes from "./parts/AssignedOpsCodes/AssignedOpsCodes";
import {IEngineType} from "../../../store/reducers/vehicleDetails/types";


type TModalProps = DialogProps & {
    isEditing?: boolean;
};

interface IVehiclesData {
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

const AddPackage: React.FC<TModalProps> = ({ isEditing, ...props}) => {
    const { packages, currentPackage, isPackageLoading } = useSelector((state: RootState) => state.packages);
    const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
    const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails);
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
    const [selectedMileages, setSelectedMileages] = useState<string[]>([]);
    const [optionError, setOptionError] = useState<boolean>(false);
    const [engineType, setEngineType] = useState<IEngineType|null>(null);

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
            dispatch(loadMileage(selectedSC.id))
            dispatch(loadEngineType(selectedSC.id))
            isEditing && dispatch(loadAllAssignedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC, isEditing])

    useEffect(() => {
        if (isEditing && currentPackage) {
            setPackageName(currentPackage.name);
            setComplimentary(currentPackage.complimentaryServices.map(item => item.id));
            setAssignedOpsCodes(currentPackage.serviceRequestsAssigned);
            setApplyBusinessRules(currentPackage.isApplyBusinessRules);
            if (allAssignedList) {
                setOpsCodes(() => {
                    const selectedServices = currentPackage.serviceRequests.map(item => item.id);
                    return allAssignedList.filter(item => selectedServices.includes(item.id));
                })
            }
            if (currentPackage.businessRules) {
                setSelectedMakes(currentPackage.businessRules.vehicleMakes);
                setSelectedModels(currentPackage.businessRules.vehicleModels);
                setSelectedMileages(currentPackage.businessRules.vehicleMileageValues.map(item => item.toString()));
                setVehiclesData({
                    yearFrom: currentPackage.businessRules.vehicleYearRange?.from?.toString(),
                    yearTo: currentPackage.businessRules.vehicleYearRange?.to?.toString(),
                    customerCriteria: currentPackage.businessRules.customerCriteria,
                    isApplyBusinessRules: currentPackage.isApplyBusinessRules,
                })
                if (currentPackage.businessRules.engineTypeId) {
                    const engineData = engineTypes.find(item => item.id === currentPackage.businessRules.engineTypeId)
                    engineData && setEngineType(engineData);
                }
            }
        }
    }, [currentPackage, isEditing, allAssignedList])

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
        setSelectedMileages([]);
        setEngineType(null);
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

    const onEngineTypeChange = (e: React.ChangeEvent<{}>, value: IEngineType|null) => {
        setFormIsChecked(false);
        setEngineType(value);
    }

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
        const { yearFrom, yearTo } = vehiclesData;
        if (yearFrom && yearTo && (+yearFrom > +yearTo)) {
            showError('"From" must be less than or equal to "To"')
            return false
        }
        const atLeastOneRule = selectedModels.length
            || selectedMakes.length
            || selectedMileages.length
            || (yearFrom && yearTo)
            || engineType
        if (!atLeastOneRule) showError('At least one Business Rule is required')
        return atLeastOneRule;
    }

    const isValid = () => {
        if (assignedOpsCodes.length < 3) {
            setOptionError(true);
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
                        vehicleMileageValues: selectedMileages,
                        customerCriteria: vehiclesData.customerCriteria,
                        engineTypeId: engineType?.id ?? null,
                    }
                } else {
                    if (isEditing) data.businessRules = currentPackage?.businessRules;
                }
                try {
                    isEditing && currentPackage
                        ? dispatch(updatePackage(currentPackage.id, data, selectedSC.id, onCancel, (e) => showError(e)))
                        : dispatch(createPackage(selectedSC.id, data, onCancel, (e) => showError(e)))
                } catch (e) {
                }
            }
        } else setFormIsChecked(true);
    }

    const handleOpsCodeSelect = useCallback((el: IAssignedServiceRequest) => {
        setOpsCodes(prev => {
            return prev.find(item => item.id === el.id) ? prev.filter(item => item.id !== el.id) : [...prev, el]
        });
    }, [setOpsCodes])

    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>{isEditing ? 'Edit': 'Add'} Maintenance Package</DialogTitle>
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
                        <span> Add Existing Maintenance Package</span>
                    </div>

                    <div className={classes.label}>Assigned Ops Codes</div>
                    <div className={assignedOpsCodes?.length
                        ? classes.opsCodesWrapper
                        : formIsChecked
                            ? assignedOpsCodes?.length < 3
                                ? classes.errorOpsCodes
                                : classes.emptyOpsCodes
                            : classes.emptyOpsCodes
                    }>
                    { assignedOpsCodes?.length
                        ? <AssignedOpsCodes codes={assignedOpsCodes}/>
                        : <p>There are no Ops Codes in this list yet</p>
                    }
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
                            : <p>There are no Ops Codes in this list yet</p>
                        }
                    </div>

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
                    <Mileage
                        disabled={!isApplyBusinessRules}
                        selectedMileages={selectedMileages}
                        isApplyBusinessRules={isApplyBusinessRules}
                        formIsChecked={formIsChecked}
                        setFormIsChecked={setFormIsChecked}
                        setSelectedMileages={setSelectedMileages}
                    />
                    <div style={{ marginBottom: 16}}>
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
                                    // error: !vehiclesData.yearFrom && isApplyBusinessRules && formIsChecked || checkIsErrorField('year', vehiclesData)
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
                                    // error: !vehiclesData.yearTo && isApplyBusinessRules && formIsChecked || checkIsErrorField('year', vehiclesData)
                                })}
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: 16}}>
                        <div className={classes.twoFieldsWrapper}>
                            <Autocomplete
                                classes={autoCompleteStyles}
                                disableClearable
                                options={criteriaOptions}
                                getOptionSelected={(option, value) => option === ECustomerCriteria[+value]}
                                disabled={!isApplyBusinessRules}
                                value={vehiclesData?.customerCriteria ? ECustomerCriteria[vehiclesData.customerCriteria].toString() : ECustomerCriteria[0]}
                                onChange={onFormFieldChange('customerCriteria')}
                                renderInput={autocompleteRender({label: 'Customer Criteria', placeholder: 'Select Customer Criteria'})}
                            />
                            <Autocomplete
                                classes={autoCompleteStyles}
                                options={engineTypes}
                                getOptionSelected={(option, value) => option.id === value.id}
                                getOptionLabel={(option) => option.name}
                                disabled={!isApplyBusinessRules}
                                value={engineType}
                                onChange={onEngineTypeChange}
                                renderInput={autocompleteRender({label: 'Engine Type', placeholder: 'Select Engine Type'})}
                            />
                        </div>
                    </div>
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
                            disabled={isPackageLoading}
                            className={classes.saveButton}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>

            <AssignOpsCode
                title="ASSIGN OPS CODES TO MAINTENANCE PACKAGE OPTIONS"
                open={isAssignOpsCodeOpen}
                optionError={optionError}
                setOptionError={setOptionError}
                onClose={onAssignOpsCodeClose}
                selectedCodes={assignedOpsCodes}
                isEditing={isEditing}
                setSelectedCodes={setAssignedOpsCodes}/>
            <AddComplimentary
                title="Add Complimentary"
                open={isComplimentaryOpen}
                onClose={onComplimentaryClose}
                selectedCodes={complimentary}
                setSelectedCodes={setComplimentary}/>
            <AddOpsCode
                handleSelect={handleOpsCodeSelect}
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