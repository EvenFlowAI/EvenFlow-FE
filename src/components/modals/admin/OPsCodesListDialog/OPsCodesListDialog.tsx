import React, {useCallback, useEffect, useState} from "react";
import {DialogProps} from "../../BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {Button, Checkbox, useMediaQuery, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    loadNonSelectedServiceRequests, setNonSelectedFilter, setNonSelectedOrder,
    setNonSelectedPageData
} from "../../../../store/reducers/serviceRequests/actions";
import {IServiceRequest} from "../../../../store/reducers/serviceRequests/types";
import {Table} from "../../../tables/Table/Table";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {SearchInput} from "../../../formControls/SearchInput/SearchInput";
import {IOrder, TableRowDataType} from "../../../../types/types";
import {LoadingButton} from "../../../buttons/LoadingButton/LoadingButton";
import {usePagination} from "../../../../hooks/usePaginations/usePaginations";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "Ops Code", val: el => el.code, orderId: "code", width: 120},
    {header: "Description", val: el => el.description, orderId: "description"},
    {header: "Labor Hours", val: el => el.durationInHours.toFixed(1), orderId: "duration", width: 100},
    {header: "Total Amount", val: el => `$${el.invoiceAmount}`, orderId: "invoiceAmount", width: 100}
]

type TOPsCodesListDialogProps = {
    onSave: (selectedCodes: number[], serviceCenterID: number) => void;
    selectedPreviously?: number[];
} & DialogProps;

export const OPsCodesListDialog: React.FC<React.PropsWithChildren<React.PropsWithChildren<TOPsCodesListDialogProps>>> = ({onAction, onSave, selectedPreviously, payload, ...props}) => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();
    const {
        nonSelectedList,
        nonSelectedLoading,
        nonSelectedPaging: {numberOfRecords},
        nonSelectedFilter: {searchTerm},
        nonSelectedOrder,
        nonSelectedPageData
        } = useSelector(({serviceRequests}: RootState) => serviceRequests);
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.nonSelectedPageData,
        setNonSelectedPageData
    );
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedCodes, setSelectedCodes] = useState<number[]>([]);

    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (props.open && !selectedPreviously) {
            setSelectedCodes([]);
        }
    }, [props.open, !selectedPreviously]);

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id, true));
        }
    }, [props.open, dispatch, selectedSC, pageSize, pageIndex, nonSelectedOrder]);

    const handleSearch = useCallback(async () => {
        if (selectedSC) {
            changePage(null, 0);
            dispatch(setNonSelectedPageData({pageIndex: 0}));
            dispatch(loadNonSelectedServiceRequests(selectedSC.id, Boolean(selectedPreviously)));
        }
    }, [dispatch, selectedSC, selectedPreviously]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNonSelectedFilter({searchTerm: e.target.value}));
    }

    const handleCheck = (el: IServiceRequest) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (checked) {
            setSelectedCodes(prev => [...prev, el.id]);
        } else {
            setSelectedCodes(prev => prev.filter(i => i !== el.id));
        }
    }

    const handleOrder = (o: IOrder<IServiceRequest>) => () => {
        dispatch(setNonSelectedOrder(o));
    }

    const preActions = (el: IServiceRequest) => {
        return <Checkbox
            color="primary"
            checked={selectedCodes.includes(el.id) || selectedPreviously?.includes(el.id) || false}
            onChange={handleCheck(el)}
            disabled={selectedPreviously?.includes(el.id)}
        />
    }

    const handleAdd = useCallback(async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true);
                await onSave(selectedCodes, selectedSC.id);
                setSaving(false);
                setSelectedCodes([]);
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }, [selectedSC, onSave, selectedCodes])

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Select Ops Codes</DialogTitle>
        <DialogContent>
            <div style={{display: "flex", justifyContent: isXS ? "center" : "flex-end", marginBottom: 18}}>
                <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={searchTerm} />
            </div>
            <Table<IServiceRequest>
                data={nonSelectedList}
                order={nonSelectedOrder.orderBy}
                isAscending={nonSelectedOrder.isAscending}
                onSort={handleOrder}
                index="id"
                startActions={preActions}
                compact
                hidePagination={numberOfRecords < nonSelectedPageData.pageSize}
                rowData={tableData}
                isLoading={nonSelectedLoading}
                page={pageIndex}
                rowsPerPage={pageSize}
                onChangePage={changePage}
                onChangeRowsPerPage={changeRowsPerPage}
                count={numberOfRecords}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose} color="info">
                Close
            </Button>
            <LoadingButton
                loading={saving}
                disabled={!selectedCodes.length}
                onClick={handleAdd}
                color="primary"
                variant="contained"
            >
                Add Ops Codes
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}