import React, {useEffect} from "react";
import {Button, IconButton} from "@material-ui/core";
import {
    useConfirm,
    useException,
    useMessage,
    useModal,
    usePagination,
    useSCs,
    useSelectedPod
} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    loadUrgentServiceRequests,
    pageDataUrgentServiceRequests
} from "../../../../store/reducers/serviceRequests/actions";
import {Table} from "../../../UI/Table";
import {
    IAssignedServiceRequestShort,
    IPrioritizeRequest,
    IServiceRequestPriority
} from "../../../../store/reducers/serviceRequests/types";
import {TableRowDataType} from "../../../UI/types";
import {UrgentRequestDialog} from "../../../Modals/UrgentRequestsDialog/UrgentRequestDialog";
import {Api} from "../../../../config/requests";
import {SC_UNDEFINED} from "../../../../config/constants";
import {DeleteOutline} from "@material-ui/icons";

const rowData: TableRowDataType<IAssignedServiceRequestShort>[] = [
    {header: "Service OPs Code", val: el => el.code},
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
                title: "Remove?",
                content: `Remove ${el.code} from prioritized list?`,
                onConfirm: handleRemove(el)
            });
        }
    }
    const handleRemove = (el: IAssignedServiceRequestShort) => async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            const data: IPrioritizeRequest = {
                items: [{id: el.id, priority: IServiceRequestPriority.Default}]
            }
            try {
                await Api.call(Api.endpoints.ServiceRequests.Prioritize, {data});
                showMessage("Removed");
                dispatch(loadUrgentServiceRequests(selectedSC.id));
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
        <UrgentRequestDialog open={isOpen} onClose={onClose} />
    </div>
}