import React, {useEffect, useState} from "react";
import {useModal, usePagination, useSCs} from "../../../utils/hooks";
import {PODModal} from "../../Modals/PODModal/PODModal";
import {Button} from "@material-ui/core";
import {IPod} from "../../../store/reducers/pods/types";
import {useDispatch, useSelector} from "react-redux";
import {loadPods, setPodsPageData} from "../../../store/reducers/pods/actions";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataType} from "../../UI/types";
import {Table} from "../../UI/Table";

const rowData: TableRowDataType<IPod>[] = [
    {header: "POD#", val: el => el.name},
    {header: "Description", val: e => e.description},
    {header: "Advisor", val: e => e.advisor.fullName }
]

export const ProfilePODs = () => {
    const {selectedSC} = useSCs();
    const [editedItem, setEditedItem] = useState<IPod|undefined>(undefined);
    const {isOpen, onClose, onOpen} = useModal();
    const dispatch = useDispatch();
    const [pods, podsCount, isLoading] = useSelector((state: RootState) => [
        state.pods.podsList,
        state.pods.podsPaging.numberOfRecords,
        state.pods.podsLoading
    ]);
    const {pageSize, pageIndex, changeRowsPerPage, changePage} = usePagination(state => state.pods.podsPageData, setPodsPageData);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadPods(selectedSC.id));
        }
    }, [selectedSC, dispatch, pageIndex, pageSize]);

    const handleAdd = () => {
        setEditedItem(undefined);
        onOpen();
    }

    return <div>
        <div style={{textAlign: "right"}}>
            <Button
                onClick={handleAdd}
                variant="contained"
                color="primary"
            >
                Create New POD
            </Button>
        </div>
        <Table<IPod>
            data={pods}
            index='id'
            rowData={rowData}
            page={pageIndex}
            rowsPerPage={pageSize}
            onChangePage={changePage}
            onChangeRowsPerPage={changeRowsPerPage}
            count={podsCount}
            isLoading={isLoading}
        />
        <PODModal open={isOpen} onClose={onClose} payload={editedItem} />
    </div>
}