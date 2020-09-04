import React, {useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid, Switch, Typography} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";
import {IWeeklySchedule} from "../../../store/reducers/serviceCenters/types";
import {Api} from "../../../config/requests";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {LoadingButton} from "../../UI/Button";

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
                        type="number"
                        fullWidth
                        label={day} />
                </Grid>
                <Grid item xs={5}>
                    <TextField
                        value={data.averageLevelThreeTechnicians}
                        disabled={!data.checked}
                        type="number"
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
    dayOfWeek: number; averageLevelThreeTechnicians: string; averageTechnicians: string; checked: boolean;
}
const blankRow = {dayOfWeek: 0, checked: false, averageLevelThreeTechnicians: "", averageTechnicians: ""};
const initialIWeeklySchedule: TWeeklySchedule[] = moment.weekdays().map((day, dayOfWeek) => ({
   ...blankRow, dayOfWeek
}));
export const WeeklySchedule: React.FC<DialogProps> = (props) => {
    const [form, setForm] = useState<TWeeklySchedule[]>(initialIWeeklySchedule);
    const [saving, setSaving] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();
    const {selectedSC} = useSCs();

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
    const handleSave = async () => {
        if (!selectedSC) {
            showError("Service center is not selected");
        } else {
            setSaving(true);
            try {
                const data: IWeeklySchedule[] = form.map(fe => ({
                    dayOfWeek: fe.dayOfWeek,
                    averageLevelThreeTechnicians: Number(fe.averageLevelThreeTechnicians),
                    averageTechnicians: Number(fe.averageTechnicians)
                }));
                await Api.call(Api.endpoints.ServiceCenters.SetWS, {urlParams: {id: selectedSC.id}, data});
                showMessage("Weekly schedule updated.")
                setSaving(false);
                props.onClose();
            } catch (e) {
                showError(e);
                setSaving(false);
            }
        }
    }

    return <BaseModal {...props} maxWidth="sm">
        <DialogTitle onClose={props.onClose}>Edit Weekly Schedule</DialogTitle>
        <DialogContent>
            <WSForm form={form} onCheck={handleCheck} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                loading={saving}
                color="primary"
                variant="contained"
                onClick={handleSave}>
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>;
};
