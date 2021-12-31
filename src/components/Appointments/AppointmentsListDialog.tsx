import React, {useEffect} from 'react';
import {DialogTitle, BaseModal, DialogContent} from "../Modals/BaseModal";
import moment from "moment";
import {DialogProps} from "../Modals/types";
import {useSCs} from "../../utils/hooks";
import {IAppointmentsRequest} from "../../store/reducers/appointments/types";
import {loadAppointments} from "../../store/reducers/appointments/actions";
import {useDispatch, useSelector} from "react-redux";
import {appointmentStatuses, IListAppointment} from "../../api/types";
import {Table} from "../UI/Table";
import {RootState} from "../../store/rootReducer";
import {TableRowDataType} from "../UI/types";
import {timeSpanString, timeString} from "../../config/constants";

type TDialogProps = DialogProps & {
    date: moment.Moment | null;
}

const cols: TableRowDataType<IListAppointment>[] = [
    {header: "Date", val: el => moment.utc(el.dateInUtc).format("LL"), orderId: "date"},
    {header: "Time", val: el => moment(el.timeSlot, timeSpanString).format(timeString)},
    {header: "Full Name", val: el => el.driver.fullName, orderId: "fullName"},
    {header: "Car Info", val: el => `${el.vehicle.make} ${el.vehicle.model} ${el.vehicle.year}`},
    {header: "Status", val: el => appointmentStatuses[el.appointmentStatus], orderId: "appointmentStatus"}
]

const AppointmentsListDialog: React.FC<TDialogProps> = (props) => {
    const {appointments, isLoading} = useSelector((state: RootState) => state.appointments);
    const {selectedSC}= useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC && props.open && props.date) {
            const data: IAppointmentsRequest = {
                pageIndex: 0,
                pageSize: 0,
                date: moment(props.date).set('hour', 8),
                serviceCenterId: selectedSC.id,
            }
            dispatch(loadAppointments(data));
        }
    }, [selectedSC, props.date, props.open])

    return (
        <BaseModal {...props} width={800}>
            <DialogTitle onClose={props.onClose}>Appointments for {moment(props.date).format('YYYY-MM-DD')}</DialogTitle>
            <DialogContent>
                <Table<IListAppointment>
                    data={appointments}
                    noDataTitle="No upcoming appointments scheduled"
                    isLoading={isLoading}
                    rowData={cols}
                    index="id"
                    hidePagination
                />
            </DialogContent>
        </BaseModal>
    );
};

export default AppointmentsListDialog;