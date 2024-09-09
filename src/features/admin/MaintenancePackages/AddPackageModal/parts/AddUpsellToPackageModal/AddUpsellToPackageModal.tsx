import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button} from "@mui/material";
import {DialogProps} from "../../../../../../components/modals/BaseModal/types";
import {IUpsellServiceRequest} from "../../../../../../store/reducers/serviceRequests/types";
import {RootState} from "../../../../../../store/rootReducer";
import {Table} from "../../../../../../components/tables/Table/Table";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../../../components/modals/BaseModal/BaseModal";
import {SearchInput} from "../../../../../../components/formControls/SearchInput/SearchInput";
import {
    loadUpsellServiceRequests, setUpsellFilter, setUpsellPageData,
} from "../../../../../../store/reducers/serviceRequests/actions";
import Checkbox from "../../../../../../components/formControls/Checkbox/Checkbox";
import {useStyles} from "./styles";
import {TableRowDataType} from "../../../../../../types/types";
import {usePagination} from "../../../../../../hooks/usePaginations/usePaginations";
import {useSCs} from "../../../../../../hooks/useSCs/useSCs";

type TAddUpsellProps = DialogProps & {
    selectedCodes: IUpsellServiceRequest[];
    handleSelect: (el: IUpsellServiceRequest) => void;
    disabledIds?: number[]
}

const tableData: TableRowDataType<IUpsellServiceRequest>[] = [
    {header: "OP CODE", val: el => el.code ?? el.serviceRequest?.code, align: "left"},
    {header: "DESCRIPTION", val: el => el.description ?? el.serviceRequest?.description, align: "left"},
    {header: "INVOICE AMOUNT", val: el => `$${el.invoiceAmount ?? el.serviceRequest?.invoiceAmount}`, align: "left"},
]

const AddUpsellToPackageModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TAddUpsellProps>>> =
    ({ handleSelect,
         disabledIds,
         selectedCodes,
         ...props}) => {
        const {selectedSC} = useSCs();
        const dispatch = useDispatch();
        const { classes  } = useStyles();
        const {
            intervalUpsellList,
            upsellLoading,
            upsellPaging: {numberOfRecords},
            upsellPageData,
            upsellFilter: {searchTerm}
        } = useSelector((state: RootState) => state.serviceRequests)

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
                        <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={searchTerm} />
                    </div>
                    <Table<IUpsellServiceRequest>
                        data={intervalUpsellList}
                        index="id"
                        smallHeaderFont
                        startActions={preActions}
                        hidePagination={numberOfRecords <= upsellPageData.pageSize}
                        compact
                        rowData={tableData}
                        isLoading={upsellLoading}
                        page={pageIndex}
                        rowsPerPage={pageSize}
                        onChangePage={changePage}
                        onChangeRowsPerPage={changeRowsPerPage}
                        count={numberOfRecords}
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