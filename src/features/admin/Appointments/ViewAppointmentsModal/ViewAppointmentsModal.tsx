import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {
    Button,
    CircularProgress,
} from "@mui/material";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {AppointmentStatus, IAppointment} from "../../../../api/types";
import {AppointmentDetails} from "./AppointmentDetails/AppointmentDetails";
import {VehicleDetails} from "./VehicleDetails/VehicleDetails";
import {CustomerInfo} from "./CustomerInfo/CustomerInfo";
import {OperationalDetails} from "./OperationalDetails/OperationalDetails";
import {LoaderWrapper, Wrapper} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {loadAppointmentByKey} from "../../../../store/reducers/appointments/actions";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {encodeSCID} from "../../../../utils/utils";
import {useModal} from "../../../../hooks/useModal/useModal";
import Informing from "../../../../components/modals/common/Informing/Informing";
import CloneAppointmentModal from "../CloneAppointmentModal/CloneAppointmentModal";
import {ReactComponent as Warning} from "../../../../assets/img/warning_icon.svg";
import {RootState} from "../../../../store/rootReducer";

type TCallbackProps = {
    onEditAppointment: () => void;
    onCancelAppointment: () => void;
}

export const ViewAppointmentsModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps<IAppointment>&TCallbackProps>>> = ({onAction, onEditAppointment, onCancelAppointment, payload, ...props}) => {
    const {isAppointmentLoading} = useSelector((state: RootState) => state.appointments);
    const dispatch = useDispatch()
    const {selectedSC} = useSCs();
    const {onOpen, isOpen, onClose} = useModal();
    const {onOpen: onOpenClone, isOpen: isOpenClone, onClose: onCloseClone} = useModal();

    const onGetSlots = (isEmptyList: boolean) => {
        isEmptyList ? onOpen() : onOpenClone()
    }

    const onClone = async () => {
       if (payload?.hashKey && selectedSC) {
           await dispatch(loadAppointmentByKey(payload?.hashKey, encodeSCID(selectedSC.id), onGetSlots))
       } else {
           onOpen();
       }
    }

    return <BaseModal {...props} width={940}>
        <DialogTitle onClose={props.onClose}>View Appointment</DialogTitle>
        <DialogContent>
            {!payload || isAppointmentLoading
                ? <LoaderWrapper><CircularProgress /></LoaderWrapper>
                : <>
                <Wrapper>
                    <AppointmentDetails payload={payload}/>
                    <div>
                        <VehicleDetails payload={payload}/>
                        <CustomerInfo payload={payload}/>
                        <OperationalDetails payload={payload}/>
                    </div>
                </Wrapper>
            </>}
        </DialogContent>
        <DialogActions>
            <Button
                onClick={onCancelAppointment}
                disabled={
                    payload?.appointmentStatus === AppointmentStatus.Cancelled || !payload?.isEditable
                }
                color="secondary"
                variant="outlined">
                Cancel Appointment
            </Button>
            <Button
                onClick={onEditAppointment}
                disabled={
                    payload?.appointmentStatus === AppointmentStatus.Cancelled || !payload?.isEditable
                }
                color="primary"
                variant="outlined">
                Edit
            </Button>
            <Button onClick={onClone} variant="outlined" style={{color: '#5FA077', borderColor: "#5FA077"}}>
                Clone
            </Button>
            <Button onClick={props.onClose} color="info">
                Close
            </Button>
        </DialogActions>
        <Informing
            icon={<Warning/>}
            open={isOpen}
            onClose={onClose}
            title={`We are sorry but this appointment \n 
            was made outside of EvenFlow \n 
            and is not able to be cloned.`}
        />
        <CloneAppointmentModal open={isOpenClone} onClose={onCloseClone}/>
    </BaseModal>
};