import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle, DialogActions} from "../Modals/BaseModal";
import {DialogProps} from "../Modals/types";
import {Button} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {API} from "../../api/api";
import {appointmentStatuses, IListAppointment} from "../../api/types";
import {Table} from "../UI/Table";
import {TableRowDataType} from "../UI/types";
import moment from "moment";


const cols: TableRowDataType<IListAppointment>[] = [
    {
        header: "Date",
        val: el =>
            moment.utc(
                `${String(el.dateInUtc).split("T")[0]}T${el.timeSlot}Z`
            ).format("LLL")
    },
    {
        header: "Status",
        val: el => appointmentStatuses[el.appointmentStatus]
    },
    {
        header: "Price",
        val: el => `$${el.transactionValue.toFixed(2)}`
    }
];

export const MyAppointmentsDialog: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [sessionId, serviceCenter] = useSelector(({appointment}: RootState) => [
        appointment.sessionId,
        appointment.scProfile
    ]);

    const [appointments, setAppointments] = useState<IListAppointment[]>([]);

    const loadAppointments = useCallback(async (sessionId: string, serviceCenterId: number) => {
        setLoading(true);
        try {
            const {data} = await API.appointment.customerList(
            {"session-id": sessionId}, {serviceCenterId}
            );
            setAppointments(data);
        } catch {
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (props.open && sessionId && serviceCenter?.id) {
            loadAppointments(sessionId, serviceCenter.id).finally();
        }
    }, [sessionId, props.open, loadAppointments, serviceCenter]);


    return <BaseModal {...props}>
        <DialogTitle>My appointments</DialogTitle>
        <DialogContent>
            <Table<IListAppointment>
                data={appointments}
                noDataTitle="You have no appointments yet"
                isLoading={loading}
                rowData={cols}
                compact
                index="id"
            />
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
};