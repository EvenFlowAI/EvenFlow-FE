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
import {
    allColumns,
    initialFilters,
    initialOrder,
    localStorageItemName,
    requiredColumns,
} from "./constants";
import ColumnsSelectionModal
    from "../../../components/modals/common/ColumnSelectionModal/ColumnsSelectionModal/ColumnsSelectionModal";
import {useException} from "../../../hooks/useException/useException";

export const Appointments = () => {
    const { isLoading } = useSelector((state: RootState) => state.appointments);
    const [viewItem, setViewItem] = useState<IAppointment|undefined>(undefined);
    const [filters, setFilters] = useState<TFilters>(initialFilters)
    const [isFiltersOpen, setFiltersOpen] = useState<boolean>(true);
    const [selectedView, setSelectedView] = useState<TView>("list");
    const [order, setOrder] = useState<IOrder<IAppointment>>(initialOrder)
    const [search, setSearch] = useState<string>('');
    const [selectedColumns, setSelectedColumns] = useState<string[]>(requiredColumns);
    const {isOpen: isListOpen, onClose: onListClose, onOpen: onListOpen} = useModal();
    const {isOpen: isColumnsOpen, onClose: onColumnsClose, onOpen: onColumnsOpen} = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();

    const getAppointments = useCallback(() => {
        if (!filters.dateTo && !filters.dateFrom) {
            showError("Please select either a “Date From” or a “Date To” value in the appointment filters")
        } else {
            if (filters.dateTo && filters.dateFrom) {
                if (Math.round(dayjs(filters.dateTo).diff(filters.dateFrom) / (1000 * 60 * 60 * 24)) > 90) {
                    showError("The “Date From” and “Date To” range is too large. Please adjust your selections so the range is less than 90 days")
                } else {
                    if (filters.scId && selectedView === 'list' && (filters.initialFiltersSet || !isFiltersOpen)) {
                        const serviceBookId = filters.serviceBook?.id ??  null;
                        const isServiceBookServiceCenter = Boolean(filters.serviceBook && !serviceBookId);
                        const data: IAppointmentsRequest = {
                            pageIndex: filters.pageData.pageIndex,
                            pageSize: filters.pageData.pageSize,
                            serviceCenterId: filters.scId,
                            orderBy: order.orderBy,
                            isAscending: order.isAscending,
                            startDate: dayjs(filters.dateFrom).add(dayjs(filters.dateFrom).utcOffset(), 'minute'),
                            endDate: dayjs(filters.dateTo).add(dayjs(filters.dateTo).utcOffset(), 'minute'),
                            reportingStatuses: filters.reportingStatus,
                            scheduler: filters.scheduler ? {id: filters.scheduler.id, type: filters.scheduler.type} : null,
                            serviceBookId,
                            searchTerm: filters.searchTerm,
                            isServiceBookServiceCenter,
                            dateRangeFilterBy: filters.dateRangeFilterBy,
                        }
                        if (filters.advisor) data.advisorId = filters.advisor.id;
                        if (filters.technician) data.technicianDmsId = filters.technician.dmsId;
                        dispatch(loadAppointments(data));
                    }
                }
            }
        }
    }, [filters, selectedView, order, isFiltersOpen]);

    useEffect(() => {
        setTimeout(() => getAppointments(), 1000)
    }, [getAppointments]);

    useEffect(() => {
        if (selectedSC) {
            setFilters({...initialFilters, scId: selectedSC?.id})
            setSearch('')
        }
    }, [selectedSC, selectedView])

    useEffect(() => {
        const columns = localStorage.getItem(localStorageItemName)
        if (columns) {
            setSelectedColumns(JSON.parse(columns))
        }
    }, [])

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
        }
        setSelectedView(type);
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
        setFilters(prev => ({...prev, searchTerm: search, pageData: {...prev.pageData, pageIndex: 0}}))
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
                onColumnsOpen={onColumnsOpen}
                isFiltersOpen={isFiltersOpen}
                onSearch={onSearch}/>}
        />
        {isFiltersOpen ?
            <AppointmentFilters
                status={filters.reportingStatus}
                setFilters={setFilters}
                scheduler={filters.scheduler}
                serviceBook={filters.serviceBook}
                dateFrom={filters.dateFrom}
                dateTo={filters.dateTo}
                advisor={filters.advisor}
                technician={filters.technician}
                dateRangeType={filters.dateRangeFilterBy}
            />
            : null}
        {selectedView === "list"
            ? <AppointmentsTable
                selectedColumns={selectedColumns}
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
            date={filters.dateFrom}
            viewItem={viewItem}
            setViewItem={setViewItem}
            onClose={onListDialogClose}
            refresh={getAppointments}
            order={order}
            setOrder={setOrder}/>
        <ColumnsSelectionModal
            defaultCheckboxes
            titleAlign="center"
            open={isColumnsOpen}
            onClose={onColumnsClose}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            requiredColumnsNames={requiredColumns}
            columns={allColumns}
            cancelBtnColor='info'
            cancelBtnType="text"
            storageItemName={localStorageItemName}/>
    </>
};