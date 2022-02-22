import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {DialogTitle, BaseModal, DialogContent} from "../Modals/BaseModal";
import moment from "moment";
import {DialogProps} from "../Modals/types";
import {useSCs, useStatePagination} from "../../utils/hooks";
import {IAppointmentsRequest} from "../../store/reducers/appointments/types";
import {loadAppointmentsForModal} from "../../store/reducers/appointments/actions";
import {useDispatch, useSelector} from "react-redux";
import {IAppointmentByQuery} from "../../api/types";
import {AppointmentsTable} from "./AppointmentsTable";
import {IOrder} from "../../types/types";
import {RootState} from "../../store/rootReducer";

type TDialogProps = DialogProps & {
    date: moment.Moment | null;
    refresh: () => void;
    order: IOrder<IAppointmentByQuery>;
    setOrder: React.Dispatch<React.SetStateAction<IOrder<IAppointmentByQuery>>>
    onEditOpen: () => void;
    viewItem?: IAppointmentByQuery|undefined;
    setViewItem?: Dispatch<SetStateAction<IAppointmentByQuery|undefined>>
}

const AppointmentsListDialog: React.FC<TDialogProps> = ({
                                                            date,
                                                            refresh,
                                                            order,
                                                            setOrder,
                                                            onEditOpen,
                                                            viewItem,
                                                            setViewItem,
                                                            ...props}) => {
    const { isModalLoading } = useSelector((state: RootState) => state.appointments);
    const {selectedSC}= useSCs();
    const dispatch = useDispatch();
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();

    useEffect(() => {
        if (selectedSC && props.open && date) {
            const data: IAppointmentsRequest = {
                pageIndex: 0,
                pageSize: 0,
                date: moment(date).add(moment(date).utcOffset(), 'minute'),
                serviceCenterId: selectedSC.id,
            }
            dispatch(loadAppointmentsForModal(data))
        }
    }, [selectedSC, date, props.open])

    return (
        <BaseModal {...props} width={850} onClose={props.onClose} onExit={props.onClose}>
            <DialogTitle onClose={props.onClose}>Appointments for {date ? moment(date).format('YYYY-MM-DD') : ''}</DialogTitle>
            <DialogContent style={{ overflowY: 'auto' }}>
                <AppointmentsTable
                    viewItem={viewItem}
                    isLoading={isModalLoading}
                    refresh={refresh}
                    order={order}
                    pageData={pageData}
                    setOrder={setOrder}
                    onChangePage={onChangePage}
                    onChangeRowsPerPage={onChangeRowsPerPage}
                    onEditOpen={onEditOpen}
                    setViewItem={setViewItem}
                />
            </DialogContent>
        </BaseModal>
    );
};

export default AppointmentsListDialog;