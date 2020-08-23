import React from "react";
import {Autocomplete, ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {IServiceCenter} from "../../../store/reducers/serviceCenters/types";
import {Grid} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {TAdvisorForm, TSelectChange, TTechnicianForm} from "./types";


export const initialAdvisorForm: TAdvisorForm = {
    firstName: '', lastName: '', serviceCenter: null
}
export const initialTechnicianForm: TTechnicianForm = {
    firstName: '', lastName: '', serviceCenter: null,
    hourlyRate: '', overtimeRate: '', technicianLevel: 1
}


type TAFormProps = {
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onSelectChange: TSelectChange,
    form: TAdvisorForm,
    loading: boolean,
    shortSC: IServiceCenter[]
};
type TTFormProps = TAFormProps & {
    form: TTechnicianForm
    onSwitch: (e: React.ChangeEvent<{}>, newVal: number) => void
};
export const AdvisorForm: React.FC<TAFormProps> = props => {
    return <Grid container spacing={3} justify="center">
        <Grid item xs={8}>
            <TextField
                label="First name"
                id="firstName"
                name="firstName"
                onChange={props.onChange}
                fullWidth
            />
        </Grid>
        <Grid item xs={8}>
            <TextField
                label="Last name"
                id="lastName"
                name="lastName"
                onChange={props.onChange}
                fullWidth
            />
        </Grid>
        <Grid item xs={8}>
            <Autocomplete
                options={props.shortSC}
                onChange={props.onSelectChange}
                getOptionLabel={i => i.name}
                loading={props.loading}
                value={props.form.serviceCenter}
                renderInput={params => <div ref={params.InputProps.ref}>
                    <TextField label="Service center"
                               {...params.inputProps}
                               fullWidth
                               endAdornment={params.InputProps.endAdornment} />
                </div>}
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
            <Autocomplete
                options={props.shortSC}
                onChange={props.onSelectChange}
                getOptionLabel={i => i.name}
                loading={props.loading}
                value={props.form.serviceCenter}
                renderInput={params => <div ref={params.InputProps.ref}>
                    <TextField label="Service center"
                               {...params.inputProps}
                               fullWidth
                               endAdornment={params.InputProps.endAdornment} />
                </div>}
            />
        </Grid>
        <Grid item xs={6}>
            <ToggleButtonGroup
                exclusive
                onChange={props.onSwitch}
                value={props.form.technicianLevel} color="primary">
                <ToggleButton value={1}>1</ToggleButton>
                <ToggleButton value={2}>2</ToggleButton>
                <ToggleButton value={3}>3</ToggleButton>
            </ToggleButtonGroup>
        </Grid>
        <Grid container item xs={6} spacing={2}>
            <Grid item xs={6}>
                <TextField
                    id="hourlyRate"
                    name="hourlyRate"
                    label="Hourly rate"
                    type="number"
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
                    onChange={props.onChange}
                    value={props.form.overtimeRate}
                />
            </Grid>
        </Grid>
    </Grid>
}