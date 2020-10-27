import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {TextField} from "../../UI/TextField";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {IOffer, IOfferForm} from "../../../store/reducers/offers/types";
import {useDispatch} from "react-redux";
import {createOffer} from "../../../store/reducers/offers/actions";
import {SC_UNDEFINED} from "../../../config/constants";

type TForm = {
    offerValue?: string;
    offerTitle?: string;
}
const clearForm: TForm = {
    offerValue: undefined,
    offerTitle: undefined,
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
                    offerValue: String(payload.value)
                })
            } else {
                setForm(clearForm);
            }
        }
    }, [props.open, payload]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        setForm({...form, [name]: value})
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

    return (
        <BaseModal {...props} width={500}>
            <DialogTitle onClose={props.onClose}>Add new Offer</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Offer title"
                    name="offerTitle"
                    id="offerTitle"
                    onChange={handleChange}
                    value={form.offerTitle||""}
                />
                <TextField
                    fullWidth
                    label="Offer value"
                    onChange={handleChange}
                    name="offerValue"
                    id="offerValue"
                    type="number"
                    inputProps={{min: 0}}
                    value={form.offerValue||""}
                />
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