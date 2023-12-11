import React from "react";
import {Button, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

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
        marginTop: 16
    },
    edit: {
        position: "absolute",
        top: 10,
        right: 6,
        textTransform: "none",
        fontSize: 16
    }
});

export type TOptimizationPlateProps = {
    onEdit: () => void;
    title: string;
    count: number|string;
    prefix?: string;
    suffix?: string;
    label: string;
    helperText: string;
}
export const OptimizationPlate: React.FC<TOptimizationPlateProps> = ({
    onEdit,
    title,
    count,
    prefix,
    suffix,
    label,
    helperText,
}) => {
    const classes = useStyles();
    return <Paper className={classes.paper} variant={"outlined"} >
        <h3 className={classes.title}>{title}</h3>
        <Button className={classes.edit} color="primary" onClick={onEdit}>Edit</Button>
        <div className={classes.value}>
            {prefix}{count}{suffix}
        </div>
        <div className={classes.label}>{label}</div>
        <div className={classes.helperText}>{helperText}</div>
    </Paper>
}