import React, {useCallback, useEffect, SetStateAction, Dispatch} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {DialogProps} from "../../../types";
import {TableRowDataType} from "../../../../UI/types";
import {IUpsellServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
import {RootState} from "../../../../../store/rootReducer";
import {Table} from "../../../../UI/Table";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../BaseModal";
import {SearchInput} from "../../../../UI/SearchInput";
import {usePagination, useSCs} from "../../../../../utils/hooks";
import {
    loadUpsellServiceRequests, setUpsellFilter, setUpsellPageData,
} from "../../../../../store/reducers/serviceRequests/actions";

import Checkbox from "../../../../UI/Checkbox";

type TAddUpsellProps = DialogProps & {
    selectedCodes: IUpsellServiceRequest[];
    setSelectedCodes: Dispatch<SetStateAction<IUpsellServiceRequest[]>>;
    handleSave?: () => void;
    handleSelect: (el: IUpsellServiceRequest) => void;
    disabledIds?: number[]
}

const tableData: TableRowDataType<IUpsellServiceRequest>[] = [
    {header: "OPS CODE", val: el => el.code, align: "left"},
    {header: "DESCRIPTION", val: el => el.description ?? el.description, align: "left"},
    {header: "INVOICE AMOUNT", val: el => `$${el.invoiceAmount}`, align: "left"},
]
const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
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

const AddUpsellToPackage: React.FC<TAddUpsellProps> =
    ({ handleSelect,
         disabledIds,
         selectedCodes,
         setSelectedCodes,
         handleSave,
         ...props}) => {
        const {selectedSC} = useSCs();
        const dispatch = useDispatch();
        const classes = useStyles();
        const [
            serviceRequestsList,
            isLoading,
            requestsCount,
            pageData,
            search,
        ] = useSelector((state: RootState) => [
            state.serviceRequests.intervalUpsellList,
            state.serviceRequests.upsellLoading,
            state.serviceRequests.upsellPaging.numberOfRecords,
            state.serviceRequests.upsellPageData,
            state.serviceRequests.upsellFilter.searchTerm,
        ]);
        const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
            (s: RootState) => s.serviceRequests.upsellPageData,
            setUpsellPageData
        );

        useEffect(() => {
            if (props.open && selectedSC) {
                dispatch(loadUpsellServiceRequests(selectedSC.id));
            }
        }, [props.open, dispatch, selectedSC, pageSize, pageIndex]);

        const handleClose = useCallback((): void => {
            dispatch(setUpsellFilter({searchTerm: ''}));
            props.onClose();
        }, [props.onClose, dispatch])

        const handleSaveOpsCode = useCallback(() => {
            handleSave && handleSave();
            handleClose();
        }, [selectedCodes])

        const preActions = useCallback((el: IUpsellServiceRequest) => {
            const checked = !!selectedCodes.find(item => item.id === el.id);
            return <Checkbox
                color="primary"
                disabled={disabledIds?.includes(el.id)}
                checked={checked}
                onChange={() => handleSelect(el)} />
        }, [selectedCodes, handleSelect, disabledIds])

        const handleSearch = useCallback(async () => {
            if (selectedSC) {
                changePage(null, 0);
                await dispatch(setUpsellPageData({ pageIndex: 0 }));
                await dispatch(loadUpsellServiceRequests(selectedSC.id));
            }
        }, [dispatch, selectedSC]);

        const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setUpsellFilter({searchTerm: e.target.value}));
        }, [dispatch])

        return (
            <BaseModal {...props} width={1150} onClose={handleClose}>
                <DialogTitle onClose={handleClose}>Add Interval Upsell</DialogTitle>
                <DialogContent>
                    <div className={classes.wrapper}>
                        <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={search} />
                    </div>
                    <Table<IUpsellServiceRequest>
                        data={serviceRequestsList}
                        index="id"
                        smallHeaderFont
                        startActions={preActions}
                        hidePagination={requestsCount <= pageData.pageSize}
                        compact
                        rowData={tableData}
                        isLoading={isLoading}
                        page={pageIndex}
                        rowsPerPage={pageSize}
                        onChangePage={changePage}
                        onChangeRowsPerPage={changeRowsPerPage}
                        count={requestsCount}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                    {handleSave && (
                        <Button onClick={handleSaveOpsCode} color="primary" variant="contained">
                            Save
                        </Button>)
                    }
                </DialogActions>
            </BaseModal>
        );
    };

export default AddUpsellToPackage;