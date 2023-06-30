import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../Modals/BaseModal";
import {
    Button,
    CircularProgress, Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@material-ui/core";
import {DialogProps} from "../Modals/types";
import {AppointmentStatus, IAppointmentByQuery} from "../../api/types";
import {Settings, LocalOffer, Schedule, MonetizationOn} from "@material-ui/icons";
import {getOfferValue} from "../AppointmentFlow/AppointmentSelections/UI";
import moment from "moment";
import {timeSpanString, timeString} from "../../config/constants";

const Info: React.FC<{appointment: IAppointmentByQuery}> = ({appointment}) => {
    return <><ListItem>
            Car info
        </ListItem>
        <ListItem>
            <ListItemText
                primary={appointment.vehicle.vin}
                secondary={`${appointment.vehicle.make} ${appointment.vehicle.model} ${appointment.vehicle.year}`}
            />
        </ListItem>
    </>
}

const ContactInfo: React.FC<{driver: IAppointmentByQuery["driver"]}> = ({driver}) => {
    return <>
        <ListItem>
            Customer info
        </ListItem>
        <ListItem>
            <ListItemText
                primary={driver.fullName}
                secondary={`${driver.email} ${driver.phoneNumber}`}
            />
        </ListItem>
    </>
}

const Offer: React.FC<{offer: IAppointmentByQuery['offer']}> = ({offer}) => {
    if (!offer) {
        return null;
    }
    return <ListItem>
        <ListItemIcon><LocalOffer color="primary" /></ListItemIcon>
        <ListItemText primary={offer.title} secondary={getOfferValue(offer, offer.serviceType?.name || "")} />
    </ListItem>;
}

type TCallbackProps = {
    onEditAppointment: () => void;
    onCancelAppointment: () => void;
}
export const ViewAppointmentDialog: React.FC<DialogProps<IAppointmentByQuery>&TCallbackProps> = ({onAction, onEditAppointment, onCancelAppointment, payload, ...props}) => {
    return <BaseModal {...props} width={500}>
        <DialogTitle onClose={props.onClose}>View Appointment</DialogTitle>
        <DialogContent>
            {!payload
                ? <CircularProgress />
                : <>
                <List dense>
                    <ListItem>
                        <ListItemIcon><Schedule /></ListItemIcon>
                        <ListItemText
                            primary={ `${moment(payload.dateInUtc).utc().format("LL")} ${moment(payload.timeSlot, timeSpanString).format(timeString)}`}
                        />
                    </ListItem>
                    {payload.maintenancePackageOption
                            ? <ListItem key={payload.maintenancePackageOption.name}>
                                <ListItemIcon><Settings /></ListItemIcon>
                                <ListItemText
                                    primary={`Package Name: ${payload.maintenancePackageOption.maintenancePackageName}`}
                                    secondary={payload.maintenancePackageOption.name} />
                            </ListItem>
                            : null
                    }
                    {payload.serviceRequests
                        ? payload.serviceRequests.map(sr => {
                            return <ListItem key={sr.id}>
                                <ListItemIcon><Settings /></ListItemIcon>
                                <ListItemText primary={sr.code} secondary={sr.description} />
                            </ListItem>
                        })
                        : null}
                    {payload.serviceCategories
                        ? payload.serviceCategories.map(category => {
                            return <ListItem key={category.id}>
                                <ListItemIcon><Settings /></ListItemIcon>
                                <ListItemText primary={category.name} />
                            </ListItem>
                        })
                        : null}
                    {payload.recallDescriptions
                        ? payload.recallDescriptions.map(recall => {
                            return <ListItem key={recall}>
                                <ListItemIcon><Settings /></ListItemIcon>
                                <ListItemText primary={recall} />
                            </ListItem>
                        })
                        : null}

                    <Divider />
                    <Info appointment={payload} />
                    <Divider />
                    <ContactInfo driver={payload.driver} />
                    <Divider />
                    <Offer offer={payload.offer}/>
                    {payload.offer ? <Divider /> : null}
                    <ListItem>
                        <ListItemIcon><MonetizationOn /></ListItemIcon>
                        <ListItemText
                            primary="Total"
                            secondary={`$${payload.transactionValue.toFixed(2)}`}
                        />
                    </ListItem>
                </List>
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