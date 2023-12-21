import {TViewMode} from "../../../../components/BaseModal/types";
import React from "react";
import {TSelectChange} from "../../../../types/types";
import {IAddress} from "../../../../store/reducers/dealershipGroups/types";
import {Grid} from "@material-ui/core";
import {TextField} from "../../../../components/FormControls/TextFieldStyled/TextField";
import {Autocomplete} from "@material-ui/lab";
import {states} from "../../../../config/constants";
import {autocompleteRender} from "../../../../utils/AutocompleteRender";

type TEditFormProps = TViewMode & {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onSelect: TSelectChange;
    form: IAddress;
}

export const EditForm: React.FC<TEditFormProps> = ({viewMode, ...props}) => {
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