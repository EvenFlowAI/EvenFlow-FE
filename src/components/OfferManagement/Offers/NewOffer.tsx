import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {TextField} from "../../UI/TextField";
import {Button, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {EOfferType, IOffer, IOfferForm, offerTypes} from "../../../store/reducers/offers/types";
import {useDispatch} from "react-redux";
import {createOffer} from "../../../store/reducers/offers/actions";
import {SC_UNDEFINED} from "../../../config/constants";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    inputContainer: {
        marginTop: 10,
        "&:first-child": {
            marginTop: 0
        }
    }
});

type TForm = {
    offerValue?: string;
    offerTitle?: string;
    offerType: EOfferType;
}
const clearForm: TForm = {
    offerValue: undefined,
    offerTitle: undefined,
    offerType: EOfferType.AmountOff,
}
export const NewOffer:React.FC<DialogProps<IOffer>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(clearForm);
    const [isSaving, setSaving] = useState<boolean>(false);

    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setForm({
                    offerTitle: payload.title,
                    offerValue: String(payload.value),
                    offerType: payload.type
                })
            } else {
                setForm(clearForm);
            }
        }
    }, [props.open, payload]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        setForm({...form, [name]: value})
    }
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setForm({...form, offerType: Number(value) as EOfferType});
    }
    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                const data: IOfferForm = {
                    title: form.offerTitle,
                    value: Number(form.offerValue),
                    serviceCenterId: selectedSC.id,
                } as IOfferForm;
                await dispatch(createOffer(data));
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
    return (
        <BaseModal {...props} width={500}>
            <DialogTitle onClose={props.onClose}>Add new Offer</DialogTitle>
            <DialogContent>
                <div className={classes.inputContainer}>
                    <TextField
                        fullWidth
                        label="Offer title"
                        name="offerTitle"
                        id="offerTitle"
                        onChange={handleChange}
                        value={form.offerTitle||""}
                    />
                </div>
                <div className={classes.inputContainer}>
                    <RadioGroup
                        row
                        value={form.offerType}
                        onChange={handleRadio}
                        name="offerType"
                    >
                        {offerTypes.map(ot => {
                            return <FormControlLabel
                                control={<Radio color="primary" />}
                                label={ot.label}
                                labelPlacement="end"
                                key={ot.id}
                                value={ot.id}
                            />
                        })}
                    </RadioGroup>
                </div>
                <div className={classes.inputContainer}>
                    <TextField
                        style={{width: "50%"}}
                        label="Offer value"
                        onChange={handleChange}
                        name="offerValue"
                        endAdornment={
                            form.offerType === EOfferType.PercentOff
                                ? "%"
                                : form.offerType === EOfferType.AmountOff
                                    ? "$" : ""
                        }
                        id="offerValue"
                        type="number"
                        inputProps={{min: 0}}
                        value={form.offerValue||""}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <LoadingButton
                    onClick={handleSave}
                    loading={isSaving}
                    variant="contained"
                    color="primary"
                >Save</LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};