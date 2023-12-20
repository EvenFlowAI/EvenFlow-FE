import React from "react";
import {Autocomplete} from "@material-ui/lab";
import {IServiceCenter} from "../../../../../store/reducers/serviceCenters/types";
import {Grid} from "@material-ui/core";
import {TextField} from "../../../../FormControls/TextFieldStyled/TextField";
import {TConsultantOption, TDMSConsultantChange, TSelectChange, TTechnicianForm} from "../types";
import {ToggleButtons} from "../../../../ToggleButtons/ToggleButtons";
import {autocompleteRender} from "../../../../../utils/AutocompleteRender";
import {checkEmail} from "../../../../../utils/utils";
import 'react-phone-number-input/style.css'

type TTFormProps = {
    isEdit: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onSelectChange: TSelectChange,
    loading: boolean,
    shortSC: IServiceCenter[]
    form: TTechnicianForm
    onSwitch: (e: React.ChangeEvent<{}>, newVal: number) => void
    dmsConsultants: TConsultantOption[];
    onDMSConsultantChange: TDMSConsultantChange;
    formIsChecked: boolean;
};


export const TechnicianForm: React.FC<TTFormProps> = props => {
    return <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
            <TextField
                id="firstName"
                value={props.form.firstName}
                onChange={props.onChange}
                placeholder="Type First name"
                name="firstName"
                fullWidth
                error={!props.form.firstName?.length && props.formIsChecked}
                label="First name" />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                id="lastName"
                fullWidth
                value={props.form.lastName}
                onChange={props.onChange}
                error={!props.form.lastName?.length && props.formIsChecked}
                placeholder="Type Last name"
                name="lastName"
                label="Last name" />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                id="email"
                name="email"
                fullWidth
                disabled={props.isEdit}
                placeholder="Type Email"
                value={props.form.email}
                error={Boolean(props.form.email?.length) && !checkEmail(props.form.email) && props.formIsChecked}
                onChange={props.onChange}
                label="Email"
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Type Phone Number"
                fullWidth
                error={props.formIsChecked && (!props.form.phoneNumber?.length || props.form.phoneNumber?.length < 11)}
                value={props.form.phoneNumber}
                onChange={props.onChange}
                label="Phone Number"
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Autocomplete
                disabled={props.isEdit}
                options={props.shortSC}
                onChange={props.onSelectChange}
                getOptionLabel={i => i.name}
                getOptionSelected={(o, s) => o.id === s.id}
                loading={props.loading}
                value={props.form.serviceCenter || null}
                renderInput={autocompleteRender({
                    label: "Service center",
                    fullWidth: true,
                    placeholder: "Select Service Center",
                    error: !props.form.serviceCenter && props.formIsChecked
                })}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <ToggleButtons
                value={props.form.technicianLevel}
                label="Technician Level"
                buttons={[
                    {id: "1", label: "1", value: 1},
                    {id: "2", label: "2", value: 2},
                    {id: "3", label: "3", value: 3}
                ]}
                exclusive
                onChange={props.onSwitch}
            />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField
                        id="hourlyRate"
                        name="hourlyRate"
                        label="Hourly rate"
                        placeholder="Enter Rate"
                        type="number"
                        fullWidth
                        onChange={props.onChange}
                        value={props.form.hourlyRate}
                        error={!props.form.hourlyRate && props.formIsChecked}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="overtimeRate"
                        name="overtimeRate"
                        label="Overtime rate"
                        placeholder="Enter Rate"
                        type="number"
                        fullWidth
                        onChange={props.onChange}
                        error={!props.form.overtimeRate && props.formIsChecked}
                        value={props.form.overtimeRate}
                    />
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Autocomplete
                options={props.dmsConsultants}
                onChange={props.onDMSConsultantChange}
                getOptionLabel={i => i.name}
                getOptionSelected={(o, s) => o.id === s.id}
                disabled={props.loading}
                loading={props.loading}
                value={props.form?.dmsId ? props.dmsConsultants.find(item => item.id.toString() === props.form.dmsId) : null}
                renderInput={autocompleteRender({label: "Assign Technician from DMS", fullWidth: true, placeholder: "Select Technician"})}
            />
        </Grid>
    </Grid>
}