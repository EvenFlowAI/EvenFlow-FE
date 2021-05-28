import React, {useCallback, useEffect, useState} from 'react';
import {timeSpanString, timeString, Titles} from "../../config/constants";
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {AppointmentActions} from "./AppointmentActions";
import {useConfirm, useException, useMessage, useModal, useSCs, useStatePagination} from "../../utils/hooks";
import {AppointmentStatus, appointmentStatuses, IListAppointment} from "../../api/types";
import {API} from "../../api/api";
import {TableRowDataType} from "../UI/types";
import {Table} from "../UI/Table";
import moment from "moment";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {ViewAppointmentDialog} from "./ViewAppointmentDialog";
import {getAppointmentDate} from "../../utils/utils";
import {AppointmentDialog} from "./AppointmentDialog";

const cols: TableRowDataType<IListAppointment>[] = [
    {header: "Date", val: el => moment.utc(el.dateInUtc).format("LL")},
    {header: "Time", val: el => moment(el.timeSlot, timeSpanString).format(timeString)},
    {header: "Full Name", val: el => el.driver.fullName},
    {header: "Car Info", val: el => `${el.vehicle.make} ${el.vehicle.model} ${el.vehicle.year}`},
    {header: "Status", val: el => appointmentStatuses[el.appointmentStatus]}
]

export const Appointments = () => {
    const [appointments, setAppointments] = useState<IListAppointment[]>([]);
    const [viewItem, setViewItem] = useState<IListAppointment|undefined>(undefined);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const {selectedSC} = useSCs();
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();
    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isEditOpen, onClose: onEditClose, onOpen: onEditOpen} = useModal();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();

    const refresh = useCallback(() => {
         if (selectedSC) {
            setLoading(true);
            API.appointment.list({
                pageIndex: pageData.pageIndex,
                pageSize: pageData.pageSize,
                serviceCenterId: selectedSC.id,
                orderBy: "date"
            })
                .then(({data: {paging, result}}) => {
                    setAppointments(result);
                    setCount(paging.numberOfRecords);
                })
                .catch( () => {setAppointments([])})
                .finally(() => { setLoading(false); });
        }
    }, [selectedSC, pageData]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const handleOpen = (el: IListAppointment) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setViewItem(el);
        setAnchorEl(e.currentTarget)
    }

    const handleView = () => {
        setAnchorEl(null);
        onOpen();
    }
    const handleEdit = () => {
        setAnchorEl(null);
        onEditOpen();
    }
    const handleCancel = () => {
        setAnchorEl(null);
        if (viewItem?.appointmentStatus === AppointmentStatus.Cancelled) {
            showError("Appointment is already canceled");
        } else {
            if (viewItem) {
                askConfirm({
                    isRemove: true,
                    confirmContent: "Cancel appointment",
                    title: "Cancel appointment",
                    content: <span>
                        Are you sure want to cancel appointment on <br />
                        {getAppointmentDate(viewItem).format("LLL")}?
                    </span>,
                    onConfirm: _handleCancel
                });
            }
        }
    }
    const _handleCancel = async () => {
        if (viewItem) {
            try {
                await API.appointment.cancel(viewItem.id);
                setViewItem(undefined);
                showMessage("Canceled");
                refresh();
            } catch (e) {
                showError(e);
            }
        }
    }

    const handleEditCallback = () => {
        onClose();
        handleEdit();
    }
    const handleCancelCallback = () => {
        onClose();
        handleCancel();
    }

    const actions = (el: IListAppointment) => {
        return <IconButton
            size="small"
            onClick={handleOpen(el)}>
            <MoreHoriz />
        </IconButton>
    }

    return <>
        <TitleContainer title={Titles.Appointments} pad actions={<AppointmentActions onAction={refresh} />} />
        <Table<IListAppointment>
            data={appointments}
            noDataTitle="No upcoming appointments scheduled"
            isLoading={loading}
            rowData={cols}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            count={count}
            page={pageData.pageIndex}
            rowsPerPage={pageData.pageSize}
            index="id"
            actions={actions}
        />
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleView}>View</MenuItem>
            <MenuItem
                disabled={
                    viewItem?.appointmentStatus === AppointmentStatus.Cancelled
                    || !viewItem?.isEditable
                }
                onClick={handleEdit}>Edit</MenuItem>
            <MenuItem
                disabled={
                    viewItem?.appointmentStatus === AppointmentStatus.Cancelled
                    || !viewItem?.isEditable
                }
                onClick={handleCancel}>Cancel</MenuItem>
        </Menu>
        <ViewAppointmentDialog
            onEditAppointment={handleEditCallback} onCancelAppointment={handleCancelCallback}
            open={isOpen} payload={viewItem} onClose={onClose} />
        <AppointmentDialog
            payload={viewItem} onAction={refresh} open={isEditOpen} onClose={onEditClose} />
    </>
};