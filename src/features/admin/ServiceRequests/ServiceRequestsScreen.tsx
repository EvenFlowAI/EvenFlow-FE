import React, {useCallback, useEffect, useState} from "react";
import {TitleContainer} from "../../../components/TitleContainer/TitleContainer";
import {Button} from "@material-ui/core";
import {OPsCodesListDialog} from "../../../components/modals/admin/OPsCodesListDialog/OPsCodesListDialog";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    assignServiceRequests,
    loadAssignedServiceRequests,
    setAssignedFilter,
    setAssignedPageData
} from "../../../store/reducers/serviceRequests/actions";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {OverrideOPsCodeModal} from "./OverrideOpsCodeModal/OverrideOPsCodeModal";
import {SearchInput} from "../../../components/formControls/SearchInput/SearchInput";
import {ServiceRequestsTable} from "./ServiceRequestsTable/ServiceRequestsTable";
import {optimizerRoot} from "../../../utils/constants";
import {useModal} from "../../../hooks/useModal/useModal";
import {usePagination} from "../../../hooks/usePaginations/usePaginations";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";

export const ServiceRequestsScreen = () => {
    const [
        pageData,
        search,
        order
    ] = useSelector((state: RootState) => [
        state.serviceRequests.assignedPageData,
        state.serviceRequests.assignedFilter.searchTerm,
        state.serviceRequests.assignedOrdering
    ]);

    const [editedItem, setEditedItem] = useState<IAssignedServiceRequest|undefined>(undefined);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const {isOpen, onOpen, onClose} = useModal();
    const {isOpen: isOOpen, onOpen: onOOpen, onClose: onOClose} = useModal();
    const {changeRowsPerPage, changePage, pageIndex, pageSize} = usePagination(
        (s: RootState) => s.serviceRequests.assignedPageData,
        setAssignedPageData
    );

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [selectedSC, dispatch, pageData, order]);

    const handleAddOpsCode = () => {
        setEditedItem(undefined);
        onOpen();
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAssignedFilter({searchTerm: e.target.value}));
    }

    const handleSearch = useCallback(() => {
        if (selectedSC) {
            changePage(null, 0);
            dispatch(setAssignedPageData({pageIndex: 0}));
            dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [selectedSC, dispatch]);

    const onSuccessAssign = useCallback((selectedCodes: number[]) => {
        showMessage(`${selectedCodes.length} ${selectedCodes.length > 1 ? 'Ops Codes' : 'Ops Code'} added`)
    }, [])

    const onRequestAssign = useCallback((selectedCodes: number[], serviceCenterId: number) => {
        dispatch(assignServiceRequests(selectedCodes, serviceCenterId, showError, onSuccessAssign));
    }, [dispatch, showError, onSuccessAssign])

    return <>
        <TitleContainer
            pad
            parent={optimizerRoot}
            actions={<div style={{display: "flex", alignItems: "center"}}>
                <SearchInput
                    onChange={handleSearchChange}
                    value={search}
                    onSearch={handleSearch}
                />
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    variant="contained"
                    onClick={handleAddOpsCode}
                >
                    Add Ops Codes
                </Button>
            </div>}
        />
        <ServiceRequestsTable
            setEditedItem={setEditedItem}
            onOOpen={onOOpen}
            editedItem={editedItem}
            pageSize={pageSize}
            pageIndex={pageIndex}
            changePage={changePage}
            changeRowsPerPage={changeRowsPerPage}
            />
        <OPsCodesListDialog open={isOpen} onClose={onClose} onSave={onRequestAssign}/>
        <OverrideOPsCodeModal open={isOOpen} onClose={onOClose} payload={editedItem} />
    </>;
}