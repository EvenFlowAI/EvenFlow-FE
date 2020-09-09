import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import React, {useEffect, useState} from "react";
import {Button, FormGroup, InputLabel} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {ICustomerLifetime, ICustomerLifetimeForm} from "../../../store/reducers/valueSettings/types";
import {setCustomerLifetimes} from "../../../store/reducers/valueSettings/actions";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    group: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    label: {
        color: theme.palette.text.primary,
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase"
    }
}));

type TForm = {
    from: string;
    to: string;
}
const initialForm: TForm = {
    from: "", to: ""
}

export const CustomerLifetimes: React.FC<DialogProps<ICustomerLifetime>> = ({payload, onAction, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>(initialForm);
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC && props.open) {
            if (payload) {
                setForm({from: String(payload.from), to: String(payload.to)});
            } else {
                setForm(initialForm);
            }
        }
    }, [selectedSC, props.open, payload])

    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError("Service center is not loaded");
        } else {
            setSaving(true)
            const data: ICustomerLifetimeForm = {
                from: Number(form.from),
                to: Number(form.to),
                serviceCenterId: selectedSC.id
            }
            try {
                await dispatch(setCustomerLifetimes(data))
                showMessage("Saved");
                setSaving(false);
                props.onClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    const classes = useStyles();
    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>Edit Medium Value</DialogTitle>
        <DialogContent>
            <InputLabel className={classes.label}>Customer Lifetime Value Range</InputLabel>
            <FormGroup className={classes.group} row>
                <TextField
                    type="number"
                    autoComplete="value-number1"
                    id="from"
                    name="from"
                    inputProps={{min: 0}}
                    value={form.from}
                    onChange={handleChange}F
                />
                <span>-</span>
                <TextField
                    type="number"
                    autoComplete="value-number2"
                    inputProps={{min: Number(form.from) || 0}}
                    id="to"
                    name="to"
                    value={form.to}
                    onChange={handleChange}
                />
            </FormGroup>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Cancel
            </Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
                variant="contained"
                color="primary"
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}