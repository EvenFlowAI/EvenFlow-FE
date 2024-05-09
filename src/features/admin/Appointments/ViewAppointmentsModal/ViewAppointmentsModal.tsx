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
import {Wrapper} from "./styles";
import {useDispatch} from "react-redux";
import {loadAppointmentByKey} from "../../../../store/reducers/appointments/actions";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {encodeSCID} from "../../../../utils/utils";

type TCallbackProps = {
    onEditAppointment: () => void;
    onCancelAppointment: () => void;
}

export const ViewAppointmentsModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps<IAppointment>&TCallbackProps>>> = ({onAction, onEditAppointment, onCancelAppointment, payload, ...props}) => {
    const dispatch = useDispatch()
    const {selectedSC} = useSCs();

    const onClone = () => {
       if (payload?.hashKey && selectedSC) dispatch(loadAppointmentByKey(payload?.hashKey, encodeSCID(selectedSC.id)))
    }

    return <BaseModal {...props} width={940}>
        <DialogTitle onClose={props.onClose}>View Appointment</DialogTitle>
        <DialogContent>
            {!payload
                ? <CircularProgress />
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
            <Button onClick={onClone} color="info" variant="outlined">
                Clone
            </Button>
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
            <Button onClick={props.onClose} color="info">
                Close
            </Button>
        </DialogActions>
    </BaseModal>
};