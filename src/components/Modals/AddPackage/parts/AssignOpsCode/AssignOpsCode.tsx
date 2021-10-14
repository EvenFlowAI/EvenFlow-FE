import React, {useCallback, useEffect, SetStateAction, Dispatch} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {DialogProps} from "../../../types";
import {TableRowDataType} from "../../../../UI/types";
import {IServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
import {RootState} from "../../../../../store/rootReducer";
import {Table} from "../../../../UI/Table";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../BaseModal";
import {SearchInput} from "../../../../UI/SearchInput";
import {usePagination, useSCs} from "../../../../../utils/hooks";
import {
    loadNonSelectedServiceRequests,
    setNonSelectedFilter,
    setNonSelectedPageData
} from "../../../../../store/reducers/serviceRequests/actions";

import Checkbox from "../../../../UI/Checkbox";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../UI/AutocompleteRender";
import {TFields} from "../AddOpsCode/AddOpsCode";

type TAssignOpsCodeModalProps = DialogProps & {
    selectedCodes: number[];
    setSelectedCodes: Dispatch<SetStateAction<number[]>>;
    isComplimentary?: boolean;
}

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPS CODE", val: el => el.code},
    {header: "DESCRIPTION", val: el => el.description, width: '80%'},
]

type TStyleProps = {
    isComplimentary: boolean;
}

const useStyles = makeStyles(() => ({
    wrapper: ({ isComplimentary }: TStyleProps) => ({
        display: 'flex',
        justifyContent: isComplimentary ? 'space-between' : 'end',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    }),
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

const AssignOpsCodeModal: React.FC<TAssignOpsCodeModalProps> = (props) => {
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles({isComplimentary: !!props.isComplimentary});
    const [
        serviceList,
        isLoading,
        servicesCount,
        search,
    ] = useSelector((state: RootState) => [
        state.serviceRequests.nonSelectedList,
        state.serviceRequests.nonSelectedLoading,
        state.serviceRequests.nonSelectedPaging.numberOfRecords,
        state.serviceRequests.nonSelectedFilter.searchTerm,
    ]);
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.nonSelectedPageData,
        setNonSelectedPageData
    );

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [props.open, dispatch, selectedSC, pageSize, pageIndex]);

    const handleClose = useCallback((): void => {
        dispatch(setNonSelectedFilter({searchTerm: ''}));
        props.onClose();
    }, [props.onClose, dispatch])

    const handleSelect = useCallback((el: IServiceRequest) => {
        props.setSelectedCodes(prev => {
           return  prev.includes(+el.id) ? prev.filter(item => item !== el.id) : [...prev, el.id]
        });
    }, [props.setSelectedCodes])

    const preActions = useCallback((el: IServiceRequest) => {
        return <Checkbox color="primary" checked={props.selectedCodes.includes(+el.id)} onChange={() => handleSelect(el)} />
    }, [props.selectedCodes, handleSelect])

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNonSelectedFilter({searchTerm: e.target.value}));
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
        delete modalProps.isComplimentary;
        return modalProps;
    }

    return (
        <BaseModal {...getModalProps(props)}>
            <DialogTitle onClose={handleClose}>ASSIGN OPS CODE</DialogTitle>
            <DialogContent>
                <div className={classes.wrapper}>
                    {props.isComplimentary && <div className={classes.filtersWrapper}>
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
                    </div>}
                    <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={search} />
                </div>
                <Table<IServiceRequest>
                    data={serviceList}
                    index="id"
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

export default AssignOpsCodeModal;