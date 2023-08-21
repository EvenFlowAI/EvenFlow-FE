import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../Modals/BaseModal";
import {DialogProps} from "../Modals/types";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {API} from "../../api/api";
import {AppointmentStatus, appointmentStatuses, IAppointment} from "../../api/types";
import {Table} from "../UI/Table";
import {TableRowDataType} from "../UI/types";
import {MoreHoriz} from "@material-ui/icons";
import {useConfirm, useException, useMessage} from "../../utils/hooks";
import {encodeSCID, getAppointmentDate} from "../../utils/utils";
import {saveAppointmentReducer} from "../../store/reducers/appointment/actions";
import {Routes} from "../../config/routes";
import {useHistory} from "react-router-dom";
import moment from "moment";


const cols: TableRowDataType<IAppointment>[] = [
    {
        header: "Date",
        val: el =>
            moment(el.dateTime).format("LLL")
    },
    {
        header: "Status",
        val: el => appointmentStatuses[el.appointmentStatus]
    },
    // {
    //     header: "Vehicle",
    //     val: el => getAppointmentVehicle(el)
    // },
    {
        header: "Price",
        val: el => `$${el.totalValue.toFixed(2)}`
    }
];

export const MyAppointmentsDialog: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [sessionId, serviceCenter] = useSelector(({appointment}: RootState) => [
        appointment.sessionId,
        appointment.scProfile
    ]);
    const [editedItem, setEditedItem] = useState<IAppointment|null>(null);
    const {askConfirm} = useConfirm();
    const [anchorEl, setAnchorEl] = useState<EventTarget&HTMLButtonElement|null>(null);
    const showError = useException();
    const history = useHistory();
    const dispatch = useDispatch();
    const showMessage = useMessage();

    const [appointments, setAppointments] = useState<IAppointment[]>([]);

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

    const openMenu = (item: IAppointment) => (e: React.MouseEvent<HTMLButtonElement>) => {
        setEditedItem(item);
        setAnchorEl(e.currentTarget);
    }

    const editAppointment = async () => {
        setAnchorEl(null);
        if (editedItem && serviceCenter) {
            //await dispatch(loadEditAppointment(editedItem));
            await dispatch(saveAppointmentReducer());
            history.replace(`${Routes.EndUser.AppointmentBase}/${encodeSCID(serviceCenter.id)}`);
            window.location.reload();
        }
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
                        Please confirm you want to cancel appointment on <br />
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
                showMessage(
                    <div>
                        Your appointment has been canceled. <br/>
                        Please do not forget to update the appointment in your calendar.
                    </div>
                );
                await loadAppointments(sessionId, serviceCenter?.id||0);
            } catch (e) {
                showError(e);
            }
        }
    }

    const actions = (el: IAppointment) => {
        return <IconButton
            disabled={
                el.appointmentStatus === AppointmentStatus.Cancelled || !el.isEditable
            }
            onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }


    return <BaseModal {...props}>
        <DialogTitle>My appointments</DialogTitle>
        <DialogContent>
            <Table<IAppointment>
                data={appointments}
                noDataTitle="You have no appointments yet"
                isLoading={loading}
                rowData={cols}
                hidePagination
                compact
                actions={actions}
                index="id"
            />
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
        <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={editAppointment}>Edit</MenuItem>
            <MenuItem onClick={cancelAppointment}>Cancel</MenuItem>
        </Menu>
    </BaseModal>
};