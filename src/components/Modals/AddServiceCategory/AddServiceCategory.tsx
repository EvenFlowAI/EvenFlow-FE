import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@material-ui/icons";
import {DialogProps} from "../types";
import {ICategory, TNewCategory, TUpdateCategoryData} from "../../../store/reducers/categories/types";
import {makeStyles} from "@material-ui/core/styles";
import {Divider, Button} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {SearchInput} from "../../UI/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {
    loadAllAssignedServiceRequests, loadAssignedServiceRequests, setAssignedFilter,
} from "../../../store/reducers/serviceRequests/actions";
import {useSCs} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataType} from "../../UI/types";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import Checkbox from "../../UI/Checkbox";
import {Table} from "../../UI/Table";
import {createCategory, updateCategory} from "../../../store/reducers/categories/actions";

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
        textTransform: 'none'
    },
    scrollableTable: {
        maxHeight: 300,
        overflowY: 'auto',
        marginBottom: 20,
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
    }
}))

type TOption = {
    value: number;
    name: string;
}

const pageOptions = [{name: 'Owned By Booking Flow (Page 1)', value: 0}, {name: 'Owned By Booking Flow (Page 2)', value: 1}];

const RowData: TableRowDataType<IAssignedServiceRequest>[] = [
    {
        header: "OPS CODE",
        val: el => el.serviceRequest.code
    },
    {
        header: "DESCRIPTION",
        val: el => el.serviceRequestOverride?.description?.length ?  el.serviceRequestOverride.description : el.serviceRequest.description
    },
    {
        header: "PARTS UNIT COST",
        align: "center",
        val: el => `$${el.serviceRequestOverride?.partsUnitCost ?? el.serviceRequest.partsUnitCost}`
    },
    {
        header: "# Of PARTS",
        align: "center",
        val: el => `${el.serviceRequestOverride?.numberOfParts ?? el.serviceRequest.numberOfParts}`
    },
    {
        header: "PARTS AMOUNT",
        align: "center",
        val: el => `$${el.serviceRequestOverride?.partsAmount ?? 0}`
    },
    {
        header: "INVOICE AMOUNT",
        align: "center",
        val: el => `$${el.serviceRequestOverride?.invoiceAmount ?? el.serviceRequest.invoiceAmount}`
    },
]

const AddServiceCategory: React.FC<TAddServiceCategoryProps> = ({editingItem, ...props}) => {
    const { allAssignedList, assignedFilter, assignedLoading } = useSelector((state: RootState) => state.serviceRequests);
    const [categoryName, setCategoryName] = useState<string>('');
    const [definedPage, setDefinedPage] = useState<TOption | null>(null);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [selectedCodes, setSelectedCodes] = useState<IAssignedServiceRequest[]>([]);
    const classes = useStyles();
    const { selectedSC } = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        selectedSC && dispatch(loadAllAssignedServiceRequests(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        if (editingItem && allAssignedList) {
            setCategoryName(editingItem.name);
            const page = pageOptions.find(option => option.value === +editingItem.page);
            page && setDefinedPage(page);
            setSelectedCodes(allAssignedList.filter(item => editingItem.serviceRequests.find(el => el.id === item.id)));
        }
    }, [editingItem, allAssignedList])

    const onCancel = () => {
        setFormIsChecked(false);
        setCategoryName('');
        dispatch(setAssignedFilter({searchTerm: ''}));
        props.onClose();
    }

    const onSave = () => {
        if (selectedSC) {
            setFormIsChecked(true);
            if (categoryName && selectedCodes.length && definedPage) {
                const data: TUpdateCategoryData = {
                    name: categoryName,
                    serviceRequests: selectedCodes.map(item => item.id),
                    page: definedPage.value
                }
                if (editingItem) {
                    dispatch(updateCategory(editingItem.id, data));
                }
                else {
                    const newData: TNewCategory = {...data, serviceCenterId: selectedSC.id};
                    dispatch(createCategory(newData));
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

    const handleSelect = useCallback((el: IAssignedServiceRequest) => {
        setSelectedCodes(prev => {
            return prev.find(item => item.id === el.id) ? prev.filter(item => item.id !== el.id) : [...prev, el]
        });
    }, [setSelectedCodes])

    const preActions = useCallback((el: IAssignedServiceRequest) => {
        return <Checkbox
            color="primary"
            icon={ !!selectedCodes.find(item => item.id === el.id)
                ? <CheckBoxOutlined htmlColor="#3855FE"/>
                : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
            checked={!!selectedCodes.find(item => item.id === el.id)}
            onChange={() => handleSelect(el)} />
    }, [selectedCodes, handleSelect])

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAssignedFilter({searchTerm: e.target.value}));
    }, [dispatch])

    const onUploadClick = () => {}

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
                        disableCloseOnSelect
                        getOptionSelected={(option) => option.value === definedPage?.value}
                        getOptionLabel={option => option.name}
                        value={definedPage || undefined}
                        onChange={onDefinedPageChange}
                        renderInput={autocompleteRender({
                            label: 'Define Page',
                            placeholder: 'Select a page',
                        })}
                    />
                    <div className={classes.buttonWrapper}>
                        <Button className={classes.uploadBtn} onClick={onUploadClick} color="primary" variant="contained">
                            Upload Service Category Icon
                        </Button>
                    </div>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Add ops Codes</label>
                        <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={assignedFilter.searchTerm} />
                    </div>
                </div>
                <Divider/>
                <div className={classes.scrollableTable}>
                    <Table<IAssignedServiceRequest>
                        data={allAssignedList}
                        index="id"
                        smallHeaderFont
                        startActions={preActions}
                        hidePagination
                        compact
                        rowData={RowData}
                        isLoading={assignedLoading}
                        count={allAssignedList.length}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    Close
                </Button>
                <Button onClick={onSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default AddServiceCategory;