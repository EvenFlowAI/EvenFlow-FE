import React from "react";
import {Button, Grid, Paper} from "@material-ui/core";
import {Loading} from "../../../components/UI/Loading";
import {useStyles} from "./styles";

type TCenterSettingsPlateProps = {
    onEdit: () => void;
    title: string;
    count: number|string;
    prefix?: string;
    suffix?: string;
    label: string;
    helperText: string;
    isLoading: boolean;
}

export const CenterSettingsPlate: React.FC<TCenterSettingsPlateProps> = ({
                                                                             onEdit,
                                                                             title,
                                                                             count,
                                                                             prefix,
                                                                             suffix,
                                                                             label,
                                                                             helperText,
                                                                             isLoading
                                                                         }) => {
    const classes = useStyles();

    return <Grid item xs={6} md={4}>
        <Paper className={classes.paper} variant={"outlined"} >
            <h3 className={classes.title}>{title}</h3>
            <Button className={classes.edit} color="primary" onClick={() => onEdit()}>Edit</Button>
            {isLoading
                ? <Loading/>
                : <div className={classes.value}>
                    {prefix}{count}{suffix}
                </div>
            }
            <div className={classes.label}>{label}</div>
            <div className={classes.helperText}>{helperText}</div>
        </Paper>
    </Grid>
}