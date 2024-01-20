import {TViewMode} from "../../../../components/modals/BaseModal/types";
import {THOOForm} from "../types";
import React from "react";
import {Button, Grid, Switch, useMediaQuery, useTheme} from "@mui/material";
import moment from "moment/moment";
import {blankRow} from "../constants";
import {useStyles} from "./styles";
import {TimePicker} from "../../../../components/pickers/TimePicker/TimePicker";

type THOOFormProps = TViewMode & {
    form: THOOForm[];
    onApply: () => void;
    onChange: (day: number, t: "from" | "to") => (date: moment.Moment) => void;
    onCheck: (day: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    formIsChecked: boolean;
}

export const HourOfOperationForm: React.FC<React.PropsWithChildren<THOOFormProps>> = ({form, onApply, onChange, onCheck, viewMode, formIsChecked}) => {
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();

    return <>
        {moment.weekdays().map((day, idx) => {
            const data: THOOForm = form.filter(f => f.dayOfWeek === idx)[0] || {...blankRow, dayOfWeek: idx};

            return <Grid container spacing={1} alignItems="flex-end" key={day} className={classes.row}>
                <Grid item xs={12} sm={2} className={classes.switchRow}>
                    <Switch onChange={onCheck(idx)} disabled={viewMode} checked={data.checked} color="primary"/>
                </Grid>
                <Grid item xs={5} sm={4} md={3}>
                    <TimePicker
                        disabled={!data.checked || viewMode}
                        placeholder={!data.checked ? "Closed" : ""}
                        fullWidth
                        value={data.from}
                        error={!data.from && data.checked && formIsChecked}
                        onChange={onChange(idx, "from")}
                        label={day}
                        id={`from-${day}`}
                    />
                </Grid>
                <Grid item xs={2} sm={1}>
                    <span className={classes.toWrapper}>to</span>
                </Grid>
                <Grid item xs={5} sm={4} md={3}>
                    <TimePicker
                        fullWidth
                        value={data.to}
                        disabled={!data.checked || viewMode}
                        error={!data.to && data.checked && formIsChecked}
                        onChange={onChange(idx, "to")}
                        id={`to-${day}`}
                    />
                </Grid>
                <Grid item hidden={isXS} xs={4} sm={3}>
                    {(!idx && !viewMode) ? <Button onClick={onApply}>
                        Apply to all
                    </Button> : null}
                </Grid>
            </Grid>;
        })}
    </>
}