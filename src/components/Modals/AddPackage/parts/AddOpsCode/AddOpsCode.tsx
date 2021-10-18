import React, {useCallback, useEffect, SetStateAction, Dispatch} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {DialogProps} from "../../../types";
import {TableRowDataType} from "../../../../UI/types";
import {IAssignedServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
import {RootState} from "../../../../../store/rootReducer";
import {Table} from "../../../../UI/Table";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../BaseModal";
import {SearchInput} from "../../../../UI/SearchInput";
import {usePagination, useSCs} from "../../../../../utils/hooks";
import {
    loadAssignedServiceRequests,
    setAssignedFilter, setAssignedPageData,
} from "../../../../../store/reducers/serviceRequests/actions";

import Checkbox from "../../../../UI/Checkbox";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../UI/AutocompleteRender";

type TAssignOpsCodeModalProps = DialogProps & {
    selectedCodes: IAssignedServiceRequest[];
    setSelectedCodes: Dispatch<SetStateAction<IAssignedServiceRequest[]>>;
}

export type TFields = {
    unitCost: string,
    numberOfParts: string,
}

const tableData: TableRowDataType<IAssignedServiceRequest>[] = [
    {header: "OPS CODE", val: el => el.serviceRequest.code, align: "left"},
    {header: "DESCRIPTION", val: el => el.serviceRequest.description, align: "left"},
    {header: "PARTS UNIT COST", val: el => `$${el.serviceRequestOverride?.partsUnitCost || el.serviceRequest.partsUnitCost}`, align: "left"},
    {header: "# OF PARTS", val: el => `${el.serviceRequestOverride?.numberOfParts || el.serviceRequest.numberOfParts}`, align: "left"},
    {header: "PARTS AMOUNT", val: el => `$${el.serviceRequestOverride?.partsAmount || 0}`, align: "left"},
    {header: "INVOICE AMOUNT", val: el => `$${el.serviceRequestOverride?.invoiceAmount || el.serviceRequest.invoiceAmount}`, align: "left"},
]
const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    subTitle: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20,
        fontSize: 17,
    },
    filtersWrapper: {
        width: '50%',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
    },
    filter: {
        marginRight: 20,
        width: 150,
    }
}))

const AddOpsCodeModal: React.FC<TAssignOpsCodeModalProps> = (props) => {
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [
        serviceList,
        isLoading,
        servicesCount,
        search,
    ] = useSelector((state: RootState) => [
        state.serviceRequests.assignedList,
        state.serviceRequests.assignedLoading,
        state.serviceRequests.assignedPaging.numberOfRecords,
        state.serviceRequests.assignedFilter.searchTerm,
    ]);
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.assignedPageData,
        setAssignedPageData
    );

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [props.open, dispatch, selectedSC, pageSize, pageIndex]);

    const handleClose = useCallback((): void => {
        dispatch(setAssignedFilter({searchTerm: ''}));
        props.onClose();
    }, [props.onClose, dispatch])

    const handleSelect = useCallback((el: IAssignedServiceRequest) => {
        props.setSelectedCodes(prev => {
            return prev.find(item => item.id === el.id) ? prev.filter(item => item.id !== el.id) : [...prev, el]
        });
    }, [props.setSelectedCodes])

    const preActions = useCallback((el: IAssignedServiceRequest) => {
        return <Checkbox
            color="primary"
            checked={!!props.selectedCodes.find(item => item.id === el.id)}
            onChange={() => handleSelect(el)} />
    }, [props.selectedCodes, handleSelect])

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAssignedFilter({searchTerm: e.target.value}));
    }, [dispatch])

    const onFilterChange = useCallback(
        (fieldName: keyof TFields) =>
            (e: React.ChangeEvent<{}>, value: string | null): void => {
                console.log(fieldName, value)
            }, [])

    const getModalProps = (props: TAssignOpsCodeModalProps) => {
        const modalProps = {...props};
        delete modalProps.selectedCodes;
        delete modalProps.setSelectedCodes;
        return modalProps;
    }

    return (
        <BaseModal {...getModalProps(props)} width={1150}>
            <DialogTitle onClose={handleClose}>Add OPS Codes</DialogTitle>
            <DialogContent>
                <div className={classes.wrapper}>
                    <div className={classes.filtersWrapper}>
                        <Autocomplete
                            className={classes.filter}
                            options={['Show all']}
                            defaultValue='Show all'
                            onChange={onFilterChange("unitCost")}
                            renderInput={autocompleteRender({label: "Parts Unit Cost", fullWidth: true})}/>
                        <Autocomplete
                            className={classes.filter}
                            options={['Show all']}
                            defaultValue='Show all'
                            onChange={onFilterChange("numberOfParts")}
                            renderInput={autocompleteRender({label: "# Of Parts", fullWidth: true})}/>
                    </div>
                    <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={search} />
                </div>
                <Table<IAssignedServiceRequest>
                    data={serviceList}
                    index="id"
                    smallHeaderFont
                    startActions={preActions}
                    compact
                    rowData={tableData}
                    isLoading={isLoading}
                    page={pageIndex}
                    rowsPerPage={pageSize}
                    onChangePage={changePage}
                    onChangeRowsPerPage={changeRowsPerPage}
                    count={servicesCount}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default AddOpsCodeModal;