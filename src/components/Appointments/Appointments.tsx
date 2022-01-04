import React, {useCallback, useEffect, useState} from 'react';
import {Titles} from "../../config/constants";
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {AppointmentActions} from "./AppointmentActions";
import {useModal, useSCs, useStatePagination} from "../../utils/hooks";
import {EAppointmentStatus, IListAppointment} from "../../api/types";
import moment from "moment";
import {AppointmentDialog} from "./AppointmentDialog";
import {IOrder} from "../../types/types";
import AppointmentFilters from "./AppointmentFilters";
import {IAppointmentsRequest} from "../../store/reducers/appointments/types";
import {useDispatch} from "react-redux";
import {loadAppointments} from "../../store/reducers/appointments/actions";
import AppointmentsCalendar from "./AppointmentsCalendar";
import AppointmentsListDialog from "./AppointmentsListDialog";
import {AppointmentsTable} from "./AppointmentsTable";

export type TView = "calendar" | "list";

export const Appointments = () => {
    const [viewItem] = useState<IListAppointment|undefined>(undefined);
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
                searchTerm,
            }
             dispatch(loadAppointments(data));
        }
    }, [selectedSC, pageData, order, searchTerm, date, status, selectedView]);

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

    const onDateChange = (date: moment.Moment | null): void => {
        setDate(date)
    }

    const handleChangeView = (type: TView) => () => {
        if (type === "calendar") {
            setFiltersOpen(false);
            setDate(null);
            setStatus(null);
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
            ? <AppointmentsTable
                onEditOpen={onEditOpen}
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
        <AppointmentDialog
            payload={viewItem} onAction={refresh} open={isEditOpen} onClose={onEditClose} />
        <AppointmentsListDialog
            open={isListOpen}
            date={date}
            onClose={onListDialogClose}
            onEditOpen={onEditOpen}
            refresh={refresh}
            order={order}
            setOrder={setOrder}/>
    </>
};