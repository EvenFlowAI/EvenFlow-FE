import React, {useCallback, useEffect, useState} from 'react';
import {timeSpanString, timeString, Titles} from "../../config/constants";
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {AppointmentActions} from "./AppointmentActions";
import {useModal, useSCs, useStatePagination} from "../../utils/hooks";
import {IListAppointment} from "../../api/types";
import {API} from "../../api/api";
import {TableRowDataType} from "../UI/types";
import {Table} from "../UI/Table";
import moment from "moment";
import {IconButton} from "@material-ui/core";
import {Visibility} from "@material-ui/icons";
import {ViewAppointmentDialog} from "./ViewAppointmentDialog";

const cols: TableRowDataType<IListAppointment>[] = [
    {header: "Date", val: el => moment.utc(el.dateInUtc).format("LL")},
    {header: "Time", val: el => moment(el.timeSlot, timeSpanString).format(timeString)},
    {header: "Full Name", val: el => el.driver.fullName},
    {header: "Car Info", val: el => `${el.vehicle.make} ${el.vehicle.model} ${el.vehicle.year}`}
]

export const Appointments = () => {
    const [appointments, setAppointments] = useState<IListAppointment[]>([]);
    const [viewItem, setViewItem] = useState<IListAppointment|undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const {selectedSC} = useSCs();
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();
    const {isOpen, onClose, onOpen} = useModal();

    const refresh = useCallback(() => {
         if (selectedSC) {
            setLoading(true);
            API.appointment.list({
                pageIndex: pageData.pageIndex,
                pageSize: pageData.pageSize,
                serviceCenterId: selectedSC.id
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

    const handleView = (el: IListAppointment) => () => {
        setViewItem(el);
        onOpen();
    }

    const actions = (el: IListAppointment) => {
        return <IconButton
            size="small"
            onClick={handleView(el)}>
            <Visibility />
        </IconButton>
    }

    return <>
        <TitleContainer title={Titles.Appointments} pad actions={<AppointmentActions onAction={refresh} />} />
        <Table<IListAppointment>
            data={appointments}
            noDataTitle="No employees present"
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
        <ViewAppointmentDialog open={isOpen} payload={viewItem} onClose={onClose} />
    </>
};