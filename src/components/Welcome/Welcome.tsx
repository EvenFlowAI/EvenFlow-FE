import React from 'react';
import {Grid, Paper} from "@material-ui/core";

export const Welcome = () => {
    return (
        <div>
            <Grid container  alignItems="center" justify="center">
                <Grid item xs={12}>
                    <Paper>
                        <h1>Welcome!</h1>
                        <h2>Schedule Your Service:</h2>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                I`m a returning customer
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                I`m a new customer
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};