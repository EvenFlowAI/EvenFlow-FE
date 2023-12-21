import React, {useEffect} from "react";
import {Button, IconButton} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    loadUrgentServiceRequests,
    pageDataUrgentServiceRequests
} from "../../../store/reducers/serviceRequests/actions";
import {Table} from "../../../components/Table/Table";
import {
    IAssignedServiceRequestShort,
    IPrioritizeRequest,
    IServiceRequestPriority
} from "../../../store/reducers/serviceRequests/types";
import {UrgentRequestModal} from "./UrgentRequestsModal/UrgentRequestModal";
import {Api} from "../../../config/requests";
import {SC_UNDEFINED} from "../../../config/constants";
import {DeleteOutline} from "@material-ui/icons";
import {TableRowDataType} from "../../../types/types";
import {useModal} from "../../../hooks/useModal/useModal";
import {useConfirm} from "../../../hooks/useConfirm/useConfirm";
import {usePagination} from "../../../hooks/usePaginations/usePaginations";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../hooks/useSelectedPod/useSelectedPod";

const rowData: TableRowDataType<IAssignedServiceRequestShort>[] = [
    {header: "Service Ops Code", val: el => el.code},
    {header: "Description", val: el => el.description}
];

export const UrgentRequests = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const {askConfirm} = useConfirm();
    const showMessage = useMessage();
    const showError = useException();
    const {pageIndex, pageSize, changePage, changeRowsPerPage} = usePagination(
        state => state.serviceRequests.urgentPageData,
        pageDataUrgentServiceRequests
    )
    const dispatch = useDispatch();
    const [
        data, isLoading, count
    ] = useSelector((state: RootState) => [
        state.serviceRequests.urgentList,
        state.serviceRequests.urgentLoading,
        state.serviceRequests.urgentPaging.numberOfRecords
    ]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadUrgentServiceRequests(selectedSC.id, selectedPod?.id));
        }
    }, [selectedSC, selectedPod, dispatch, pageIndex, pageSize]);

    const askRemove = (el: IAssignedServiceRequestShort) => () => {
        if (selectedSC) {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove Ops Code ${el.code}`,
                onConfirm: handleRemove(el)
            });
        }
    }
    const handleRemove = (el: IAssignedServiceRequestShort) => async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            const data: IPrioritizeRequest = {
                podId: selectedPod?.id,
                items: [{id: el.id, priority: IServiceRequestPriority.Default}]
            }
            try {
                await Api.call(Api.endpoints.ServiceRequests.Prioritize, {data});
                showMessage("Ops Code removed");
                dispatch(loadUrgentServiceRequests(selectedSC.id, selectedPod?.id));
            } catch (e) {
                showError(e);
            }
        }
    }
    const actions = (el: IAssignedServiceRequestShort) => {
        return <IconButton onClick={askRemove(el)}>
            <DeleteOutline />
        </IconButton>
    }

    return <div>
        <div style={{textAlign: "right"}}>
            <Button
                onClick={onOpen}
                color="primary"
                variant="contained"
            >
                Add Urgent request
            </Button>
        </div>
        <Table<IAssignedServiceRequestShort>
            data={data}
            rowData={rowData}
            index="id"
            count={count}
            isLoading={isLoading}
            page={pageIndex}
            rowsPerPage={pageSize}
            onChangePage={changePage}
            actions={actions}
            onChangeRowsPerPage={changeRowsPerPage}
        />
        <UrgentRequestModal open={isOpen} onClose={onClose} />
    </div>
}