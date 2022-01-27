import React from 'react';
import {Grid} from "@material-ui/core";
import {TextField} from "../../../UI/TextField";
import {TForm} from "../AppointmentDialog";

type TDriverInfoProps = {
    form: TForm;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    errors: string[];
}

const DriverInfo: React.FC<TDriverInfoProps> = ({ handleChange, form, errors }) => {
    return (
        <React.Fragment>
            <Grid item xs={12}>
                <h3>Driver info</h3>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Driver name"
                    id="driverName"
                    name="driverName"
                    fullWidth
                    placeholder="Enter Driver Name"
                    onChange={handleChange}
                    value={form.driverName}
                    error={errors.includes("driverName")}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Driver email"
                    value={form.driverEmail}
                    id="driverEmail"
                    placeholder="Enter Driver Email"
                    name="driverEmail"
                    onChange={handleChange}
                    error={errors.includes("driverEmail")}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Phone number"
                    value={form.driverPhoneNumber}
                    id="driverPhoneNumber"
                    placeholder="Enter Driver Phone Number"
                    name="driverPhoneNumber"
                    error={errors.includes("driverPhoneNumber")}
                    onChange={handleChange}
                    fullWidth
                />
            </Grid>
        </React.Fragment>
    );
};

export default DriverInfo;