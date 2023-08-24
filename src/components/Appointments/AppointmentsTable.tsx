import React, {Dispatch, SetStateAction, useCallback, useState} from 'react';
import {Table} from "../UI/Table";
import {
    AppointmentStatus,
    appointmentStatuses, IAppointment,
} from "../../api/types";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {ViewAppointmentDialog} from "./ViewAppointmentDialog";
import moment from "moment";
import {getAppointmentDate} from "../../utils/utils";
import {API} from "../../api/api";
import {MoreHoriz} from "@material-ui/icons";
import {IOrder, IPageRequest} from "../../types/types";
import {useConfirm, useException, useMessage, useModal} from "../../utils/hooks";
import {TableRowDataType} from "../UI/types";
import {timeString} from "../../config/constants";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";

const cols: TableRowDataType<IAppointment>[] = [
    {header: "Date", val: el => el.dateTime ? moment.utc(el.dateTime).format("MMMM D, YYYY") : "", orderId: "date", width: 150},
    {header: "Day", val: el => el.dateTime ? moment.utc(el.dateTime).format("ddd") : ""},
    {header: "Time", val: el => el.dateTime ? moment.utc(el.dateTime).format(timeString) : ""},
    {header: "Customer Name", val: el => el.customerInformation?.fullName ?? "", orderId: "fullName"},
    {header: "Vehicle", val: el => `${el.vehicle?.make ?? ''} ${el.vehicle?.model ?? ''} ${el.vehicle?.year ?? ''}`},
    {header: "Service Book", val: el => el.serviceBook?.name ?? ''},
    {header: "Scheduler", val: el => `${el.scheduler?.fullName ?? ''}`},
    {header: "Status", val: el => typeof el.appointmentStatus !== 'undefined' && Number.isInteger(el.appointmentStatus) ? appointmentStatuses[el.appointmentStatus] : "", orderId: "appointmentStatus"},
]

type TAppointmentsTable = {
    refresh: () => void;
    order: IOrder<IAppointment>;
    setOrder: React.Dispatch<React.SetStateAction<IOrder<IAppointment>>>
    onChangePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number) => void;
    onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    pageData: IPageRequest;
    isLoading: boolean;
    viewItem?: IAppointment|undefined;
    setViewItem?: Dispatch<SetStateAction<IAppointment|undefined>>
}

export const AppointmentsTable: React.FC<TAppointmentsTable> = ({ viewItem, setViewItem, isLoading, refresh, setOrder, order, pageData, onChangeRowsPerPage, onChangePage }) => {
    const { appointments, count } = useSelector((state: RootState) => state.appointments);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

    const {isOpen, onClose, onOpen} = useModal();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();

    const handleOpen = (el: IAppointment) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setViewItem && setViewItem(el);
        setAnchorEl(e.currentTarget)
    }

    const handleView = () => {
        setAnchorEl(null);
        onOpen();
    }

    const openInNewTab = async () => {
        if (viewItem?.hashKey) {
            const url = window.location.href.replace('/admin/appointments', `/appointment-update/${viewItem.hashKey}?fromAdmin=true`)
            window.open(url, '_blank', 'noreferrer');
        }
    };

    const handleEdit = async () => {
        setAnchorEl(null);
        await openInNewTab();
    }

    const handleCancel = useCallback(() => {
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
                        {moment(viewItem.dateTime).format("LLL")}?
                    </span>,
                    onConfirm: _handleCancel
                });
            }
        }
    }, [viewItem, showError, askConfirm, getAppointmentDate])

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

    const actions = (el: IAppointment) => {
        return <IconButton
            size="small"
            onClick={handleOpen(el)}>
            <MoreHoriz />
        </IconButton>
    }

    const handleSort = (data: IOrder<IAppointment>) => () => {
        setOrder(data);
    }

    return <>
        <Table<IAppointment>
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