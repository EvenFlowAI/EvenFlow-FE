import React, {useCallback, useEffect, useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Checkbox} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    assignServiceRequests,
    loadNonSelectedServiceRequests, setNonSelectedFilter,
    setNonSelectedPageData
} from "../../../store/reducers/serviceRequests/actions";
import {useException, useMessage, usePagination, useSCs} from "../../../utils/hooks";
import {TableRowDataType} from "../../UI/types";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Table} from "../../UI/Table";
import {LoadingButton} from "../../UI/Button";
import {SC_UNDEFINED} from "../../../config/constants";
import {SearchInput} from "../../UI/SearchInput";

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPs code", val: el => el.code},
    {header: "Description", val: el => el.description},
    {header: "Duration", val: el => el.durationInHours.toFixed(1)},
    {header: "Regular Invoice", val: el => `$${el.invoiceAmount}`}
]

export const OPsCodesListDialog: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const [
        serviceList,
        isLoading,
        servicesCount,
        search
    ] = useSelector((state: RootState) => [
        state.serviceRequests.nonSelectedList,
        state.serviceRequests.nonSelectedLoading,
        state.serviceRequests.nonSelectedPaging.numberOfRecords,
        state.serviceRequests.nonSelectedFilter.searchTerm
    ]);
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.nonSelectedPageData,
        setNonSelectedPageData
    );
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedCodes, setSelectedCodes] = useState<number[]>([]);

    useEffect(() => {
        if (props.open) {
            setSelectedCodes([]);
        }
    }, [props.open]);

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [props.open, dispatch, selectedSC, pageSize, pageSize]);
    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC]);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNonSelectedFilter({searchTerm: e.target.value}));
    }

    const handleCheck = (el: IServiceRequest) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (checked) {
            setSelectedCodes([...selectedCodes, el.id]);
        } else {
            setSelectedCodes(selectedCodes.filter(i => i !== el.id));
        }
    }

    const preActions = (el: IServiceRequest) => {
        return <Checkbox color="primary" checked={selectedCodes.includes(el.id)} onChange={handleCheck(el)} />
    }

    const handleAdd = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true);
                await dispatch(assignServiceRequests(selectedCodes, selectedSC.id));
                setSaving(false);
                showMessage(`Successfully assigned ${selectedCodes.length} codes`);
                setSelectedCodes([]);
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Select Service Requests</DialogTitle>
        <DialogContent>
            <div style={{display: "flex", justifyContent: "flex-end", marginBottom: 18}}>
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