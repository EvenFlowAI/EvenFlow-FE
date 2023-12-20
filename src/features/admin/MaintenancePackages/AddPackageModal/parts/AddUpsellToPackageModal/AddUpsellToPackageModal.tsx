import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button} from "@material-ui/core";
import {DialogProps} from "../../../../../../components/BaseModal/types";
import {TableRowDataType} from "../../../../../../components/UI/types";
import {IUpsellServiceRequest} from "../../../../../../store/reducers/serviceRequests/types";
import {RootState} from "../../../../../../store/rootReducer";
import {Table} from "../../../../../../components/Table/Table";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../../../components/BaseModal/BaseModal";
import {SearchInput} from "../../../../../../components/FormControls/SearchInput/SearchInput";
import {usePagination, useSCs} from "../../../../../../utils/hooks";
import {
    loadUpsellServiceRequests, setUpsellFilter, setUpsellPageData,
} from "../../../../../../store/reducers/serviceRequests/actions";
import Checkbox from "../../../../../../components/UI/Checkbox";
import {useStyles} from "./styles";

type TAddUpsellProps = DialogProps & {
    selectedCodes: IUpsellServiceRequest[];
    handleSelect: (el: IUpsellServiceRequest) => void;
    disabledIds?: number[]
}

const tableData: TableRowDataType<IUpsellServiceRequest>[] = [
    {header: "OPS CODE", val: el => el.code ?? el.serviceRequest?.code, align: "left"},
    {header: "DESCRIPTION", val: el => el.description ?? el.serviceRequest?.description, align: "left"},
    {header: "INVOICE AMOUNT", val: el => `$${el.invoiceAmount ?? el.serviceRequest?.invoiceAmount}`, align: "left"},
]

const AddUpsellToPackageModal: React.FC<TAddUpsellProps> =
    ({ handleSelect,
         disabledIds,
         selectedCodes,
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
            if (selectedSC && props.open) {
                dispatch(loadUpsellServiceRequests(selectedSC.id));
            }
        }, [dispatch, selectedSC, pageSize, pageIndex, props.open]);

        const handleClose = useCallback((): void => {
            dispatch(setUpsellFilter({searchTerm: ''}));
            props.onClose();
        }, [props.onClose, dispatch])

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
                </DialogActions>
            </BaseModal>
        );
    };

export default AddUpsellToPackageModal;