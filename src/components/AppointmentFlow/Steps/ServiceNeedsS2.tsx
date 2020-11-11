import React from 'react';
import {FormLabel, IconButton} from "@material-ui/core";
import {TextField} from "../UI";
import {Search} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    label: {
        textTransform: "uppercase",
        fontWeight: "bold"
    },
    btnIcon: {
        marginLeft: 8
    }
});


export const ServiceNeedsS2 = () => {
    const classes = useStyles();
    return (
        <div style={{width: "100%"}}>
            <h4>What Does Your Car Need?</h4>
            <FormLabel className={classes.label} htmlFor="search">Search</FormLabel>
            <TextField
                InputProps={{
                    startAdornment: <IconButton
                        className={classes.btnIcon}
                        size="small">
                        <Search />
                    </IconButton>
                }}
            />
        </div>
    );
};