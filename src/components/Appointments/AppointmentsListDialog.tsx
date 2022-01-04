import React, {useEffect} from 'react';
import {DialogTitle, BaseModal, DialogContent} from "../Modals/BaseModal";
import moment from "moment";
import {DialogProps} from "../Modals/types";
import {useSCs} from "../../utils/hooks";
import {IAppointmentsRequest} from "../../store/reducers/appointments/types";
import {loadAppointments} from "../../store/reducers/appointments/actions";
import {useDispatch} from "react-redux";
import {IListAppointment} from "../../api/types";
import {AppointmentsTable} from "./AppointmentsTable";
import {IOrder} from "../../types/types";

type TDialogProps = DialogProps & {
    date: moment.Moment | null;
    refresh: () => void;
    order: IOrder<IListAppointment>;
    setOrder: React.Dispatch<React.SetStateAction<IOrder<IListAppointment>>>
    onEditOpen: () => void;
}

const AppointmentsListDialog: React.FC<TDialogProps> = (props) => {
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
        <BaseModal {...props} width={850} onClose={props.onClose} onExit={props.onClose}>
            <DialogTitle onClose={props.onClose}>Appointments for {moment(props.date).format('YYYY-MM-DD')}</DialogTitle>
            <DialogContent style={{ overflowY: 'auto' }}>
                <AppointmentsTable
                    refresh={props.refresh}
                    order={props.order}
                    setOrder={props.setOrder}
                    onEditOpen={props.onEditOpen}
                />
            </DialogContent>
        </BaseModal>
    );
};

export default AppointmentsListDialog;