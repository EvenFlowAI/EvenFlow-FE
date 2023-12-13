import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/Modals/BaseModal";
import {
    Button,
    CircularProgress,
} from "@material-ui/core";
import {DialogProps} from "../../../components/Modals/types";
import {AppointmentStatus, IAppointment} from "../../../api/types";
import AppointmentDetails from "./parts/AppointmentDetails";
import {CustomerInfo, VehicleDetails} from "./parts/VehicleDetails";
import OperationalDetails from "./parts/OperationalDetails";
import {Wrapper} from "./styles";

type TCallbackProps = {
    onEditAppointment: () => void;
    onCancelAppointment: () => void;
}

export const ViewAppointmentsModal: React.FC<DialogProps<IAppointment>&TCallbackProps> = ({onAction, onEditAppointment, onCancelAppointment, payload, ...props}) => {
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
            <Button onClick={props.onClose}>
                Close
            </Button>
        </DialogActions>
    </BaseModal>
};