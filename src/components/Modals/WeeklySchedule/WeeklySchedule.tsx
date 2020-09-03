import React, {useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid, Switch, Typography} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";
import {IWeeklySchedule} from "../../../store/reducers/serviceCenters/types";
import {truncate} from "fs";

const useStyles = makeStyles(theme => ({
    container: {
        width: `calc(100% + ${theme.spacing(2) * 2})`,
        marginLeft: -theme.spacing(2),
        marginRight: -theme.spacing(2),
        "&>.MuiGrid-item:last-child": {
            borderLeft: `1px solid ${theme.palette.divider}`
        },
        "&>.MuiGrid-item": {
            boxSizing: "border-box",
            padding: `${theme.spacing(2) / 2}px ${theme.spacing(2)}px`
        }
    },
    title: {
        textTransform: "uppercase",
        fontSize: 12,
        marginBottom: 6,
        fontWeight: "bold",
    },
    dividerCol: {
        alignSelf: "stretch"
    },
    row: {
        alignItems: "flex-end",
        marginBottom: 6,
        "&:last-child": {
            marginBottom: 0
        },
    },
    divider: {
        margin: "0 auto !important"
    }
}))

const WSForm: React.FC<{
    form: TWeeklySchedule[];
    onCheck: (day: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    onChange: (day: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = props => {
    const classes = useStyles();
    return <div>
        <Grid container className={classes.container} alignItems="flex-start">
            <Grid item xs={2}/>
            <Grid item xs={5}>
                <Typography variant="h4" className={classes.title}>
                    Average total technicians by day
                </Typography>
            </Grid>
            <Grid item xs={5}>
                <Typography variant="h4" className={classes.title}>
                    Average level 3 technicians scheduled by day
                </Typography>
            </Grid>
        </Grid>
        {moment.weekdays().map((day, dayOfWeek) => {
            const data = props.form.find(el => el.dayOfWeek === dayOfWeek) || {...blankRow, dayOfWeek};
            return <Grid container className={classes.container} alignItems="flex-end" key={`l-${day}`}>
                <Grid item xs={2}>
                    <Switch checked={data.checked} onChange={props.onCheck(dayOfWeek)} color="primary"/>
                </Grid>
                <Grid item xs={5}>
                    <TextField
                        id={`${dayOfWeek}-averageTechnicians`}
                        disabled={!data.checked}
                        name="averageTechnicians"
                        onChange={props.onChange(dayOfWeek)}
                        value={data.averageTechnicians}
                        fullWidth
                        label={day} />
                </Grid>
                <Grid item xs={5}>
                    <TextField
                        value={data.averageLevelThreeTechnicians}
                        disabled={!data.checked}
                        id={`${dayOfWeek}-averageLevelThreeTechnicians`}
                        name="averageLevelThreeTechnicians"
                        onChange={props.onChange(dayOfWeek)}
                        label={day}
                        hideLabel
                        fullWidth />
                </Grid>
            </Grid>;
        })}
    </div>
}

type TWeeklySchedule = {
    dayOfWeek: number; averageLevelThreeTechnicians: number; averageTechnicians: number; checked: boolean;
}
const blankRow = {dayOfWeek: 0, checked: false, averageLevelThreeTechnicians: 0, averageTechnicians: 0};
const initialIWeeklySchedule: TWeeklySchedule[] = moment.weekdays().map((day, dayOfWeek) => ({
   ...blankRow, dayOfWeek
}));
export const WeeklySchedule: React.FC<DialogProps> = (props) => {
    const [form, setForm] = useState<TWeeklySchedule[]>(initialIWeeklySchedule);
    const handleChange = (day: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = form.findIndex(e => e.dayOfWeek === day);
        form[el] = {...form[el], [e.target.name]: e.target.value};
        setForm([...form]);
    }
    const handleCheck = (dayOfWeek: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const el = form.findIndex(e => e.dayOfWeek === dayOfWeek);
        form[el] = {...form[el], checked};
        setForm([...form]);
    }

    return <BaseModal {...props} maxWidth="sm">
        <DialogTitle onClose={props.onClose}>Edit Weekly Schedule</DialogTitle>
        <DialogContent>
            <WSForm form={form} onCheck={handleCheck} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button color="primary" variant="contained" onClick={props.onClose}>Save</Button>
        </DialogActions>
    </BaseModal>;
};
