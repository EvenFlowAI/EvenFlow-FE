import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {
    EServiceCategoryType,
    ICategory,
    TNewCategory,
    TUpdateCategoryData
} from "../../../store/reducers/categories/types";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Divider, FormControlLabel, Radio, RadioGroup, Switch, withStyles} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {SearchInput} from "../../UI/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {loadAllAssignedServiceRequests, setAssignedFilter,} from "../../../store/reducers/serviceRequests/actions";
import {useException, useSCs} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {createCategory, updateCategory, updateCategoryIcon} from "../../../store/reducers/categories/actions";
import OpsCodesTable from "./OpsCodesTable";
import FileInput from "./FileInput";
import {loadBookingFlowConfig} from "../../../store/reducers/bookingFlowConfig/actions";
import {EServiceTypeBookingFlow} from "../../../store/reducers/bookingFlowConfig/types";

type TAddServiceCategoryProps = DialogProps & {
    editingItem: ICategory | null;
}

const useStyles = makeStyles(() => ({
    inputsWrapper: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridGap: 18,
        marginBottom: 18,
    },
    uploadBtn: {
        width: '100%',
        textTransform: 'none',
        padding: 10,
        border: 'none',
        borderRadius: 4,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: '#7898FF',
        cursor: 'pointer',
    },
    label: {
        textTransform: "uppercase",
        fontWeight: 'bold',
        marginBottom: 4,
        fontSize: 12,
    },
    buttonWrapper: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'stretch',
    },
    inputWrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    cancelButton: {
        color: '#9FA2B4'
    },
    radioGroup: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
}))

type TOption = {
    value: number;
    name: string;
}

const pageOptions = [{name: 'Owned By Booking Flow (Page 1)', value: 0}, {name: 'Owned By Booking Flow (Page 2)', value: 1}];

const categoryOptions = Object.keys(EServiceCategoryType)
    .filter(item => Number.isNaN(+item))
    // @ts-ignore
    .map(item => ({name: item, value: EServiceCategoryType[item]}));

export interface IIconState {
    file: File | null;
    dataUrl?: string;
}

const Label = withStyles({
    root: {
        justifyContent: "flex-end",
        marginLeft: 0,
        marginRight: 0,
    },
    label: {
        fontWeight: "bold",
        fontSize: 12,
        textTransform: "uppercase",
        //transform: "translate(0, 1.5px) scale(0.75)",
    }
})(FormControlLabel);

const getOptionLabel = (option: TOption) => {
    const array = [];
    for (let i = 0; i < option.name.length; i++) {
        if (option.name[i] === option.name[i].toUpperCase() && i > 0) {
            array.push(' ');
        }
        array.push(option.name[i]);
    }
    return array.join('');
}
const initialFileState = {file: null, dataUrl: undefined};

const AddServiceCategory: React.FC<TAddServiceCategoryProps> = ({editingItem, ...props}) => {
    const {allAssignedList, assignedFilter} = useSelector((state: RootState) => state.serviceRequests);
    const {categories} = useSelector((state: RootState) => state.categories);
    const {page} = useSelector((state: RootState) => state.categories);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const [fileState, setFileState] = useState<IIconState>(initialFileState);
    const [categoryName, setCategoryName] = useState<string>('');
    const [definedPage, setDefinedPage] = useState<TOption | null>(null);
    const [categoryType, setCategoryType] = useState<TOption | null>(null);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [selectedCodes, setSelectedCodes] = useState<IAssignedServiceRequest[]>([]);
    const [orderIndex, setOrderIndex] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedServiceType, setSelectedServiceType] = useState<EServiceTypeBookingFlow>(EServiceTypeBookingFlow.VisitCenter)
    const [commentIsRequired, setCommentIsRequired] = useState<boolean>(false);

    const disabledOpsCodes = useMemo(() => categoryType?.value === EServiceCategoryType.MaintenancePackage
        || categoryType?.value === EServiceCategoryType.LinkToPage2
        || categoryType?.value === EServiceCategoryType.ValueService, [categoryType])
    // todo for Mobile service when it will be separate logic
    const visitCenterConfig = useMemo(() => config.find(item => item.serviceType === EServiceTypeBookingFlow.VisitCenter), [config])

    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();

    const getCategoryOptions = () => selectedSC?.isValueServiceAvailable
        ? categoryOptions
        : categoryOptions.slice(0, categoryOptions.length - 1);

    useEffect(() => {
        props.open && selectedSC && dispatch(loadAllAssignedServiceRequests(selectedSC.id))
        const currentPageOption = pageOptions.find(item => item.value === page);
        currentPageOption && setDefinedPage(currentPageOption);
    }, [selectedSC, page, pageOptions, props.open])

    useEffect(() => {
        if (editingItem && allAssignedList && props.open) {
            setCategoryName(editingItem.name);

            const page = pageOptions.find(option => option.value === +editingItem.page);
            page && setDefinedPage(page);

            setSelectedCodes(allAssignedList.filter(item => editingItem.serviceRequests.find(el => el.id === item.id)));

            const currentType = categoryOptions.find(item => item.value === +editingItem.type);
            currentType && setCategoryType(currentType)

            if (editingItem.orderIndex) setOrderIndex(editingItem.orderIndex.toString())
            if (editingItem.description) setDescription(editingItem.description);
            if (editingItem.commentIsRequired) setCommentIsRequired(editingItem.commentIsRequired);
        }
    }, [editingItem, allAssignedList, categoryOptions, props.open])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadBookingFlowConfig(selectedSC.id))
        }
    }, [dispatch, selectedSC]);

    const onCancel = useCallback(() => {
        setFormIsChecked(false);
        setCategoryName('');
        dispatch(setAssignedFilter({searchTerm: ''}));
        setFileState(initialFileState);
        setSelectedCodes([]);
        setCategoryType(null);
        setOrderIndex('');
        setDescription('')
        props.onClose();
    }, [])

    const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value)
    }

    const onSuccessCreate = useCallback((categoryId: number) => {
        if (fileState.file) dispatch(updateCategoryIcon(categoryId, fileState.file));
    }, [fileState])

    const onSave = useCallback(() => {
        if (selectedSC) {
            setFormIsChecked(true);
            if (categoryType?.value === EServiceCategoryType.ValueService && !visitCenterConfig?.valueService) {
                return showError("Value Service Option is turned off in the Booking Flow and cannot be saved")
            }

            if (categoryName && definedPage && categoryType && orderIndex) {
                const data: TUpdateCategoryData = {
                    name: categoryName,
                    page: definedPage.value,
                    type: categoryType.value,
                    serviceRequests: [],
                    orderIndex: Number(orderIndex),
                    commentIsRequired: categoryType.value === EServiceCategoryType.GeneralCategory ? commentIsRequired : false,
                    // todo uncomment and add in the TUpdateCategoryData field for service type
                    //serviceType,
                }
                if (description) data.description = description;
                if (categoryType.value !== EServiceCategoryType.MaintenancePackage
                    && categoryType.value !== EServiceCategoryType.LinkToPage2
                    && categoryType.value !== EServiceCategoryType.ValueService) {
                    if (selectedCodes.length) {
                        data.serviceRequests = selectedCodes.map(item => item.id);
                    } else {
                        return showError('Please choose service requests for category')
                    }
                }
                if (editingItem) {
                    dispatch(updateCategory(editingItem.id, data));
                    if (fileState.file) dispatch(updateCategoryIcon(editingItem.id, fileState.file));
                } else {
                    const newData: TNewCategory = {...data, serviceCenterId: selectedSC.id};
                    dispatch(createCategory(newData, onSuccessCreate));
                }
                onCancel();
            }
        }
    }, [selectedSC, categoryName, definedPage, categoryType, orderIndex, selectedCodes, editingItem, fileState, visitCenterConfig, description])

    const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setFormIsChecked(false);
        setCategoryName(e.target.value);
    }, [])

    const onDefinedPageChange = useCallback((e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setFormIsChecked(false);
        setDefinedPage(value);
    }, [])

    const onOrderIndexChange = useCallback((e: React.ChangeEvent<{}>, value: string): void => {
        setFormIsChecked(false);
        setOrderIndex(value);
    }, [])

    const onCategoryTypeChange = useCallback((e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setFormIsChecked(false);
        setCategoryType(value);
        setSelectedCodes([]);
    }, [])

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadAllAssignedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAssignedFilter({searchTerm: e.target.value}));
    }, [dispatch])

    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setSelectedServiceType(e.target.value === '0' ? EServiceTypeBookingFlow.VisitCenter : EServiceTypeBookingFlow.MobileService);
    }

    const handleSwitch = (e: any, value: boolean) => {
        setCommentIsRequired(value);
    }

    return (
        <BaseModal {...props} width={1128} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>{editingItem ? 'Edit': 'Add'} Service Category</DialogTitle>
            <DialogContent>
                <RadioGroup
                    row
                    aria-label="countType"
                    name="countType"
                    value={selectedServiceType}
                    onChange={handleTypeChange}
                    className={classes.radioGroup}
                >
                    <FormControlLabel
                        value={EServiceTypeBookingFlow.VisitCenter}
                        control={<Radio color="primary"/>}
                        label="VISIT CENTER"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value={EServiceTypeBookingFlow.MobileService}
                        control={<Radio color="primary"/>}
                        label="MOBILE SERVICE"
                        labelPlacement="end"
                    />
                </RadioGroup>
                <div className={classes.inputsWrapper}>
                    <div>
                        <TextField
                            fullWidth
                            label='Service Category Name'
                            placeholder='Type Service Category Name'
                            error={!categoryName && formIsChecked}
                            onChange={onNameChange}
                            value={categoryName}/>
                    </div>
                    <Autocomplete
                        options={pageOptions}
                        getOptionSelected={(option) => option.value === definedPage?.value}
                        getOptionLabel={option => option.name}
                        value={definedPage}
                        onChange={onDefinedPageChange}
                        renderInput={autocompleteRender({
                            label: 'Define Page',
                            placeholder: 'Select a page',
                        })}
                    />
                    <FileInput setState={setFileState} label={`${fileState.file || editingItem?.iconPath ? 'Update' : 'Upload' } Service Category Icon`}/>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Add Ops Codes</label>
                        <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={assignedFilter.searchTerm} />
                    </div>
                    <Autocomplete
                        options={getCategoryOptions()}
                        getOptionSelected={(option) => option.value === categoryType?.value}
                        getOptionLabel={getOptionLabel}
                        value={categoryType}
                        onChange={onCategoryTypeChange}
                        renderInput={autocompleteRender({
                            label: 'Link for Booking Flow',
                            placeholder: 'Select Link To Screen On Booking Flow',
                            error: !categoryType && formIsChecked,
                        })}
                    />
                    <Autocomplete
                        disableClearable
                        options={categories.map((el, index) => `${index + 1}`).concat(`${categories.length + 1}`)}
                        value={orderIndex}
                        onChange={onOrderIndexChange}
                        renderInput={autocompleteRender({
                            label: 'Order Index for Booking Flow',
                            placeholder: 'Select Order Index',
                            error: !orderIndex && formIsChecked,
                        })}
                    />
                    <Label
                        control={<Switch
                            disabled={!categoryType || categoryType?.value !== EServiceCategoryType.GeneralCategory}
                            onChange={handleSwitch}
                            checked={commentIsRequired}
                            color="primary"
                        />}
                        label="Comment Field Is Required"
                        labelPlacement="start"
                    />
                </div>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    label="Service Category Description"
                    placeholder="Enter Description"
                    onChange={onDescriptionChange}
                />
                <Divider/>
                <OpsCodesTable
                    selectedCodes={selectedCodes}
                    setSelectedCodes={setSelectedCodes}
                    disabled={disabledOpsCodes}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} className={classes.cancelButton}>
                    Cancel
                </Button>
                <Button onClick={onSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default AddServiceCategory;