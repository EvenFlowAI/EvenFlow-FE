import React, {useEffect, useState} from 'react';
import {TableRowDataType} from "../../../types/types";
import dayjs from "dayjs";
import {timeSpanString} from "../../../utils/constants";
import {Table} from "../../../components/tables/Table/Table";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import {useModal} from "../../../hooks/useModal/useModal";
import {ICapacitySetting} from "../../../store/reducers/capacityManagement/types";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {loadCapacitySettings} from "../../../store/reducers/capacityManagement/actions";
import {RootState} from "../../../store/rootReducer";

const RowData: TableRowDataType<ICapacitySetting>[] = [
    {
        header: "ID",
        val: (el) => el.id.toString(),
        align: "center"
    },
    {
        header: "Service Book Name",
        val: (el) => el.serviceBookName,
        align: "left"
    },
    {
        header: "Appointment Gap Slots",
        val: (el) => `${el.slotsGap}-minutes`,
        align: "left"
    },
    {
        header: "Appointments Per Slot",
        val: (el) => el.appointmentsPerSlot.toString(),
        align: "left"
    },
    {
        header: "Appointment Lead Time",
        val: (el) => el.appointmentLeadTime.toString(),
        align: "left"
    },
    {
        header: "Appointment Cut Off",
        val: (el) => dayjs(el.appointmentCutOff, timeSpanString).format("h:mm"),
        align: "left"
    },
    {
        header: "Technician Efficiency",
        val: (el) => el.technicianEfficiency.toString(),
        align: "left"
    },
    {
        header: "Average Bill Hours Per RO",
        val: (el) => el.averageBillHours.toString(),
        align: "left"
    },
    {
        header: "Advisor Staffing Factor",
        val: (el) => el.advisorStaffingFactor ? "On" : "Off",
        align: "left"
    }
]

const CapacitySettingsTable = () => {
    const {capacitySettings} = useSelector((state: RootState) => state.capacityManagement);
    const [editedItem, setEditedItem] = useState<ICapacitySetting|null>(null);
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const {isOpen: isConfigureOpen, onOpen: onConfigureOpen, onClose: onConfigureClose} = useModal()
    const {isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose} = useModal()
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) dispatch(loadCapacitySettings(selectedSC.id))
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
                index="id"
                rowData={RowData}
                noDataTitle={"No Service Books present"}
                actions={menuActions}
                hidePagination/>
            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
                <MenuItem onClick={handleConfigure}>Configure</MenuItem>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
            </Menu>
        </div>
    );
};

export default CapacitySettingsTable;