import React from 'react';
import {DialogContent} from "../../../../../components/modals/BaseModal/BaseModal";
import {
    customerSegmentsMap,
    dayOfWeekMap,
    EOfferStatus,
    EOfferType,
    IOffer
} from "../../../../../store/reducers/offers/types";
import {Grid, Switch} from "@mui/material";
import {TextField} from "../../../../../components/formControls/TextFieldStyled/TextField";
import moment from "moment";
import {calendarDateFormat, timeSpanString, time12HourFormat} from "../../../../../utils/constants";
import {Label} from "./styles";

export const ViewOffer: React.FC<{
    onArchive: () => void, archiving: boolean, offer: IOffer}> = ({offer, onArchive, archiving}) => {
    const getOfferValue = () => {
        return offer.type !== EOfferType.FreeService ?
            `${offer.value}${offer.type === EOfferType.AmountOff ? "$" : "%"}` :
            offer.serviceType?.name || "";
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
                            ).format(time12HourFormat)} - ${moment(
                                offer.timeOfDay.end, time12HourFormat
                            ).format(time12HourFormat)}`
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        disabled
                        label="Applicable Customer Segment"
                        value={offer.customerSegments.map(s => customerSegmentsMap[s]).join(", ")}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        disabled
                        label="Start Date - End Date"
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