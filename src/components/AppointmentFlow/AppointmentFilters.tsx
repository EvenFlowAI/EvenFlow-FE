import React from 'react';
import {Checkbox, FormControlLabel, Grid, useMediaQuery, useTheme} from "@material-ui/core";
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
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.only("sm"));
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const handleChange = (name: keyof IAppointmentFilters) => (e: any, checked: boolean) => {
        dispatch(setAppointmentFilters({[name]: checked}));
    }
    return <Grid container spacing={2} alignItems={isSM ? "flex-end" : undefined}>
        {selectedAppointmentType === EAppointmentTimingType.SpecialOffers ? <Grid item xs={12} sm={6}>
            <DateSelector date={date} onChange={onDateChange}/>
        </Grid> : null}
        <Grid item xs={12} sm={6} style={{textAlign: isXS ? "center" : undefined}}>
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