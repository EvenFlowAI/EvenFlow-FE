import React, {useCallback, useEffect, useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Checkbox, useMediaQuery, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    loadNonSelectedServiceRequests, setNonSelectedFilter, setNonSelectedOrder,
    setNonSelectedPageData
} from "../../../store/reducers/serviceRequests/actions";
import {useException, useMessage, usePagination, useSCs} from "../../../utils/hooks";
import {TableRowDataType} from "../../UI/types";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Table} from "../../UI/Table";
import {LoadingButton} from "../../UI/Button";
import {SC_UNDEFINED} from "../../../config/constants";
import {SearchInput} from "../../UI/SearchInput";
import {IOrder} from "../../../types/types";

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPs code", val: el => el.code, orderId: "code"},
    {header: "Description", val: el => el.description, orderId: "description"},
    {header: "Duration", val: el => el.durationInHours.toFixed(1), orderId: "duration"},
    {header: "Regular Invoice", val: el => `$${el.invoiceAmount}`, orderId: "invoiceAmount"}
]

type TOPsCodesListDialogProps = {
    onSave: (selectedCodes: number[], serviceCenterID: number) => void;
    selectedPreviously?: number[];
} & DialogProps;

export const OPsCodesListDialog: React.FC<TOPsCodesListDialogProps> = ({onAction, onSave, selectedPreviously, payload, ...props}) => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const [
        serviceList,
        isLoading,
        servicesCount,
        search,
        order,
        nonSelectedPageData
    ] = useSelector((state: RootState) => [
        state.serviceRequests.nonSelectedList,
        state.serviceRequests.nonSelectedLoading,
        state.serviceRequests.nonSelectedPaging.numberOfRecords,
        state.serviceRequests.nonSelectedFilter.searchTerm,
        state.serviceRequests.nonSelectedOrder,
        state.serviceRequests.nonSelectedPageData,
    ]);
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.nonSelectedPageData,
        setNonSelectedPageData
    );
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedCodes, setSelectedCodes] = useState<number[]>([]);

    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    useEffect(() => {
        if (props.open && !selectedPreviously) {
            setSelectedCodes([]);
        }
    }, [props.open, !selectedPreviously]);

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [props.open, dispatch, selectedSC, pageSize, pageIndex, order]);

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
                showMessage(`Successfully added ${selectedCodes.length} codes`);
                setSelectedCodes([]);
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }, [selectedSC, onSave, selectedCodes])

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Select Service Requests</DialogTitle>
        <DialogContent>
            <div style={{display: "flex", justifyContent: isXS ? "center" : "flex-end", marginBottom: 18}}>
                <SearchInput onSearch={handleSearch} onChange={handleSearchChange} value={search} />
            </div>
            <Table<IServiceRequest>
                data={serviceList}
                order={order.orderBy}
                isAscending={order.isAscending}
                onSort={handleOrder}
                index="id"
                startActions={preActions}
                compact
                hidePagination={servicesCount < nonSelectedPageData.pageSize}
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
            <Button onClick={props.onClose}>
                Close
            </Button>
            <LoadingButton
                loading={saving}
                disabled={!selectedCodes.length}
                onClick={handleAdd}
                color="primary"
                variant="contained"
            >
                Add OPs Codes
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}