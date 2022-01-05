import React, {useEffect} from 'react';
import {DialogTitle, BaseModal, DialogContent} from "../Modals/BaseModal";
import moment from "moment";
import {DialogProps} from "../Modals/types";
import {useSCs, useStatePagination} from "../../utils/hooks";
import {IAppointmentsRequest} from "../../store/reducers/appointments/types";
import {loadAppointmentsForModal} from "../../store/reducers/appointments/actions";
import {useDispatch, useSelector} from "react-redux";
import {IListAppointment} from "../../api/types";
import {AppointmentsTable} from "./AppointmentsTable";
import {IOrder} from "../../types/types";
import {RootState} from "../../store/rootReducer";

type TDialogProps = DialogProps & {
    date: moment.Moment | null;
    refresh: () => void;
    order: IOrder<IListAppointment>;
    setOrder: React.Dispatch<React.SetStateAction<IOrder<IListAppointment>>>
    onEditOpen: () => void;
}

const AppointmentsListDialog: React.FC<TDialogProps> = (props) => {
    const { isModalLoading } = useSelector((state: RootState) => state.appointments);
    const {selectedSC}= useSCs();
    const dispatch = useDispatch();
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();

    useEffect(() => {
        if (selectedSC && props.open && props.date) {
            const data: IAppointmentsRequest = {
                pageIndex: 0,
                pageSize: 0,
                date: moment(props.date).add(moment(props.date).utcOffset(), 'minute'),
                serviceCenterId: selectedSC.id,
            }
            dispatch(loadAppointmentsForModal(data))
        }
    }, [selectedSC, props.date, props.open])

    return (
        <BaseModal {...props} width={850} onClose={props.onClose} onExit={props.onClose}>
            <DialogTitle onClose={props.onClose}>Appointments for {props.date ? moment(props.date).format('YYYY-MM-DD') : ''}</DialogTitle>
            <DialogContent style={{ overflowY: 'auto' }}>
                <AppointmentsTable
                    isLoading={isModalLoading}
                    refresh={props.refresh}
                    order={props.order}
                    pageData={pageData}
                    setOrder={props.setOrder}
                    onChangePage={onChangePage}
                    onChangeRowsPerPage={onChangeRowsPerPage}
                    onEditOpen={props.onEditOpen}
                />
            </DialogContent>
        </BaseModal>
    );
};

export default AppointmentsListDialog;