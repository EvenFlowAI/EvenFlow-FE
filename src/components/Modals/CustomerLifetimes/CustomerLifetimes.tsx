import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import React, {useEffect, useState} from "react";
import {Button, FormGroup, InputLabel} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {ICustomerLifetime, ICustomerLifetimeForm} from "../../../store/reducers/valueSettings/types";
import {setCustomerLifetimes} from "../../../store/reducers/valueSettings/actions";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {SC_UNDEFINED} from "../../../config/constants";

const useStyles = makeStyles(theme => ({
    group: {
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        "&>*:nth-child(2)": {
            flexGrow: 0,
            padding: 10
        },
        "&>*": {
            flexGrow: 1,
        },

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
    const {selectedPod} = useSelectedPod();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (selectedSC && props.open) {
            if (payload) {
                setForm({from: String(payload.from), to: String(payload.to)});
            } else {
                setForm(initialForm);
            }
        }
    }, [selectedSC, props.open, payload])

    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [name]: e.target.value});
    }

    const checkIsValid = () => {
        if (Number(form.from) > Number(form.to)) {
            showError('"From" must be less than or equal to "To"')
            return false;
        }
        return true;
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            if (checkIsValid()) {
                setSaving(true)
                const data: ICustomerLifetimeForm = {
                    from: Number(form.from),
                    to: Number(form.to),
                    serviceCenterId: selectedSC.id,
                    podId: selectedPod?.id
                }
                try {
                    await dispatch(setCustomerLifetimes(data))
                    showMessage("Customer Lifetime Value Range updated");
                    setSaving(false);
                    props.onClose();
                } catch (e) {
                    setSaving(false);
                    showError(e);
                }
            }
        }
    }

    return <BaseModal {...props} maxWidth="xs">
        <DialogTitle onClose={props.onClose}>Edit Medium Value</DialogTitle>
        <DialogContent>
            <InputLabel className={classes.label}>Customer Lifetime Value Range</InputLabel>
            <FormGroup className={classes.group} row>
                <TextField
                    type="number"
                    autoComplete="low-value value"
                    id="low-value"
                    startAdornment="$"
                    name="low-value-f"
                    inputProps={{min: 0}}
                    value={form.from}
                    onChange={handleChange("from")}
                />
                <span>-</span>
                <TextField
                    type="number"
                    startAdornment="$"
                    autoComplete="high-value value"
                    inputProps={{min: Number(form.from) || 0}}
                    id="high-value"
                    name="high-value-t"
                    value={form.to}
                    onChange={handleChange("to")}
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