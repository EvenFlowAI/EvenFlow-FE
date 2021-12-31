import React, {useCallback, useEffect, useState} from 'react';
import {timeSpanString, timeString, Titles} from "../../config/constants";
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {AppointmentActions} from "./AppointmentActions";
import {useConfirm, useException, useMessage, useModal, useSCs, useStatePagination} from "../../utils/hooks";
import {AppointmentStatus, appointmentStatuses, EAppointmentStatus, IListAppointment} from "../../api/types";
import {API} from "../../api/api";
import {TableRowDataType} from "../UI/types";
import {Table} from "../UI/Table";
import moment from "moment";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {ViewAppointmentDialog} from "./ViewAppointmentDialog";
import {getAppointmentDate} from "../../utils/utils";
import {AppointmentDialog} from "./AppointmentDialog";
import {IOrder} from "../../types/types";
import AppointmentFilters from "./AppointmentFilters";
import {IAppointmentsRequest} from "../../store/reducers/appointments/types";
import {useDispatch, useSelector} from "react-redux";
import {loadAppointments} from "../../store/reducers/appointments/actions";
import {RootState} from "../../store/rootReducer";
import AppointmentsCalendar from "./AppointmentsCalendar";

export type TView = "calendar" | "list";

const cols: TableRowDataType<IListAppointment>[] = [
    {header: "Date", val: el => moment.utc(el.dateInUtc).format("LL"), orderId: "date"},
    {header: "Time", val: el => moment(el.timeSlot, timeSpanString).format(timeString)},
    {header: "Full Name", val: el => el.driver.fullName, orderId: "fullName"},
    {header: "Car Info", val: el => `${el.vehicle.make} ${el.vehicle.model} ${el.vehicle.year}`},
    {header: "Status", val: el => appointmentStatuses[el.appointmentStatus], orderId: "appointmentStatus"}
]

export const Appointments = () => {
    const { appointments, isLoading, count } = useSelector((state: RootState) => state.appointments);
    const [viewItem, setViewItem] = useState<IListAppointment|undefined>(undefined);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [status, setStatus] = useState<EAppointmentStatus | null | unknown>(null);
    const [date, setDate] = useState<moment.Moment | null>(null);
    const [isFiltersOpen, setFiltersOpen] = useState<boolean>(false);
    const [selectedView, setSelectedView] = useState<TView>("list");
    const [order, setOrder] = useState<IOrder<IListAppointment>>({
        orderBy: "date",
        isAscending: true,
    })
    const {selectedSC} = useSCs();
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();
    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isEditOpen, onClose: onEditClose, onOpen: onEditOpen} = useModal();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const dispatch = useDispatch();

    const refresh = useCallback(() => {
         if (selectedSC) {
            const data: IAppointmentsRequest = {
                pageIndex: pageData.pageIndex,
                pageSize: pageData.pageSize,
                serviceCenterId: selectedSC.id,
                orderBy: order.orderBy,
                isAscending: order.isAscending,
                date,
                status,
                searchTerm,
            }
             dispatch(loadAppointments(data));
        }
    }, [selectedSC, pageData, order, searchTerm, date, status]);

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

    const handleSort = (data: IOrder<IListAppointment>) => () => {
        setOrder(data);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const onFilterOpen = () => {
        setFiltersOpen(prev => !prev);
    }

    const handleSelectStatus = (e: React.ChangeEvent<{value: unknown}>) => {
        setStatus(e.target.value);
    }

    const onDateChange = (date: moment.Moment | null): void => {
        setDate(date)
    }

    const handleChangeView = (type: TView) => () => {
        setSelectedView(type);
    }

    return <>
        <TitleContainer
            title={Titles.Appointments}
            pad
            actions={<AppointmentActions
                onAction={refresh}
                searchTerm={searchTerm}
                selectedView={selectedView}
                handleChangeView={handleChangeView}
                onFilterOpen={onFilterOpen}
                handleSearchChange={handleSearchChange}
                onSearch={refresh}/>}
        />
        {isFiltersOpen ?
            <AppointmentFilters status={status} handleSelectStatus={handleSelectStatus} selectedDate={date} onChange={onDateChange}/>
            : null}
        {selectedView === "list"
            ? <div>
                <Table<IListAppointment>
                    data={appointments}
                    onSort={handleSort}
                    order={order.orderBy}
                    isAscending={order.isAscending}
                    noDataTitle="No upcoming appointments scheduled"
                    isLoading={isLoading}
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
            </div>
            : <AppointmentsCalendar
                selectedView={selectedView}
                onDateChange={onDateChange}
            />
        }
        <AppointmentDialog
            payload={viewItem} onAction={refresh} open={isEditOpen} onClose={onEditClose} />
    </>
};