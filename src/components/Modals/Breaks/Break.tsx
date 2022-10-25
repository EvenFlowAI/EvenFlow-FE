import React, {useEffect, useState} from "react";
import {DialogProps, TViewMode} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid, IconButton, useMediaQuery, useTheme} from "@material-ui/core";
import {DeleteOutline} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {LoadingButton} from "../../UI/Button";
import {Api} from "../../../config/requests";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {IBreak, IBreakFrom} from "../../../store/reducers/serviceCenters/types";
import {timeSpanString} from "../../../config/constants";
import {TimePicker} from "../../UI/DateTimePickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";

const useStyles = makeStyles({
    button: {
        marginBottom: 3
    },
    text: {
        textAlign: "center",
        marginBottom: 10
    },
    container: {
        marginBottom: 12,
        "&:last-child": {
            marginBottom: 0
        }
    }
});

const BForm: React.FC<{
    form: TBreak[],
    workDays: number[],
    onCheck: (day: number, check: boolean) => () => void;
    onChange: (day: number, t: "from" | "to") => (date: MaterialUiPickersDate) => void;
    formIsChecked: boolean;
}&TViewMode> = props => {
    const classes = useStyles();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const isClosed = (day: number): boolean => {
        return !props.workDays.includes(day);
    }
    return <div>
        {moment.weekdays().map((d, dayOfWeek) => {
            const data = props.form.find(el => el.dayOfWeek === dayOfWeek) || {...blankRow, dayOfWeek};
            return <Grid container className={classes.container} alignItems="flex-end" key={d}>
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
                    {(data.checked && !props.viewMode) ? <IconButton
                        onClick={props.onCheck(dayOfWeek, false)}
                        color="primary">
                        <DeleteOutline/>
                    </IconButton> : null}
                </Grid>
            </Grid>;
        })}
    </div>;
}
type TBreak = {
    id?: number;
    from: ParsableDate;
    to: ParsableDate;
    checked: boolean;
    dayOfWeek: number;
}
const blankRow: TBreak = {
    checked: false, from: null, to: null, dayOfWeek: 0
};
const initialBreaks: TBreak[] = moment.weekdays().map((day, dayOfWeek) => ({
    ...blankRow, dayOfWeek
}));
export const Break: React.FC<DialogProps&TViewMode> = ({viewMode, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [form, setForm] = useState<TBreak[]>(initialBreaks);
    const [wd, setWD] = useState<number[]>([]);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (props.open && selectedSC) {
            Api.call<number[]>(
                Api.endpoints.ServiceCenters.WorkingDays,
                {urlParams: {id: selectedSC.id}}
            ).then(({data}) => {
                setWD(data);
            });
            Api.call<IBreak[]>(
                Api.endpoints.ServiceCenters.GetBreaks,
                {urlParams: {id: selectedSC.id}}
            ).then(({data}) => {
                setForm(initialBreaks.map(el => {
                    const fd = data.find(e => e.dayOfWeek === el.dayOfWeek);
                    if (fd) {
                        return {
                            ...fd,
                            checked: true,
                            from: moment(fd.from, timeSpanString),
                            to: moment(fd.to, timeSpanString)
                        }
                    }
                    return el;
                }))
            })
        }
    }, [props.open, setForm, selectedSC, setWD]);

    const handleCheck = (dayOfWeek: number, checked: boolean) => () => {
        setFormIsChecked(false);
        const idx = form.findIndex(d => d.dayOfWeek === dayOfWeek);
        form[idx] = {...form[idx], checked};
        setForm([...form]);
    }
    const handleChange = (dayOfWeek: number, v: "from" | "to") => (date: MaterialUiPickersDate) => {
        setFormIsChecked(false);
        const idx = form.findIndex(d => d.dayOfWeek === dayOfWeek);
        form[idx] = {...form[idx], [v]: date};
        setForm([...form]);
    }

    const checkIsValid = () => {
        const emptyFields = form.find(item => item.checked && (!item.from || !item.to))
        if (emptyFields) showError('"Breaks" must not be empty')
        return !emptyFields;
    }

    const handleSave = async () => {
        setFormIsChecked(true);
        if (checkIsValid()) {
            if (!selectedSC) {
                showError("Service center is not selected");
            } else {
                setSaving(true);
                const data: IBreakFrom = {breaks: form
                        .filter(el => {
                            return el.checked;
                        }).map(fe => {
                            return {
                                ...fe,
                                from: moment(fe.from).format(timeSpanString),
                                to: moment(fe.to).format(timeSpanString)
                            };
                        })};
                try {
                    await Api.call(
                        Api.endpoints.ServiceCenters.SetBreaks,
                        {urlParams: {id: selectedSC.id}, data}
                    ).then(res => {
                        if (res) showMessage("Breaks updated.");
                    })
                    props.onClose();
                } catch (e) {
                    showError(e);
                } finally {
                    setSaving(false);
                }
            }
        }
    }

    const onClose = () => {
        setFormIsChecked(false);
        props.onClose();
    }

    return <BaseModal {...props} width={780} onClose={onClose}>
        <DialogTitle onClose={onClose}>{viewMode ? "View" : "Edit"} Breaks</DialogTitle>
        <DialogContent>
            <BForm
                formIsChecked={formIsChecked}
                viewMode={viewMode}
                workDays={wd}
                onChange={handleChange}
                onCheck={handleCheck}
                form={form} />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
            {!viewMode ? <LoadingButton
                loading={saving}
                variant="contained"
                color="primary"
                onClick={handleSave}>
                Save
            </LoadingButton> : null}
        </DialogActions>
    </BaseModal>;
}