import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../Modals/BaseModal";
import {DialogProps} from "../Modals/types";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {API} from "../../api/api";
import {AppointmentStatus, appointmentStatuses, IListAppointment} from "../../api/types";
import {Table} from "../UI/Table";
import {TableRowDataType} from "../UI/types";
import moment from "moment";
import {MoreHoriz} from "@material-ui/icons";
import {useConfirm, useException, useMessage} from "../../utils/hooks";
import {getAppointmentDate} from "../../utils/utils";


const cols: TableRowDataType<IListAppointment>[] = [
    {
        header: "Date",
        val: el =>
            getAppointmentDate(el).format("LLL")
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
    const [editedItem, setEditedItem] = useState<IListAppointment|null>(null);
    const {askConfirm, closeConfirm} = useConfirm();
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const showError = useException();
    const showMessage = useMessage();

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

    const openMenu = (item: IListAppointment) => (e: React.MouseEvent<HTMLButtonElement>) => {
        setEditedItem(item);
        setAnchorEl(e.currentTarget);
    }

    const cancelAppointment = () => {
        setAnchorEl(null);
        if (editedItem?.appointmentStatus === AppointmentStatus.Cancelled) {
            showError("Appointment is already canceled");
        } else {
            if (editedItem) {
                askConfirm({
                    isRemove: true,
                    confirmContent: "Cancel appointment",
                    title: "Cancel appointment",
                    content: <span>
                        Are you sure want to cancel appointment on <br />
                        {getAppointmentDate(editedItem).format("LLL")}?
                    </span>,
                    onConfirm: handleCancel
                });
            }
        }
    }
    const handleCancel = async () => {
        if (editedItem) {
            try {
                await API.appointment.cancelByKey(editedItem.hashKey);
                setEditedItem(null);
                await loadAppointments(sessionId, serviceCenter?.id||0);
            } catch (e) {
                showError(e);
            }
        }
    }

    const actions = (el: IListAppointment) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }


    return <BaseModal {...props}>
        <DialogTitle>My appointments</DialogTitle>
        <DialogContent>
            <Table<IListAppointment>
                data={appointments}
                noDataTitle="You have no appointments yet"
                isLoading={loading}
                rowData={cols}
                compact
                actions={actions}
                index="id"
            />
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
            {/*<MenuItem onClick={editEmployee}>Edit</MenuItem>*/}
            <MenuItem onClick={cancelAppointment}>Cancel</MenuItem>
        </Menu>
    </BaseModal>
};