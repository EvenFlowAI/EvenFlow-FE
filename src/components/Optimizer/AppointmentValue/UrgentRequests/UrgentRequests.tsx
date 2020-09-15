import React, {useEffect} from "react";
import {Button} from "@material-ui/core";
import {useModal, usePagination, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    loadUrgentServiceRequests,
    pageDataUrgentServiceRequests
} from "../../../../store/reducers/serviceRequests/actions";
import {Table} from "../../../UI/Table";
import {IAssignedServiceRequestShort} from "../../../../store/reducers/serviceRequests/types";
import {TableRowDataType} from "../../../UI/types";

const rowData: TableRowDataType<IAssignedServiceRequestShort>[] = [
    {header: "Service OPs Code", val: el => el.code},
    {header: "Description", val: el => el.description}
];

export const UrgentRequests = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const {selectedSC} = useSCs();
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
            dispatch(loadUrgentServiceRequests(selectedSC.id));
        }
    }, [selectedSC, dispatch, pageIndex, pageSize]);

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
            onChangeRowsPerPage={changeRowsPerPage}
        />
    </div>
}