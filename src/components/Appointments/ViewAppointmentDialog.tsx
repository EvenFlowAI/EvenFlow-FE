import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../Modals/BaseModal";
import {
    Button,
    CircularProgress,
    styled
} from "@material-ui/core";
import {DialogProps} from "../Modals/types";
import {AppointmentStatus, IAppointment} from "../../api/types";
import AppointmentDetails from "./AppointmentDialog/parts/AppointmentDetails";
import {CustomerInfo, VehicleDetails} from "./AppointmentDialog/parts/VehicleDetails";
import OperationalDetails from "./AppointmentDialog/parts/OperationalDetails";

const Wrapper = styled('div')({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: 24,
})

type TCallbackProps = {
    onEditAppointment: () => void;
    onCancelAppointment: () => void;
}
export const ViewAppointmentDialog: React.FC<DialogProps<IAppointment>&TCallbackProps> = ({onAction, onEditAppointment, onCancelAppointment, payload, ...props}) => {
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