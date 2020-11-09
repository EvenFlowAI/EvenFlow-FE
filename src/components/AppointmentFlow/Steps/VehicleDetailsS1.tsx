import React from 'react';
import {FormLabel, Grid} from "@material-ui/core";
import {TextField} from "../UI";

export const VehicleDetailsS1 = () => {
    return (
        <div>
            <h4>Please tell us about your vehicle</h4>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <FormLabel htmlFor="vin">
                        vehicle identification number (VIN)
                    </FormLabel>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="vin"
                    />
                </Grid>
                <Grid item xs={3}>

                </Grid>
            </Grid>
        </div>
    );
};