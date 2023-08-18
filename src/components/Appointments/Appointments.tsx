import React, {useCallback, useEffect, useState} from 'react';
import {Titles} from "../../config/constants";
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {AppointmentActions} from "./AppointmentDialog/AppointmentActions";
import {useModal, useSCs, useStatePagination} from "../../utils/hooks";
import {EAppointmentStatus, IAppointment} from "../../api/types";
import moment from "moment";
import {IOrder} from "../../types/types";
import AppointmentFilters from "./AppointmentFilters";
import {IAppointmentsRequest} from "../../store/reducers/appointments/types";
import {useDispatch, useSelector} from "react-redux";
import {loadAppointments} from "../../store/reducers/appointments/actions";
import AppointmentsCalendar from "./AppointmentsCalendar";
import AppointmentsListDialog from "./AppointmentsListDialog";
import {AppointmentsTable} from "./AppointmentsTable";
import {RootState} from "../../store/rootReducer";

export type TView = "calendar" | "list";

export const Appointments = () => {
    const { isLoading } = useSelector((state: RootState) => state.appointments);
    const [viewItem, setViewItem] = useState<IAppointment|undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [status, setStatus] = useState<EAppointmentStatus | '' | unknown>('');
    const [scheduler, setScheduler] = useState<string| unknown>('');
    const [serviceBook, setServiceBook] = useState<string| unknown>('');
    const [date, setDate] = useState<moment.Moment | null>(null);
    const [isFiltersOpen, setFiltersOpen] = useState<boolean>(false);
    const [selectedView, setSelectedView] = useState<TView>("list");
    const [order, setOrder] = useState<IOrder<IAppointment>>({
        orderBy: "date",
        isAscending: true,
    })
    const {selectedSC} = useSCs();
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();
    const {isOpen: isEditOpen, onClose: onEditClose, onOpen: onEditOpen} = useModal();
    const {isOpen: isListOpen, onClose: onListClose, onOpen: onListOpen} = useModal();
    const dispatch = useDispatch();

    const refresh = useCallback(() => {
         if (selectedSC && selectedView === 'list') {
            const data: IAppointmentsRequest = {
                pageIndex: pageData.pageIndex,
                pageSize: pageData.pageSize,
                serviceCenterId: selectedSC.id,
                orderBy: order.orderBy,
                isAscending: order.isAscending,
                date: moment(date).add(moment(date).utcOffset(), 'minute'),
                // @ts-ignore
                status: EAppointmentStatus[status],
                scheduler,
                serviceBookId: 139,
                searchTerm,
            }
             dispatch(loadAppointments(data));
        }
    }, [selectedSC, pageData, order, searchTerm, date, status, selectedView, scheduler, serviceBook]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const onFilterOpen = () => {
        setFiltersOpen(prev => !prev);
    }

    const handleSelectStatus = (e: React.ChangeEvent<{value: unknown}>) => {
        setStatus(e.target.value);
    }

    const handleSelectServiceBook = (e: React.ChangeEvent<{value: unknown}>) => {
        setServiceBook(e.target.value);
    }

    const handleSelectScheduler = (e: React.ChangeEvent<{value: unknown}>) => {
        setScheduler(e.target.value);
    }

    const onDateChange = (date: moment.Moment | null): void => {
        setDate(date)
    }

    const handleChangeView = (type: TView) => () => {
        if (type === "calendar") {
            setFiltersOpen(false);
            setDate(null);
            setStatus('');
        }
        setSelectedView(type);
    }

    const handleOpenDetails = (date: moment.Moment | null): void => {
        setDate(date);
        onListOpen();
    }

    const onListDialogClose = () => {
       onListClose();
       setTimeout(() => setDate(null));
    }

    return <>
        <TitleContainer
            title={Titles.Appointments}
            pad
            actions={<AppointmentActions
                searchTerm={searchTerm}
                selectedView={selectedView}
                handleChangeView={handleChangeView}
                onFilterOpen={onFilterOpen}
                handleSearchChange={handleSearchChange}
                onSearch={refresh}/>}
        />
        {isFiltersOpen ?
            <AppointmentFilters
                status={status}
                handleSelectStatus={handleSelectStatus}
                handleSelectServiceBook={handleSelectServiceBook}
                handleSelectScheduler={handleSelectScheduler}
                scheduler={scheduler}
                serviceBook={serviceBook}
                selectedDate={date}
                onChange={onDateChange}
            />
            : null}
        {selectedView === "list"
            ? <AppointmentsTable
                viewItem={viewItem}
                setViewItem={setViewItem}
                onEditOpen={onEditOpen}
                isLoading={isLoading}
                refresh={refresh}
                order={order}
                setOrder={setOrder}
                pageData={pageData}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
            />
            : <AppointmentsCalendar
                openDetails={handleOpenDetails}
                selectedView={selectedView}
            />
        }
        {/*<AppointmentDialog*/}
        {/*    payload={viewItem} onAction={refresh} open={isEditOpen} onClose={onEditClose} />*/}
        <AppointmentsListDialog
            open={isListOpen}
            date={date}
            viewItem={viewItem}
            setViewItem={setViewItem}
            onClose={onListDialogClose}
            onEditOpen={onEditOpen}
            refresh={refresh}
            order={order}
            setOrder={setOrder}/>
    </>
};