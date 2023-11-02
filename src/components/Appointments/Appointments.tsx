import React, {useCallback, useEffect, useState} from 'react';
import {Titles} from "../../config/constants";
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {AppointmentActions} from "./AppointmentDialog/AppointmentActions";
import {useModal, useSCs, useStatePagination} from "../../utils/hooks";
import {EAppointmentStatus, IAppointment} from "../../api/types";
import moment from "moment";
import {IOrder} from "../../types/types";
import AppointmentFilters from "./AppointmentFilters";
import {IAppointmentsRequest, TScheduler, TServiceBook} from "../../store/reducers/appointments/types";
import {useDispatch, useSelector} from "react-redux";
import {loadAppointments} from "../../store/reducers/appointments/actions";
import AppointmentsCalendar from "./AppointmentsCalendar";
import AppointmentsListDialog from "./AppointmentsListDialog";
import {AppointmentsTable} from "./AppointmentsTable";
import {RootState} from "../../store/rootReducer";

export type TView = "calendar" | "list";

const initialOrder = {
    orderBy: "date",
    isAscending: true,
}

export const Appointments = () => {
    const { isLoading, schedulerList, serviceBookList } = useSelector((state: RootState) => state.appointments);
    const [viewItem, setViewItem] = useState<IAppointment|undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [status, setStatus] = useState<EAppointmentStatus | '' | unknown>('');
    const [scheduler, setScheduler] = useState<TScheduler|null>(null);
    const [serviceBook, setServiceBook] = useState<TServiceBook|null>(null);
    const [date, setDate] = useState<moment.Moment | null>(null);
    const [isFiltersOpen, setFiltersOpen] = useState<boolean>(false);
    const [selectedView, setSelectedView] = useState<TView>("list");
    const [order, setOrder] = useState<IOrder<IAppointment>>(initialOrder)
    const {selectedSC} = useSCs();
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();
    const {isOpen: isListOpen, onClose: onListClose, onOpen: onListOpen} = useModal();
    const dispatch = useDispatch();

    const getAppointmentsByFilters = useCallback(() => {
         if (selectedSC && selectedView === 'list') {
             const serviceBookId = serviceBook?.id ??  null;
             const isServiceBookServiceCenter = Boolean(serviceBook && !serviceBookId);

             const data: IAppointmentsRequest = {
                 pageIndex: pageData.pageIndex,
                 pageSize: pageData.pageSize,
                 serviceCenterId: selectedSC.id,
                 orderBy: order.orderBy,
                 isAscending: order.isAscending,
                 date: moment(date).add(moment(date).utcOffset(), 'minute'),
                 // @ts-ignore
                 status: EAppointmentStatus[status],
                 scheduler: scheduler ? {id: scheduler.id, type: scheduler.type} : null,
                 serviceBookId,
                 searchTerm,
                 isServiceBookServiceCenter,
            }
             dispatch(loadAppointments(data));
        }
    }, [selectedSC, pageData, order, searchTerm, date, status, selectedView, scheduler, serviceBook]);

    useEffect(() => {
        getAppointmentsByFilters();
    }, []);

    const clearFilters = async () => {
        await setServiceBook(null);
        await setScheduler(null);
        await setDate(null);
        await setStatus('')
    }

    useEffect(() => {
        clearFilters().then(() => getAppointmentsByFilters())
    }, [selectedSC])

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
        if (e.target.value) {
            const selected = serviceBookList.find(item => item.id === e.target.value || item.name === e.target.value)
            setServiceBook(selected ?? null);
        } else {
            setServiceBook(null);
        }
    }

    const handleSelectScheduler = (e: React.ChangeEvent<{value: unknown}>) => {
        if (e.target.value) {
            const selected = schedulerList.find(item => item.id
                ? item.id.toString() === e.target.value
            : item.fullName === e.target.value)
            setScheduler(selected ?? null);
        } else {
            setScheduler(null);
        }
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
                onSearch={getAppointmentsByFilters}/>}
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
                isLoading={isLoading}
                refresh={getAppointmentsByFilters}
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
            refresh={getAppointmentsByFilters}
            order={order}
            setOrder={setOrder}/>
    </>
};