import React, {useEffect, useState} from 'react';
import dayjs from "dayjs";
import {Table} from "../../../components/tables/Table/Table";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import {useModal} from "../../../hooks/useModal/useModal";
import {ICapacitySetting} from "../../../store/reducers/capacityManagement/types";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {loadCapacitySettings} from "../../../store/reducers/capacityManagement/actions";
import {RootState} from "../../../store/rootReducer";
import {RowData} from "./constants";
import ServiceBookModal from "../ServiceBookModal/ServiceBookModal";
import {loadWorkingDays} from "../../../store/reducers/serviceCenters/actions";

const CapacitySettingsTable = () => {
    const {capacitySettings} = useSelector((state: RootState) => state.capacityManagement);
    const [editedItem, setEditedItem] = useState<ICapacitySetting|null>(null);
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const {isOpen: isConfigureOpen, onOpen: onConfigureOpen, onClose: onConfigureClose} = useModal()
    const {isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose} = useModal()
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadCapacitySettings(selectedSC.id, dayjs().format("dddd")))
            dispatch(loadWorkingDays(selectedSC.id))
        }
    }, [selectedSC])

    const openMenu = (el: ICapacitySetting) =>
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            setEditedItem(el);
            setAnchorEl(e.currentTarget);
        }

    const menuActions = (el: ICapacitySetting) =>
        <IconButton size="small" onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;

    const closeMenu = () => {
        setEditedItem(null);
        setAnchorEl(null);
    }

    const handleConfigure = () => {
        onConfigureOpen()
    }

    const handleEdit = () => {
        onEditOpen()
    }

    return (
        <div>
            <Table<ICapacitySetting>
                data={capacitySettings}
                index="serviceBookId"
                rowData={RowData}
                noDataTitle={"No Service Books present"}
                actions={menuActions}
                hidePagination/>
            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
                <MenuItem onClick={handleConfigure}>Configure</MenuItem>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
            </Menu>
            <ServiceBookModal open={isEditOpen} onClose={onEditClose} editingItem={editedItem}/>
        </div>
    );
};

export default CapacitySettingsTable;