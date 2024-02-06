import React from "react";
import {Button, Paper} from "@mui/material";
import {useStyles} from "./styles";

export type TOptimizationPlateProps = {
    onEdit: () => void;
    title: string;
    count: number|string;
    prefix?: string;
    suffix?: string;
    label: string;
    helperText: string;
}

export const OptimizationWindowCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TOptimizationPlateProps>>> = ({
    onEdit,
    title,
    count,
    prefix,
    suffix,
    label,
    helperText,
}) => {
    const { classes  } = useStyles();

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