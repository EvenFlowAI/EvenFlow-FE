import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {loadAppointments} from "../../../store/reducers/appointments/actions";
import {AppointmentActions} from "./AppointmentActions/AppointmentActions";
import {AppointmentFilters} from "./AppointmentFilters/AppointmentFilters";
import {AppointmentsCalendar} from "./AppointmentsCalendar/AppointmentsCalendar";
import {AppointmentsListModal} from "./AppointmentsListModal/AppointmentsListModal";
import {AppointmentsTable} from "./AppointmentsTable/AppointmentsTable";
import {RootState} from "../../../store/rootReducer";
import {IAppointmentsRequest} from "../../../store/reducers/appointments/types";
import {IAppointment} from "../../../api/types";
import {IOrder, Titles, TParsableDate} from "../../../types/types";
import {TFilters, TView} from "./types";
import {useModal} from "../../../hooks/useModal/useModal";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import dayjs from "dayjs";
import {initialFilters, initialOrder, initialPaging} from "./constants";

export const Appointments = () => {
    const { isLoading } = useSelector((state: RootState) => state.appointments);
    const [viewItem, setViewItem] = useState<IAppointment|undefined>(undefined);
    const [filters, setFilters] = useState<TFilters>(initialFilters)
    const [isFiltersOpen, setFiltersOpen] = useState<boolean>(true);
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
                date: dayjs(filters.date).add(dayjs(filters.date).utcOffset(), 'minute'),
                reportingStatus: filters.reportingStatus,
                scheduler: filters.scheduler ? {id: filters.scheduler.id, type: filters.scheduler.type} : null,
                serviceBookId,
                searchTerm: filters.searchTerm,
                isServiceBookServiceCenter,
            }
            if (filters.advisor) data.advisorId = filters.advisor.id;
            if (filters.technician) data.technicianDmsId = filters.technician.dmsId;
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

    const onChangePage = useCallback((e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number): void => {
        setFilters(prev => ({...prev, pageData: {...prev.pageData, pageIndex}}))
    }, []);

    const onChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        setFilters(prev => ({...prev, pageData: {pageIndex: 0, pageSize: +e.target.value}}))
    }, []);

    const handleChangeView = (type: TView) => () => {
        if (type === "calendar") {
            setFiltersOpen(false);
            setSelectedView(type);
        }
    }

    const handleOpenDetails = (date: TParsableDate): void => {
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
                status={filters.reportingStatus}
                setFilters={setFilters}
                scheduler={filters.scheduler}
                serviceBook={filters.serviceBook}
                selectedDate={filters.date}
                advisor={filters.advisor}
                technician={filters.technician}
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
        <AppointmentsListModal
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