import React, {useEffect, useState} from "react";
import {useConfirm, useException, useMessage, useModal, usePagination, useSCs} from "../../../utils/hooks";
import {PODModal} from "../../Modals/PODModal/PODModal";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {EJobType, IPod} from "../../../store/reducers/pods/types";
import {useDispatch, useSelector} from "react-redux";
import {loadPods, removePod, setPodsPageData} from "../../../store/reducers/pods/actions";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataTypeResp} from "../../UI/types";
import {Table} from "../../UI/Table";
import {MoreHoriz} from "@material-ui/icons";
import {TViewMode} from "../../Modals/types";

const rowData: TableRowDataTypeResp<IPod>[] = [
    {header: "POD#", val: el => el.name},
    {header: "Description", val: e => e.description, xsHidden: true},
    {header: "Advisor", val: e => e.advisor?.fullName},
    {header: "Technicians", val: e => e.technicians?.map(t => t.fullName).join(", ") || ""},
    {header: "Bays", val: e => e.bays?.map(b => b.name).join(", ") || ""},
    {header: "Service Requests", val: e => e.serviceRequests?.map(s => s.code).join(", ") || "", xsHidden: true},
    {header: "Makes", val: e => e.vehicleMakes?.map(s => s.name).join(", ") || "", xsHidden: true},
    {header: "Models", val: e => e.vehicleModels?.map(s => s.name).join(", ") || "", xsHidden: true},
    {header: "Job Type", val: e => typeof e.jobType !== "undefined" && Number.isInteger(+e.jobType) ? EJobType[e.jobType] : "", xsHidden: true},
]
// todo add the mobile zones column to the table
export const ProfilePODs:React.FC<{dense?: boolean}&TViewMode> = ({dense, viewMode}) => {
    const [pods, podsCount, isLoading] = useSelector((state: RootState) => [
        state.pods.podsList,
        state.pods.podsPaging.numberOfRecords,
        state.pods.podsLoading
    ]);
    const [editedItem, setEditedItem] = useState<IPod|undefined>(undefined);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

    const {selectedSC} = useSCs();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const dispatch = useDispatch();
    const {isOpen, onClose, onOpen} = useModal();
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
    const askRemove = () => {
        setAnchorEl(null);
        askConfirm({
            isRemove: true,
            title: `Remove POD ${editedItem?.name}`,
            onConfirm: handleRemove
        });
    }

    const handleRemove = async () => {
        if (!editedItem) {
            showError("Pod not specified");
        } else {
            try {
                await dispatch(removePod(editedItem.id, selectedSC?.id));
                showMessage("Removed");
                setEditedItem(undefined);
            } catch (e) {
                showError(e);
            }
        }
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
        {!viewMode ? <div style={{textAlign: "right"}}>
            <Button
                onClick={handleAdd}
                variant="contained"
                color="primary"
            >
                Create New POD
            </Button>
        </div> : null}
        <Table<IPod>
            data={pods}
            viewMode={viewMode}
            index='id'
            rowData={rowData}
            compact={dense}
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
            <MenuItem onClick={askRemove}>Remove</MenuItem>
        </Menu>
    </div>
}