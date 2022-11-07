import React, {useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {DialogProps} from "../../Modals/types";
import {Button, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, withStyles} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage} from "../../../utils/hooks";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IOffer} from "../../../store/reducers/offers/types";
import {TEnumKeyLabel} from "../../../store/reducers/utils";

const Label = withStyles(theme => ({
    root: {
        textTransform: "uppercase",
        fontSize: 12,
        fontWeight: "bold",
        color: theme.palette.text.primary
    }
}))(FormLabel);

enum EAudience {
    All,
    New,
    NewWarranty,
    HighCustomerValue,
    MediumCustomerValue,
    LastVisit90
}
const audienceLabels: TEnumKeyLabel<EAudience> = {
    [EAudience.All]: "All",
    [EAudience.New]: "New",
    [EAudience.NewWarranty]: "New Warranty",
    [EAudience.HighCustomerValue]: "High Customer Value",
    [EAudience.MediumCustomerValue]: "Medium Customer Value",
    [EAudience.LastVisit90]: "Last Visit > 90 days",
}
enum EChannel {
    Text, Email, Both
}
const channelLabels: TEnumKeyLabel<EChannel> = {
    [EChannel.Both]: "Both",
    [EChannel.Email]: "Email",
    [EChannel.Text]: "Text"
}

type TForm = {
    offer?: IOffer,
    audience?: EAudience,
    channel: EChannel,
}
const initialForm: TForm = {
    channel: EChannel.Text
}

export const SendOffer: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const offers = useSelector((state: RootState) => state.offers.offersList);
    const showMessage = useMessage();
    const showError = useException();

    const handleSelect = (name: keyof TForm) => (e: any, value: unknown) => {
        setFormIsChecked(false);
        switch (name) {
            case "audience":
                setForm({...form, audience: value as EAudience})
                break;
            case "channel":
                setForm({...form, channel: value as EChannel});
                break;
            case "offer":
                setForm({...form, offer: value as IOffer});
        }
    }

    const checkIsValid = () => {
        let valid = true;
        if (!form.audience) {
            valid = false;
            showError('"Audience" must not be empty')
        }
        if (!form.offer) {
            valid = false;
            showError('"Offer" must not be empty')
        }
        return valid;
    }

    const handleSend = async () => {
        setFormIsChecked(true);
        if (checkIsValid()) {
            try {
                // TODO: dispatch send action
                showMessage("Offer sent");
                props.onClose();
            } catch (e) {
                showError(e);
            }
        }
    }
    const handleChannel = (e: any, value: string) => {
        setForm({...form, channel: Number(value) as EChannel});
    }

    return <BaseModal {...props} width={450}>
        <DialogTitle onClose={props.onClose}>Send Offer</DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        options={offers}
                        onChange={handleSelect("offer")}
                        getOptionLabel={option => option.title}
                        value={form.offer||null}
                        renderInput={autocompleteRender({label: "Select offer", error: formIsChecked && !form.offer})}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        options={Object.values(EAudience).filter(v => !isNaN(Number(v)))}
                        onChange={handleSelect("audience")}
                        getOptionLabel={option => audienceLabels[option as EAudience]}
                        value={form.audience === undefined ? null : form.audience}
                        renderInput={autocompleteRender({label: "Audience", error: formIsChecked && !form.audience})}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Label >Channel</Label>
                    <RadioGroup row value={form.channel} onChange={handleChannel}>
                        {Object.values(EChannel).filter(v => !isNaN(Number(v)))
                            .map(c => {
                            return <FormControlLabel
                                key={c}
                                value={c}
                                control={<Radio color="primary" />}
                                labelPlacement="end"
                                label={channelLabels[c as EChannel]}
                            />
                        })}
                    </RadioGroup>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Cancel
            </Button>
            <LoadingButton
                color="primary"
                onClick={handleSend}
                variant="contained"
            >
                Send Offer
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};