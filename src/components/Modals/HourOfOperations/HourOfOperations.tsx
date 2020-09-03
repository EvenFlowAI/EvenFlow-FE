import React, {useEffect, useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid, Switch} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {Api} from "../../../config/requests";
import {IHOODataForm} from "../../../store/reducers/serviceCenters/types";
import {LoadingButton} from "../../UI/Button";


const useStyles = makeStyles({
    row: {
        marginBottom: 16
    },
    toWrapper: {
        padding: "12px 0",
        textAlign: "center",
        display: "block"
    },
    switchRow: {
        textAlign: "right"
    }
})

const HOOForm: React.FC<{
    form: THOOForm[];
    onChange: (day: number, t: "from" | "to") => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCheck: (day: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}> = props => {
    const classes = useStyles();
    return <>{moment.weekdays().map((day, idx) => {
        const data: THOOForm = props.form.filter(f => f.dayOfWeek === idx)[0] || {...blankRow, dayOfWeek: idx};
        return <Grid container spacing={1} alignItems="flex-end" key={day} className={classes.row}>
            <Grid item xs={2} className={classes.switchRow}><Switch onChange={props.onCheck(idx)} checked={data.checked} color="primary"/></Grid>
            <Grid item xs={3}>
                <TextField
                    disabled={!data.checked}
                    fullWidth
                    value={data.from}
                    onChange={props.onChange(idx, "from")}
                    label={day}
                    id={`from-${day}`}
                />
            </Grid>
            <Grid item xs={1}>
                <span className={classes.toWrapper}>to</span>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    fullWidth
                    value={data.to}
                    disabled={!data.checked}
                    onChange={props.onChange(idx, "to")}
                    id={`to-${day}`}
                />
            </Grid>
            <Grid item xs={3}>
                {!idx ? <Button>
                    Apply to all
                </Button> : null}
            </Grid>
        </Grid>;
    })}
    </>
}
type THOOForm = {
    dayOfWeek: number;
    from: string;
    to: string;
    checked: boolean
};
const blankRow: THOOForm = {
    dayOfWeek: 0, from: "", to: "", checked: false
}
const initialForm: THOOForm[] = moment.weekdays().map((w, idx) => {
    return {...blankRow, dayOfWeek: idx};
});

export const HourOfOperations: React.FC<DialogProps> = props => {
    const {selectedSC} = useSCs();
    const [form, setForm] = useState<THOOForm[]>(initialForm);
    const [saving, setSaving] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();
    useEffect(() => {
        if (selectedSC) {
            Api.call<IHOODataForm[]>(Api.endpoints.ServiceCenters.GetHOO, {urlParams: {id: selectedSC.id}}).then(r => {
                setForm(initialForm.map(ie => {
                    const element = r.data.find(e => e.dayOfWeek === ie.dayOfWeek);
                    if (element) {
                        return {...element, checked: true};
                    }
                    return ie;
                }))
            });
        }
    }, [selectedSC, setForm, props.open]);

    const handleChange = (day: number, t: "from" | "to") => (e: React.ChangeEvent<HTMLInputElement>) => {
        const idx = form.findIndex(v => v.dayOfWeek === day);
        form[idx] = {...form[idx], [t]: e.target.value};
        setForm([...form]);
    }
    const handleCheck = (day: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const idx = form.findIndex(v => v.dayOfWeek === day);
        form[idx] = {...form[idx], checked};
        setForm([...form]);
    }
    const handleUpdate = async () => {
        if (!selectedSC) {
            showError("Service center is not selected");
        } else {
            setSaving(true);
            const fd: IHOODataForm[] = form.filter(e => e.checked) as IHOODataForm[];
            try {
                await Api.call(Api.endpoints.ServiceCenters.SetHOO, {data: {hoursOfOperations: fd}, urlParams: {id: selectedSC.id}});
                setSaving(false);
                showMessage("Successfully saved");
                props.onClose();
            } catch (e) {
                showError(e);
                setSaving(false);
            }
        }
    }

    return <BaseModal {...props} maxWidth="sm">
        <DialogTitle onClose={props.onClose}>Edit Hours of Operations</DialogTitle>
        <DialogContent>
            <HOOForm onCheck={handleCheck} form={form} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                variant="contained"
                color="primary"
                loading={saving}
                onClick={handleUpdate}>
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}