import React from "react";
import {TViewMode} from "../../../../components/modals/BaseModal/types";
import {Button, Grid, IconButton, useMediaQuery, useTheme} from "@mui/material";
import moment from "moment/moment";
import {DeleteOutline} from "@mui/icons-material";
import {TBreak} from "../types";
import {useStyles} from "./styles";
import {blankRow} from "../constants";
import {TimePicker} from "../../../../components/pickers/TimePicker/TimePicker";

type TProps = {
    form: TBreak[],
    workDays: number[],
    onCheck: (day: number, check: boolean) => () => void;
    onChange: (day: number, t: "from" | "to") => (date: moment.Moment) => void;
    formIsChecked: boolean;
}

export const BreakForm: React.FC<React.PropsWithChildren<TProps&TViewMode>> = props => {
    const classes = useStyles();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));

    const isClosed = (day: number): boolean => {
        return !props.workDays.includes(day);
    }
    return (
        <div>
            {moment.weekdays().map((d, dayOfWeek) => {
                const data = props.form.find(el => el.dayOfWeek === dayOfWeek) || {...blankRow, dayOfWeek};
                return (
                    <Grid container className={classes.container} alignItems="flex-end" key={d}>
                        <Grid item xs={12} sm={3}>
                            <Button
                                onClick={props.onCheck(dayOfWeek, true)}
                                fullWidth
                                disabled={data.checked || isClosed(dayOfWeek) || props.viewMode}
                                className={classes.button}
                                variant="contained"
                                color="primary">
                                Add Break
                            </Button>
                        </Grid>
                        <Grid item xs={1} hidden={isXS}/>
                        <Grid item xs={4} sm={3}>
                            <TimePicker
                                label={d}
                                fullWidth
                                disabled={!data.checked || props.viewMode}
                                placeholder={isClosed(dayOfWeek) ? "Closed" : ""}
                                value={data.from}
                                error={!data.from && data.checked && props.formIsChecked}
                                onChange={props.onChange(dayOfWeek, "from")}
                                id={`${d}Start`}
                                name={`${d}Start`}
                            />
                        </Grid>
                        <Grid item xs={2} sm={1} className={classes.text}>{
                            data.checked && !isClosed(dayOfWeek) ? "to" : ""
                        }</Grid>
                        <Grid item xs={4} sm={3}>
                            {data.checked && !isClosed(dayOfWeek) ? <TimePicker
                                fullWidth
                                id={`${d}End`}
                                name={`${d}End`}
                                value={data.to}
                                error={!data.to && data.checked && props.formIsChecked}
                                disabled={props.viewMode}
                                onChange={props.onChange(dayOfWeek, "to")}
                            /> : null}
                        </Grid>
                        <Grid item xs={2} sm={1}>
                            {(data.checked && !props.viewMode) ? <IconButton onClick={props.onCheck(dayOfWeek, false)} color="primary" size="large">
                                <DeleteOutline/>
                            </IconButton> : null}
                        </Grid>
                    </Grid>
                );
            })}
        </div>
    );
}