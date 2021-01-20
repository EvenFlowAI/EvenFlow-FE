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
import {IListAppointment} from "../../api/types";
import {Settings, LocalOffer, Schedule, MonetizationOn} from "@material-ui/icons";
import {getOfferValue} from "../AppointmentFlow/AppointmentSelections/UI";
import moment from "moment";
import {timeSpanString, timeString} from "../../config/constants";

const Info: React.FC<{appointment: IListAppointment}> = ({appointment}) => {
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

const ContactInfo: React.FC<{driver: IListAppointment["driver"]}> = ({driver}) => {
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

const Offer: React.FC<{offer: IListAppointment['offer']}> = ({offer}) => {
    if (!offer) {
        return null;
    }
    return <ListItem>
        <ListItemIcon><LocalOffer color="primary" /></ListItemIcon>
        <ListItemText primary={offer.title} secondary={getOfferValue(offer, offer.serviceType?.name || "")} />
    </ListItem>;
}

export const ViewAppointmentDialog: React.FC<DialogProps<IListAppointment>> = ({onAction, payload, ...props}) => {
    return <BaseModal {...props} width={500}>
        <DialogTitle onClose={props.onClose}>View Appointment</DialogTitle>
        <DialogContent>
            {!payload ? <CircularProgress /> : <>
                <List dense>
                    <ListItem>
                        <ListItemIcon><Schedule /></ListItemIcon>
                        <ListItemText
                            primary={ `${moment(payload.dateInUtc).format("LL")} ${moment(payload.timeSlot, timeSpanString).format(timeString)}`}
                        />
                    </ListItem>
                    {payload.serviceRequests.map(sr => {
                        return <ListItem>
                            <ListItemIcon><Settings /></ListItemIcon>
                            <ListItemText primary={sr.code} secondary={sr.description} />
                        </ListItem>
                    })}
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
            <Button onClick={props.onClose}>
                Close
            </Button>
        </DialogActions>
    </BaseModal>
};