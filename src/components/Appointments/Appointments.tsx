import React, {useCallback, useEffect, useState} from 'react';
import {Titles} from "../../config/constants";
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {AppointmentActions} from "./AppointmentDialog/AppointmentActions";
import {useModal, useSCs} from "../../utils/hooks";
import {EAppointmentStatus, IAppointment} from "../../api/types";
import moment from "moment";
import {IOrder, IPageRequest} from "../../types/types";
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

const initialPaging = {pageIndex: 0, pageSize: 10}

type TFilters = {
    searchTerm: string;
    serviceBook: TServiceBook|null;
    scheduler: TScheduler|null;
    status: EAppointmentStatus | '' | unknown;
    date: moment.Moment | null;
    scId: number|null;
    pageData: IPageRequest;
}

const initialFilters = {
    searchTerm: '',
    serviceBook: null,
    scheduler: null,
    status: '',
    date: null,
    scId: null,
    pageData: initialPaging,
}

export const Appointments = () => {
    const { isLoading, schedulerList, serviceBookList } = useSelector((state: RootState) => state.appointments);
    const [viewItem, setViewItem] = useState<IAppointment|undefined>(undefined);
    const [filters, setFilters] = useState<TFilters>(initialFilters)
    const [isFiltersOpen, setFiltersOpen] = useState<boolean>(false);
    const [selectedView, setSelectedView] = useState<TView>("list");
    const [order, setOrder] = useState<IOrder<IAppointment>>(initialOrder)
    const {selectedSC} = useSCs();
    const [search, setSearch] = useState<string>('');
    const {isOpen: isListOpen, onClose: onListClose, onOpen: onListOpen} = useModal();
    const dispatch = useDispatch();

    const getAppointments = useCallback(() => {
        if (filters.scId && selectedView === 'list') {
            const serviceBookId = filters.serviceBook?.id ??  null;
            const isServiceBookServiceCenter = Boolean(filters.serviceBook && !serviceBookId);
            const data: IAppointmentsRequest = {
                pageIndex: filters.pageData.pageIndex,
                pageSize: filters.pageData.pageSize,
                serviceCenterId: filters.scId,
                orderBy: order.orderBy,
                isAscending: order.isAscending,
                date: moment(filters.date).add(moment(filters.date).utcOffset(), 'minute'),
                // @ts-ignore
                status: filters.status ? EAppointmentStatus[filters.status] : undefined,
                scheduler: filters.scheduler ? {id: filters.scheduler.id, type: filters.scheduler.type} : null,
                serviceBookId,
                searchTerm: filters.searchTerm,
                isServiceBookServiceCenter,
            }
            dispatch(loadAppointments(data));
        }
    }, [filters, selectedView, order]);

    useEffect(() => {
        getAppointments();
    }, [getAppointments]);

    useEffect(() => {
        if (selectedSC) {
            setFilters({...initialFilters, scId: selectedSC?.id})
            setSearch('')
        }
    }, [selectedSC, selectedView])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const onFilterOpen = () => {
        setFiltersOpen(prev => !prev);
    }

    const handleSelectStatus = (e: React.ChangeEvent<{value: unknown}>) => {
        setFilters(prev => ({...prev, status: e.target.value, pageData: initialPaging}))
    }

    const handleSelectServiceBook = (e: React.ChangeEvent<{value: unknown}>) => {
        if (e.target.value) {
            const selected = serviceBookList.find(item => item.id === e.target.value || item.name === e.target.value)
            setFilters(prev => ({...prev, serviceBook: selected ?? null, pageData: initialPaging}))
        } else {
            setFilters(prev => ({...prev, serviceBook: null, pageData: initialPaging}))
        }
    }

    const handleSelectScheduler = (e: React.ChangeEvent<{value: unknown}>) => {
        if (e.target.value) {
            const selected = schedulerList.find(item => item.id
                ? item.id.toString() === e.target.value
            : item.fullName === e.target.value)
            setFilters(prev => ({...prev, scheduler: selected ?? null, pageData: initialPaging}))
        } else {
            setFilters(prev => ({...prev, scheduler: null, pageData: initialPaging}))
        }
    }

    const onChangePage = useCallback((e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number): void => {
        setFilters(prev => ({...prev, pageData: {...prev.pageData, pageIndex}}))
    }, []);

    const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        setFilters(prev => ({...prev, pageData: {pageIndex: 0, pageSize: +e.target.value}}))
    }, []);

    const onDateChange = (date: moment.Moment | null): void => {
        setFilters(prev => ({...prev, date, pageData: initialPaging}))
    }

    const handleChangeView = (type: TView) => () => {
        if (type === "calendar") {
            setFiltersOpen(false);
            setSelectedView(type);
        }
    }

    const handleOpenDetails = (date: moment.Moment | null): void => {
        setFilters(prev => ({...prev, date}))
        onListOpen();
    }

    const onListDialogClose = () => {
       onListClose();
       setTimeout(() => setFilters(prev => ({...prev, date: null})));
    }

    const onSearch = useCallback(() => {
        setFilters(prev => ({...prev, searchTerm: search, pageData: initialPaging}))
    }, [search])

    return <>
        <TitleContainer
            title={Titles.Appointments}
            pad
            actions={<AppointmentActions
                searchTerm={search}
                selectedView={selectedView}
                handleChangeView={handleChangeView}
                onFilterOpen={onFilterOpen}
                handleSearchChange={handleSearchChange}
                onSearch={onSearch}/>}
        />
        {isFiltersOpen ?
            <AppointmentFilters
                status={filters.status}
                handleSelectStatus={handleSelectStatus}
                handleSelectServiceBook={handleSelectServiceBook}
                handleSelectScheduler={handleSelectScheduler}
                scheduler={filters.scheduler}
                serviceBook={filters.serviceBook}
                selectedDate={filters.date}
                onChange={onDateChange}
            />
            : null}
        {selectedView === "list"
            ? <AppointmentsTable
                viewItem={viewItem}
                setViewItem={setViewItem}
                isLoading={isLoading}
                refresh={getAppointments}
                order={order}
                setOrder={setOrder}
                pageData={filters.pageData}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
            />
            : <AppointmentsCalendar
                openDetails={handleOpenDetails}
                selectedView={selectedView}
            />
        }
        <AppointmentsListDialog
            open={isListOpen}
            date={filters.date}
            viewItem={viewItem}
            setViewItem={setViewItem}
            onClose={onListDialogClose}
            refresh={getAppointments}
            order={order}
            setOrder={setOrder}/>
    </>
};