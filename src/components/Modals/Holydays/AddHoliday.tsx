import React, {useEffect, useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, FormControlLabel, Grid, Switch} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {DatePicker} from "../../UI/DateTimePickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {Api} from "../../../config/requests";
import {LoadingButton} from "../../UI/Button";
import {IHoliday} from "../../../store/reducers/holidays/types";

const useStyles = makeStyles(theme => ({
    label: {
        "& .MuiFormControlLabel-label": {
            fontWeight: "bold",
            textTransform: "uppercase"
        }
    },
    spacer: {
        padding: 12
    },
    preview: {
        border: `1px solid ${theme.palette.text.primary}`,
        textAlign: "center",
        padding: 10,
        fontSize: 16,
        fontWeight: "bold"
    }
}));

const HForm: React.FC<{
    form: TForm
    onDateChange: (date: MaterialUiPickersDate) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCheck: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}> = props => {
    const classes = useStyles();
    return <div>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <DatePicker
                    value={props.form.date}
                    onChange={props.onDateChange}
                    label="Date"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    className={classes.label}
                    control={
                        <Switch
                            name="isRecurring"
                            onChange={props.onCheck}
                            checked={props.form.isRecurring}
                            color="primary" />
                    }
                    label="Recurring" />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Description title"
                    value={props.form.description}
                    onChange={props.onChange}
                    name="description"
                    id="description"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} className={classes.spacer} />
        </Grid>
    </div>
}
type TForm = {
    date: ParsableDate;
    isRecurring: boolean;
    description: string;
};
const initialForm: TForm = {
    date: null,
    isRecurring: false,
    description: ""
}
export const AddHoliday: React.FC<DialogProps<IHoliday>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [saving, setSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (props.open) {
            if (!payload) {
                setForm(initialForm);
            } else {
                setForm({...initialForm, ...payload});
            }
        }
    }, [props.open, payload]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "description" && e.target.value?.length > 40) {
            showError('The Description can`t be longer than 40 characters')
        } else {
            setForm({...form, [e.target.name]: e.target.value});
        }
    }
    const handleDateChange = (date: MaterialUiPickersDate) => {
        setForm({...form, date});
    }
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setForm({...form, [e.target.name]: checked});
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError("Service center is not selected");
        } else {
            const data: IHoliday = {...payload, ...form, serviceCenterId: selectedSC.id};
            setSaving(true);
            try {
                if (payload) {
                    await Api.call(
                        Api.endpoints.Holidays.Update,
                        {data, urlParams: {id: data?.id}}
                    ).then(res => {
                        if (res) showMessage("Holiday updated");
                    })
                } else {
                    await Api.call(Api.endpoints.Holidays.Create, {data})
                        .then(res => {
                            if (res) showMessage("Holiday created");
                        })
                }
                if (onAction) {
                    onAction();
                }
                props.onClose();
            } catch (e) {
                showError(e);
            } finally {
                setSaving(false);
            }
        }
    }
    return <BaseModal {...props} width={600}>
        <DialogTitle onClose={props.onClose}>{payload ? "Edit" : "Add"} Holiday</DialogTitle>
        <DialogContent>
            <HForm
                onChange={handleChange}
                form={form}
                onCheck={handleCheck}
                onDateChange={handleDateChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
                variant="contained"
                color="primary">
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}