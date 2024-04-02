import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {DialogTitle, BaseModal, DialogContent} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {IAppointmentsRequest} from "../../../../store/reducers/appointments/types";
import {useDispatch, useSelector} from "react-redux";
import {IAppointment} from "../../../../api/types";
import {AppointmentsTable} from "../AppointmentsTable/AppointmentsTable";
import {IOrder, TParsableDate} from "../../../../types/types";
import {RootState} from "../../../../store/rootReducer";
import {useStatePagination} from "../../../../hooks/usePaginations/usePaginations";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import dayjs from "dayjs";
import {allColumns} from "../constants";

type TDialogProps = DialogProps & {
    date: TParsableDate;
    refresh: () => void;
    order: IOrder<IAppointment>;
    setOrder: React.Dispatch<React.SetStateAction<IOrder<IAppointment>>>
    viewItem?: IAppointment|undefined;
    setViewItem?: Dispatch<SetStateAction<IAppointment|undefined>>
}

export const AppointmentsListModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TDialogProps>>> = ({
                                                            date,
                                                            refresh,
                                                            order,
                                                            setOrder,
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
                pageIndex: pageData.pageIndex,
                pageSize: pageData.pageSize,
                date: dayjs(date).add(dayjs(date).utcOffset(), 'minute'),
                serviceCenterId: selectedSC.id,
            }
            // todo uncomment for calendar functionality
         //   dispatch(loadAppointmentsForModal(data))
        }
    }, [selectedSC, date, props.open, pageData])

    return (
        <BaseModal {...props} width={1200} onClose={props.onClose}>
            <DialogTitle onClose={props.onClose}>Appointments for {date ? dayjs(date).format('YYYY-MM-DD') : ''}</DialogTitle>
            <DialogContent style={{ overflowY: 'auto' }}>
                <AppointmentsTable
                    selectedColumns={allColumns}
                    viewItem={viewItem}
                    isLoading={isModalLoading}
                    refresh={refresh}
                    order={order}
                    pageData={pageData}
                    setOrder={setOrder}
                    onChangePage={onChangePage}
                    onChangeRowsPerPage={onChangeRowsPerPage}
                    setViewItem={setViewItem}
                />
            </DialogContent>
        </BaseModal>
    );
};