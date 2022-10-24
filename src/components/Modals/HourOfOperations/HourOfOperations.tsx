import React, {useEffect, useState} from "react";
import {DialogProps, TViewMode} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid, Switch, useMediaQuery, useTheme} from "@material-ui/core";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {Api} from "../../../config/requests";
import {IHOODataForm} from "../../../store/reducers/serviceCenters/types";
import {LoadingButton} from "../../UI/Button";
import {TimePicker} from "../../UI/DateTimePickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {timeSpanString} from "../../../config/constants";


const useStyles = makeStyles(theme => ({
    row: {
        marginBottom: 16
    },
    toWrapper: {
        padding: "12px 0",
        textAlign: "center",
        display: "block"
    },
    switchRow: {
        textAlign: "right",
        [theme.breakpoints.down("xs")]: {
            textAlign: "left",
            "&>span": {
                left: -theme.spacing(1.5),
                bottom: -theme.spacing(1)
            }
        }
    }
}));

type THOOFormProps = TViewMode & {
    form: THOOForm[];
    onApply: () => void;
    onChange: (day: number, t: "from" | "to") => (date: MaterialUiPickersDate) => void;
    onCheck: (day: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    formIsChecked: boolean;
}

const HOOForm: React.FC<THOOFormProps> = ({form, onApply, onChange, onCheck, viewMode, formIsChecked}) => {
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
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
type THOOForm = {
    dayOfWeek: number;
    from: ParsableDate;
    to: ParsableDate;
    checked: boolean
};
const blankRow: THOOForm = {
    dayOfWeek: 0, from: null, to: null, checked: false
}
const initialForm: THOOForm[] = moment.weekdays().map((w, idx) => {
    return {...blankRow, dayOfWeek: idx};
});

export const HourOfOperations: React.FC<DialogProps&TViewMode> = ({viewMode, ...props}) => {
    const {selectedSC} = useSCs();
    const [form, setForm] = useState<THOOForm[]>(initialForm);
    const [saving, setSaving] = useState<boolean>(false);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();
    useEffect(() => {
        if (selectedSC) {
            Api.call<IHOODataForm[]>(Api.endpoints.ServiceCenters.GetHOO, {urlParams: {id: selectedSC.id}}).then(r => {
                setForm(initialForm.map(ie => {
                    const element = r.data.find(e => e.dayOfWeek === ie.dayOfWeek);
                    if (element) {
                        return {
                            dayOfWeek: element.dayOfWeek,
                            checked: true,
                            from: moment(element.from, timeSpanString),
                            to: moment(element.to, timeSpanString)
                        };
                    }
                    return ie;
                }))
            });
        }
    }, [selectedSC, setForm, props.open]);

    const handleChange = (day: number, t: "from" | "to") => (date: MaterialUiPickersDate) => {
        setFormIsChecked(false);
        const idx = form.findIndex(v => v.dayOfWeek === day);
        form[idx] = {...form[idx], [t]: date};
        setForm([...form]);
    }
    const handleApplyToAll = (): void => {
        setFormIsChecked(false);
        const el = form[0];
        setForm(form.map((_, idx) => ({...el, dayOfWeek: idx})));
    }
    const handleCheck = (day: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setFormIsChecked(false);
        const idx = form.findIndex(v => v.dayOfWeek === day);
        form[idx] = {...form[idx], checked};
        setForm([...form]);
    }

    const isValid = () => {
        return !form.find(item => item.checked && (!item.from || !item.to))
    }
    const handleUpdate = async () => {
        setFormIsChecked(true);
        if (isValid()) {
            if (!selectedSC) {
                showError("Service center is not selected");
            } else {
                setSaving(true);
                const fd: IHOODataForm[] = form.filter(e => e.checked).map(e => ({
                    ...e, from: moment(e.from).format(timeSpanString), to: moment(e.to).format(timeSpanString)
                })) as IHOODataForm[];
                try {
                    await Api.call(Api.endpoints.ServiceCenters.SetHOO, {data: {hoursOfOperations: fd}, urlParams: {id: selectedSC.id}});
                    setSaving(false);
                    showMessage("Hours of Operation updated");
                    props.onClose();
                } catch (e) {
                    showError(e);
                    setSaving(false);
                }
            }
        } else {
            showError('"Hours of Operation" must not be empty')
        }
    }

    const onClose = () => {
        props.onClose();
        setFormIsChecked(false);
    }

    return <BaseModal {...props} maxWidth="sm" onClose={onClose}>
        <DialogTitle onClose={onClose}>{viewMode ? "View" : "Edit"} Hours of Operation</DialogTitle>
        <DialogContent>
            <HOOForm
                formIsChecked={formIsChecked}
                viewMode={viewMode}
                onApply={handleApplyToAll}
                onCheck={handleCheck}
                form={form}
                onChange={handleChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
            {!viewMode ? <LoadingButton
                variant="contained"
                color="primary"
                loading={saving}
                onClick={handleUpdate}>
                Save
            </LoadingButton> : null}
        </DialogActions>
    </BaseModal>
}