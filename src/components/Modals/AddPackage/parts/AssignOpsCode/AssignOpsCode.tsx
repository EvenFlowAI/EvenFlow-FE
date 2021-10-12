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

type TAssignOpsCodeModalProps = DialogProps & {
    selectedCodes: number[];
    setSelectedCodes: Dispatch<SetStateAction<number[]>>;
}

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPS CODE", val: el => el.code, align: "left"},
    {header: "DESCRIPTION", val: el => el.description, align: "left"},
]
const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'end',
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
    }
}))

const AssignOpsCodeModal: React.FC<TAssignOpsCodeModalProps> = (props) => {
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();
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

    return (
        <BaseModal {...props}>
            <DialogTitle onClose={handleClose}>ASSIGN OPS CODE</DialogTitle>
            <DialogContent>
                <div className={classes.wrapper}>
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