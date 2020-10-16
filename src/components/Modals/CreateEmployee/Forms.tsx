import React from "react";
import {Autocomplete} from "@material-ui/lab";
import {IServiceCenter} from "../../../store/reducers/serviceCenters/types";
import {Grid} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {TAdvisorForm, TSelectChange, TTechnicianForm} from "./types";
import {ToggleButtons} from "../../UI/ToggleButtons";
import {autocompleteRender} from "../../UI/AutocompleteRender";


export const initialAdvisorForm: TAdvisorForm = {
    firstName: '', lastName: '', email: '', phoneNumber: '', serviceCenter: null
}
export const initialTechnicianForm: TTechnicianForm = {
    firstName: '', lastName: '', serviceCenter: null, phoneNumber: "",
    hourlyRate: '', overtimeRate: '', email: "", technicianLevel: 1
}


type TAFormProps = {
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onSelectChange: TSelectChange,
    form: TAdvisorForm,
    loading: boolean,
    shortSC: IServiceCenter[]
};
type TTFormProps = {
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onSelectChange: TSelectChange,
    loading: boolean,
    shortSC: IServiceCenter[]
    form: TTechnicianForm
    onSwitch: (e: React.ChangeEvent<{}>, newVal: number) => void
};
export const AdvisorForm: React.FC<TAFormProps> = props => {
    return <Grid container spacing={3} justify="center">
        <Grid item xs={6}>
            <TextField
                label="First name"
                id="firstName"
                name="firstName"
                value={props.form.firstName}
                onChange={props.onChange}
                fullWidth
            />
        </Grid>
        <Grid item xs={6}>
            <TextField
                label="Last name"
                id="lastName"
                name="lastName"
                value={props.form.lastName}
                onChange={props.onChange}
                fullWidth
            />
        </Grid>
        <Grid item xs={6}>
            <TextField
                label="Email address"
                id="email"
                name="email"
                value={props.form.email}
                onChange={props.onChange}
                fullWidth
            />
        </Grid>
        <Grid item xs={6}>
            <TextField
                label="Phone number"
                id="phoneNumber"
                value={props.form.phoneNumber}
                name="phoneNumber"
                onChange={props.onChange}
                fullWidth
            />
        </Grid>
        <Grid item xs={12}>
            <Autocomplete
                options={props.shortSC}
                onChange={props.onSelectChange}
                getOptionLabel={i => i.name}
                getOptionSelected={(o, s) => o.id === s.id}
                loading={props.loading}
                value={props.form.serviceCenter || null}
                renderInput={autocompleteRender({label: "Service Center", fullWidth: true})}
            />
        </Grid>
    </Grid>
}
export const TechnicianForm: React.FC<TTFormProps> = props => {
    return <Grid container spacing={3}>
        <Grid item xs={6}>
            <TextField
                id="firstName"
                value={props.form.firstName}
                onChange={props.onChange}
                name="firstName"
                fullWidth
                label="First name" />
        </Grid>
        <Grid item xs={6}>
            <TextField
                id="lastName"
                fullWidth
                value={props.form.lastName}
                onChange={props.onChange}
                name="lastName"
                label="Last name" />
        </Grid>
        <Grid item xs={6}>
            <TextField
                id="email"
                name="email"
                fullWidth
                value={props.form.email}
                onChange={props.onChange}
                label="Email"
            />
        </Grid>
        <Grid item xs={6}>
            <TextField
                id="phoneNumber"
                name="phoneNumber"
                fullWidth
                value={props.form.phoneNumber}
                onChange={props.onChange}
                label="Phone number"
            />
        </Grid>
        <Grid item xs={6}>
            <Autocomplete
                options={props.shortSC}
                onChange={props.onSelectChange}
                getOptionLabel={i => i.name}
                getOptionSelected={(o, s) => o.id === s.id}
                loading={props.loading}
                value={props.form.serviceCenter || null}
                renderInput={autocompleteRender({label: "Service center", fullWidth: true})}
            />
        </Grid>
        <Grid item xs={6}>
            <ToggleButtons
                value={props.form.technicianLevel}
                label="Technician level"
                buttons={[
                    {id: "1", label: "1", value: 1},
                    {id: "2", label: "2", value: 2},
                    {id: "3", label: "3", value: 3}
                ]}
                exclusive
                onChange={props.onSwitch}
            />
        </Grid>
        <Grid container item xs={6} spacing={2}>
            <Grid item xs={6}>
                <TextField
                    id="hourlyRate"
                    name="hourlyRate"
                    label="Hourly rate"
                    type="number"
                    fullWidth
                    onChange={props.onChange}
                    value={props.form.hourlyRate}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    id="overtimeRate"
                    name="overtimeRate"
                    label="Overtime rate"
                    type="number"
                    fullWidth
                    onChange={props.onChange}
                    value={props.form.overtimeRate}
                />
            </Grid>
        </Grid>
        <Grid item xs={6}>
            <Autocomplete
                renderInput={autocompleteRender({label: "Certificate"})}
                options={[]}
            />
        </Grid>
    </Grid>
}