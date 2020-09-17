import React, {useEffect, useState} from "react";
import {useModal, usePagination, useSCs} from "../../../utils/hooks";
import {PODModal} from "../../Modals/PODModal/PODModal";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {IPod} from "../../../store/reducers/pods/types";
import {useDispatch, useSelector} from "react-redux";
import {loadPods, setPodsPageData} from "../../../store/reducers/pods/actions";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataType} from "../../UI/types";
import {Table} from "../../UI/Table";
import {MoreHoriz} from "@material-ui/icons";

const rowData: TableRowDataType<IPod>[] = [
    {header: "POD#", val: el => el.name},
    {header: "Description", val: e => e.description},
    {header: "Advisor", val: e => e.advisor.fullName},
    {header: "Technicians", val: e => e.technicians.map(t => t.fullName).join(", ")},
    {header: "Bays", val: e => e.bays.map(b => b.name).join(", ")},
    {header: "Service Requests", val: e => e.serviceRequests.map(s => s.code).join(", ")}
]

export const ProfilePODs = () => {
    const {selectedSC} = useSCs();
    const [editedItem, setEditedItem] = useState<IPod|undefined>(undefined);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
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
    const handleEdit = () => {
        setAnchorEl(null);
        onOpen();
    }
    const handleOpenMenu = (el: IPod) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(e.currentTarget);
        setEditedItem(el);
    }

    const actions = (el: IPod) => {
        return <IconButton onClick={handleOpenMenu(el)}>
            <MoreHoriz />
        </IconButton>
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
            actions={actions}
            isLoading={isLoading}
        />
        <PODModal open={isOpen} onClose={onClose} payload={editedItem} />
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
        </Menu>
    </div>
}