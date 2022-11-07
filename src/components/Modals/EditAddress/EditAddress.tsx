import React, {useEffect, useState} from "react";
import {DialogProps, TViewMode} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid} from "@material-ui/core";
import {IAddress} from "../../../store/reducers/dealershipGroups/types";
import {TSelectChange} from "../ModalForm";
import {TextField} from "../../UI/TextField";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {states} from "../../../config/constants";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {Api} from "../../../config/requests";
import {IServiceCenterExtended} from "../../../store/reducers/serviceCenters/types";
import {LoadingButton} from "../../UI/Button";

type TEditFormProps = TViewMode & {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onSelect: TSelectChange;
    form: IAddress;
}

const EditForm: React.FC<TEditFormProps> = ({viewMode, ...props}) => {
    return <Grid container spacing={3}>
        <Grid item xs={12}>
            <TextField
                fullWidth
                disabled={viewMode}
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
                disabled={viewMode}
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
                disabled={viewMode}
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
                disabled={viewMode}
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

export const EditAddress: React.FC<DialogProps&TViewMode> = ({viewMode, ...props}) => {
    const [form, setForm] = useState<IAddress>(initialAddress);
    const [saving, setSave] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();

    const {selectedSC} = useSCs();
    useEffect(() => {
        if (selectedSC) {
            Api.call<IServiceCenterExtended>(
                Api.endpoints.ServiceCenters.Retrieve,
                {urlParams: {id: selectedSC.id}}
            ).then(r => {
                setForm(r.data.address);
            })
        }
    }, [selectedSC, setForm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleSelectState: TSelectChange = (e, val) => {
        setForm({...form, state: val || ''});
    }
    const handleSave = async () => {
        if (!selectedSC) {
            showError("Service center is not specified");
        } else {
            setSave(true);
            try {
                await Api.call(
                    Api.endpoints.ServiceCenters.UpdateAddress,
                    {data: form, urlParams: {id: selectedSC.id}}
                    )
                showMessage("Address updated");
                setSave(false);
                props.onClose();
            } catch (e) {
                setSave(false)
                showError(e);
            }
        }
    }

    return <BaseModal {...props} maxWidth="sm">
        <DialogTitle onClose={props.onClose}>
            {viewMode ? "View" : "Edit"} Address
        </DialogTitle>
        <DialogContent>
            <EditForm viewMode={viewMode} onChange={handleChange} onSelect={handleSelectState} form={form} />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Close</Button>
            {!viewMode ? <LoadingButton
                loading={saving}
                variant="contained"
                color="primary"
                onClick={handleSave}>
                Save
            </LoadingButton> : null}
        </DialogActions>
    </BaseModal>
}