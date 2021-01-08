import React from 'react';
import {Checkbox, FormControlLabel, Grid} from "@material-ui/core";
import moment from "moment";
import {DateSelector} from "./DateSelector";
import {EAppointmentTimingType, IAppointmentFilters} from "../../store/reducers/appointment/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {setAppointmentFilters} from "../../store/reducers/appointment/actions";

type TProps = {
    date: moment.Moment;
    onDateChange: (nDate: moment.Moment) => void;
}
export const AppointmentFilters: React.FC<TProps> = ({date, onDateChange}) => {
    const [selectedAppointmentType, filters] = useSelector((state: RootState) => [
        state.appointment.s3Data.appointmentType,
        state.appointment.appointmentFilters
    ]);
    const dispatch = useDispatch();

    const handleChange = (name: keyof IAppointmentFilters) => (e: any, checked: boolean) => {
        dispatch(setAppointmentFilters({[name]: checked}));
    }
    return <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
            {selectedAppointmentType === EAppointmentTimingType.SpecialOffers ?
            <DateSelector date={date} onChange={onDateChange}/> : null }
        </Grid>
        <Grid item xs={12} sm={6}>
            <FormControlLabel
                control={<Checkbox
                    color="primary"
                    checked={filters.offersOnly}
                    onChange={handleChange("offersOnly")}
                />}
                label="Only Offers"
            />
            <FormControlLabel
                control={<Checkbox
                    color="primary"
                    onChange={handleChange("waitTimeOnly")}
                    checked={filters.waitTimeOnly}
                />}
                label="Only Wait time"
            />
        </Grid>
    </Grid>
};