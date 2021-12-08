import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {
    EServiceCategoryType,
    ICategory,
    TNewCategory,
    TUpdateCategoryData
} from "../../../store/reducers/categories/types";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Divider} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {SearchInput} from "../../UI/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {loadAllAssignedServiceRequests, setAssignedFilter,} from "../../../store/reducers/serviceRequests/actions";
import {useException, useSCs} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {
    createCategory,
    updateCategory,
    updateCategoryIcon
} from "../../../store/reducers/categories/actions";
import OpsCodesTable from "./OpsCodesTable";
import FileInput from "./FileInput";

type TAddServiceCategoryProps = DialogProps & {
    isEditing?: boolean;
    editingItem: ICategory | null;
}

const useStyles = makeStyles(() => ({
    inputsWrapper: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridGap: 18,
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
    const { allAssignedList, assignedFilter } = useSelector((state: RootState) => state.serviceRequests);
    const { page } = useSelector((state: RootState) => state.categories);
    const [fileState, setFileState] = useState<IIconState>(initialFileState);
    const [categoryName, setCategoryName] = useState<string>('');
    const [definedPage, setDefinedPage] = useState<TOption | null>(null);
    const [categoryType, setCategoryType] = useState<TOption | null>(null);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [selectedCodes, setSelectedCodes] = useState<IAssignedServiceRequest[]>([]);

    const classes = useStyles();
    const { selectedSC } = useSCs();
    const dispatch = useDispatch();
    const showError = useException();

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
        }
    }, [editingItem, allAssignedList, categoryOptions, props.open])

    const onCancel = () => {
        setFormIsChecked(false);
        setCategoryName('');
        dispatch(setAssignedFilter({searchTerm: ''}));
        setFileState(initialFileState);
        setSelectedCodes([]);
        setCategoryType(null);
        props.onClose();
    }

    const onSuccessCreate = (categoryId: number) => {
        if (fileState.file) dispatch(updateCategoryIcon(categoryId, fileState.file));
    }

    const onSave = () => {
        if (selectedSC) {
            setFormIsChecked(true);
            if (categoryName && definedPage && categoryType) {
                const data: TUpdateCategoryData = {
                    name: categoryName,
                    page: definedPage.value,
                    type: categoryType.value,
                    serviceRequests: [],
                }
                if (categoryType.value !== EServiceCategoryType.MaintenancePackage && categoryType.value !== EServiceCategoryType.LinkToPage2) {
                    if (selectedCodes.length) {
                        data.serviceRequests = selectedCodes.map(item => item.id);
                    } else {
                        return showError('Please choose service requests for category')
                    }
                }
                if (editingItem) {
                    dispatch(updateCategory(editingItem.id, data));
                    if (fileState.file) dispatch(updateCategoryIcon(editingItem.id, fileState.file));
                }
                else {
                    const newData: TNewCategory = {...data, serviceCenterId: selectedSC.id};
                    dispatch(createCategory(newData, onSuccessCreate));
                }
                onCancel();
            }
        }
    }

    const onNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setFormIsChecked(false);
        setCategoryName(e.target.value);
    }, [])

    const onDefinedPageChange = (e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setFormIsChecked(false);
        setDefinedPage(value);
    }

    const onCategoryTypeChange = (e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setFormIsChecked(false);
        setCategoryType(value);
        setSelectedCodes([]);
    }

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadAllAssignedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAssignedFilter({searchTerm: e.target.value}));
    }, [dispatch])


    return (
        <BaseModal {...props} width={1128} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>{props.isEditing ? 'Edit': 'Add'} Service Category</DialogTitle>
            <DialogContent>
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
                        disableClearable
                        options={pageOptions}
                        getOptionSelected={(option) => option.value === definedPage?.value}
                        getOptionLabel={option => option.name}
                        value={definedPage || undefined}
                        onChange={onDefinedPageChange}
                        renderInput={autocompleteRender({
                            label: 'Define Page',
                            placeholder: 'Select a page',
                        })}
                    />
                    <FileInput setState={setFileState}/>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Add ops Codes</label>
                        <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={assignedFilter.searchTerm} />
                    </div>
                    <Autocomplete
                        disableClearable
                        options={categoryOptions}
                        getOptionSelected={(option) => option.value === categoryType?.value}
                        getOptionLabel={getOptionLabel}
                        value={categoryType || undefined}
                        onChange={onCategoryTypeChange}
                        renderInput={autocompleteRender({
                            label: 'Link for Booking Flow',
                            placeholder: 'Select Link To Screen On Booking Flow',
                            error: !categoryType && formIsChecked,
                        })}
                    />
                </div>
                <Divider/>
                <OpsCodesTable
                    selectedCodes={selectedCodes}
                    setSelectedCodes={setSelectedCodes}
                    disabled={categoryType?.value === EServiceCategoryType.MaintenancePackage
                    || categoryType?.value === EServiceCategoryType.LinkToPage2}/>
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