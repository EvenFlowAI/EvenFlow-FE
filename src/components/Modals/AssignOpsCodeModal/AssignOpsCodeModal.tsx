import React, {useCallback, useEffect, useState} from 'react';
import {DialogProps} from "../types";
import {TableRowDataType} from "../../UI/types";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Button, Radio} from "@material-ui/core";
import {Table} from "../../UI/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {usePagination, useSCs} from "../../../utils/hooks";
import {
    loadNonSelectedServiceRequests,
    setNonSelectedFilter,
    setNonSelectedPageData
} from "../../../store/reducers/serviceRequests/actions";
import {BaseModal, DialogActions, DialogContent, DialogContentTitle, DialogTitle} from "../BaseModal";
import {SearchInput} from "../../UI/SearchInput";
import {LoadingButton} from "../../UI/Button";
import {updatePackageOptions} from "../../../store/reducers/packages/actions";
import {Autocomplete} from "@material-ui/lab";

const tableData: TableRowDataType<IServiceRequest>[] = [
    {header: "OPs code", val: el => el.code, orderId: "code"},
    {header: "Description", val: el => el.description, orderId: "description"},
]

type TModalProps = DialogProps & {
    packageName: string;
}

const AssignOpsCodeModal: React.FC<TModalProps> = (props) => {
    const [selectedCode, setSelectedCode] = useState<number | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [
        serviceList,
        isLoading,
        servicesCount,
        search,
        currentPackage,
    ] = useSelector((state: RootState) => [
        state.serviceRequests.nonSelectedList,
        state.serviceRequests.nonSelectedLoading,
        state.serviceRequests.nonSelectedPaging.numberOfRecords,
        state.serviceRequests.nonSelectedFilter.searchTerm,
        state.packages.currentPackage,
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

    const handleSelect = (el: IServiceRequest) => {
        setSelectedCode(el.id);
    }

    const preActions = (el: IServiceRequest) => {
        return <Radio color="primary" checked={selectedCode === +el.id} onChange={() => handleSelect(el)} />
    }

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            dispatch(loadNonSelectedServiceRequests(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNonSelectedFilter({searchTerm: e.target.value}));
    }

    const handleAssign = () => {
        setSaving(true);
        if (currentPackage) {
            // const data = []
            // dispatch(updatePackageOptions(currentPackage.id, data))
        }
    }

    return (
        <BaseModal {...props}>
            <DialogTitle onClose={props.onClose}>Assign Ops Code</DialogTitle>
            <DialogContentTitle title={props.packageName}/>
            <DialogContent>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>

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
                    disabled={!selectedCode}
                    onClick={handleAssign}
                    color="primary"
                    variant="contained"
                >
                    Save
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default AssignOpsCodeModal;