import React, {Dispatch, SetStateAction, useState} from 'react';
import {Table} from "../UI/Table";
import {AppointmentStatus, appointmentStatuses, IAppointmentByQuery} from "../../api/types";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {ViewAppointmentDialog} from "./ViewAppointmentDialog";
import moment from "moment";
import {getAppointmentDate} from "../../utils/utils";
import {API} from "../../api/api";
import {MoreHoriz} from "@material-ui/icons";
import {IOrder, IPageRequest} from "../../types/types";
import {useConfirm, useException, useMessage, useModal} from "../../utils/hooks";
import {TableRowDataType} from "../UI/types";
import {timeSpanString, timeString} from "../../config/constants";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";

const cols: TableRowDataType<IAppointmentByQuery>[] = [
    {header: "Date", val: el => moment.utc(el.dateInUtc).format("LL"), orderId: "date"},
    {header: "Time", val: el => moment(el.timeSlot, timeSpanString).format(timeString)},
    {header: "Full Name", val: el => el.driver.fullName, orderId: "fullName"},
    {header: "Car Info", val: el => `${el.vehicle.make} ${el.vehicle.model} ${el.vehicle.year}`},
    {header: "Status", val: el => appointmentStatuses[el.appointmentStatus], orderId: "appointmentStatus"}
]

type TAppointmentsTable = {
    refresh: () => void;
    order: IOrder<IAppointmentByQuery>;
    setOrder: React.Dispatch<React.SetStateAction<IOrder<IAppointmentByQuery>>>
    onEditOpen: () => void;
    onChangePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number) => void;
    onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    pageData: IPageRequest;
    isLoading: boolean;
    viewItem?: IAppointmentByQuery|undefined;
    setViewItem?: Dispatch<SetStateAction<IAppointmentByQuery|undefined>>
}

export const AppointmentsTable: React.FC<TAppointmentsTable> = ({ viewItem, setViewItem, isLoading, refresh, setOrder, order, onEditOpen, pageData, onChangeRowsPerPage, onChangePage }) => {
    const { appointments, count } = useSelector((state: RootState) => state.appointments);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

    const {isOpen, onClose, onOpen} = useModal();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();

    const handleOpen = (el: IAppointmentByQuery) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setViewItem && setViewItem(el);
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
                        Please confirm you want to cancel appointment on <br />
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
                setViewItem && setViewItem(undefined);
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

    const actions = (el: IAppointmentByQuery) => {
        return <IconButton
            size="small"
            onClick={handleOpen(el)}>
            <MoreHoriz />
        </IconButton>
    }

    const handleSort = (data: IOrder<IAppointmentByQuery>) => () => {
        setOrder(data);
    }

    return <>
        <Table<IAppointmentByQuery>
            data={appointments}
            onSort={handleSort}
            order={order.orderBy}
            isAscending={order.isAscending}
            noDataTitle="No upcoming appointments scheduled"
            isLoading={isLoading}
            rowData={cols}
            hidePagination={count < 11}
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
            </>
};