import React, {useEffect, useState} from 'react';
import {timeSpanString, timeString, Titles} from "../../config/constants";
import {TitleContainer} from "../Content/TitleContainer/TitleContainer";
import {AppointmentActions} from "./AppointmentActions";
import {useModal, useSCs, useStatePagination} from "../../utils/hooks";
import {IListAppointment} from "../../api/types";
import {API} from "../../api/api";
import {TableRowDataType} from "../UI/types";
import {Table} from "../UI/Table";
import moment from "moment";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {AppointmentDialog} from "./AppointmentDialog";

const cols: TableRowDataType<IListAppointment>[] = [
    {header: "Date", val: el => moment.utc(el.dateInUtc).format("LL")},
    {header: "Time", val: el => moment(el.timeSlot, timeSpanString).format(timeString)},
    {header: "Full Name", val: el => el.driver.fullName},
    {header: "Car Info", val: el => `${el.vehicle.make} ${el.vehicle.model} ${el.vehicle.year}`}
]

export const Appointments = () => {
    const [appointments, setAppointments] = useState<IListAppointment[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [editedItem, setEditedItem] = useState<IListAppointment|undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const {selectedSC} = useSCs();
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();
    const {isOpen, onClose, onOpen} = useModal();

    useEffect(() => {
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

    const handleMenuOpen = (el: IListAppointment) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchorEl(e.currentTarget);
        setEditedItem(el);
    }
    const editAppointment = () => {
        onOpen();
        setAnchorEl(null);
    }

    const actions = (el: IListAppointment) => {
        return <IconButton
            size="small"
            onClick={handleMenuOpen(el)}>
            <MoreHoriz />
        </IconButton>
    }

    return <>
        <TitleContainer title={Titles.Appointments} pad actions={<AppointmentActions />} />
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
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={editAppointment}>Edit</MenuItem>
        </Menu>
        <AppointmentDialog open={isOpen} payload={editedItem} onClose={onClose} />
    </>
};