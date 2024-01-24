import {TViewMode} from "../../../../components/modals/BaseModal/types";
import {THOOForm} from "../types";
import React from "react";
import {Button, Grid, Switch, useMediaQuery, useTheme} from "@mui/material";
import moment from "moment/moment";
import {blankRow} from "../constants";
import {useStyles} from "./styles";
import CustomClockTimePicker from "../../../../components/pickers/CustomClockTimePicker/CustomClockTimePicker";
import {TParsableDate} from "../../../../types/types";

type THOOFormProps = TViewMode & {
    form: THOOForm[];
    onApply: () => void;
    onChange: (day: number, t: "from" | "to") => (date: TParsableDate) => void;
    onCheck: (day: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    formIsChecked: boolean;
    isLoading: boolean;
}

export const HourOfOperationForm: React.FC<React.PropsWithChildren<React.PropsWithChildren<THOOFormProps>>> = ({
                                                                                                                   form,
                                                                                                                   onApply,
                                                                                                                   onChange,
                                                                                                                   onCheck,
                                                                                                                   viewMode,
                                                                                                                   formIsChecked,
                                                                                                                   isLoading}) => {
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
                    <CustomClockTimePicker
                        InputProps={{
                            placeholder: !data.checked ? "Closed" : "",
                            error: !data.from && data.checked && formIsChecked,
                            disabled: !data.checked || viewMode || isLoading,
                            id: `from-${day}`
                        }}
                        fullWidth
                        value={data.from}
                        onChange={onChange(idx, "from")}
                        label={day}
                    />
                </Grid>
                <Grid item xs={2} sm={1}>
                    <span className={classes.toWrapper}>to</span>
                </Grid>
                <Grid item xs={5} sm={4} md={3}>
                    <CustomClockTimePicker
                        fullWidth
                        value={data.to}
                        InputProps={{
                            placeholder: !data.checked ? "Closed" : "",
                            disabled: !data.checked || viewMode || isLoading,
                            error: !data.to && data.checked && formIsChecked,
                            id: `to-${day}`
                        }}
                        onChange={onChange(idx, "to")}
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