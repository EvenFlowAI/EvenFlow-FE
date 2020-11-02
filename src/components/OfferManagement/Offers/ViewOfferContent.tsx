import React from 'react';
import {DialogContent} from "../../Modals/BaseModal";
import {
    customerSegmentsMap,
    dayOfWeekMap,
    EOfferStatus,
    EOfferType,
    IOffer
} from "../../../store/reducers/offers/types";
import {FormControlLabel, Grid, Switch, withStyles} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import moment from "moment";
import {timeSpanString, timeString} from "../../../config/constants";
import {calendarDateFormat} from "../../Optimizer/EmployeeSchedule/utils";


const Label = withStyles({
    root: {
        marginLeft: 0,
    },
    label: {
        fontWeight: "bold"
    }
})(FormControlLabel);

export const ViewOfferContent: React.FC<{
    onArchive: () => void, archiving: boolean, offer: IOffer}> = ({offer, onArchive, archiving}) => {
    const getOfferValue = () => {
        return offer.type !== EOfferType.FreeService ?
            `${offer.value}${offer.type === EOfferType.AmountOff ? "$" : "%"}` :
            offer.serviceType.map(st => st.name).join(", ");
    }
    return (
        <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Offer Title"
                        disabled
                        value={offer.title}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Offer Value"
                        disabled
                        value={getOfferValue()}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        disabled
                        label="Day of Week"
                        value={offer.dayOfWeeks.map(d => dayOfWeekMap[d]).join(", ")}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Time of Day"
                        disabled
                        value={
                            `${moment(
                                offer.timeOfDay.start, timeSpanString
                            ).format(timeString)} - ${moment(
                                offer.timeOfDay.end, timeString
                            ).format(timeString)}`
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        disabled
                        label="Applicable Customer"
                        value={offer.customerSegments.map(s => customerSegmentsMap[s]).join(", ")}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        disabled
                        label="Duration"
                        value={
                            `${moment(
                                offer.duration.start
                            ).format(calendarDateFormat)} - ${moment(
                                offer.duration.end
                            ).format(calendarDateFormat)}`
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <Label
                        checked={offer.status === EOfferStatus.None}
                        disabled={archiving}
                        onChange={onArchive}
                        label="OFF/ON"
                        labelPlacement="start"
                        control={<Switch color="primary" />}
                    />
                </Grid>
            </Grid>
        </DialogContent>
    );
};