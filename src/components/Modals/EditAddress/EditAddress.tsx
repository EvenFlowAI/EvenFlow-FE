import React, {useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid} from "@material-ui/core";
import {IAddress} from "../../../store/reducers/dealershipGroups/types";
import {TSelectChange} from "../ModalForm";
import {TextField} from "../../UI/TextField";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {states} from "../../../config/constants";


const EditForm: React.FC<{
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onSelect: TSelectChange,
    form: IAddress
}> = (props) => {
    return <Grid container spacing={3}>
        <Grid item xs={12}>
            <TextField
                fullWidth
                id="street"
                name="street"
                label="Street"
                onChange={props.onChange}
                value={props.form.street}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                onChange={props.onChange}
                value={props.form.city}
            />
        </Grid>
        <Grid item xs={6}>
            <Autocomplete
                options={states}
                onChange={props.onSelect}
                renderInput={autocompleteRender({label: "State", fullWidth: true})}
                value={props.form.state}
            />
        </Grid>
        <Grid item xs={6}>
            <TextField
                fullWidth
                id="zipCode"
                name="zipCode"
                label="Zip code"
                onChange={props.onChange}
                value={props.form.zipCode}
            />
        </Grid>
    </Grid>
}

const initialAddress: IAddress = {
    street: "",
    city: "",
    state: "",
    zipCode: ""
}

export const EditAddress: React.FC<DialogProps> = props => {
    const [form, setForm] = useState<IAddress>(initialAddress);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleSelectState: TSelectChange = (e, val) => {
        setForm({...form, state: val || ''});
    }

    return <BaseModal {...props} maxWidth="sm">
        <DialogTitle onClose={props.onClose}>
            Edit Address
        </DialogTitle>
        <DialogContent>
            <EditForm onChange={handleChange} onSelect={handleSelectState} form={form} />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={props.onClose}>Save</Button>
        </DialogActions>
    </BaseModal>
}