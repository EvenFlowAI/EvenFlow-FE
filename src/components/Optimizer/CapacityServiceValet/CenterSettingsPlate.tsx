import React from "react";
import {Button, Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Loading} from "../../UI/Loading";

const useStyles = makeStyles({
    paper: {
        height: "100%",
        borderRadius: 0,
        padding: 20,
        position: "relative"
    },
    title: {
        fontSize: 16,
        textTransform: "uppercase",
        margin: 0
    },
    value: {
        marginTop: 20,
        fontSize: 48,
        fontWeight: "bold",
        textOverflow: "ellipsis",
        overflow: "hidden"
    },
    helperText: {
        fontSize: 14,
        lineHeight: "17px",
        fontWeight: 300,
        marginTop: 73,
    },
    label: {
        fontWeight: 300,
        fontSize: 19,
        marginTop: 14,
        color: "#A8ABBB",
    },
    edit: {
        position: "absolute",
        top: 10,
        right: 6,
        textTransform: "none",
        fontSize: 16
    }
});

export type TCenterSettingsPlateProps = {
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