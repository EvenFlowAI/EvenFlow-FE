import React from "react";
import {Divider, FormControlLabel, Grid, Switch} from "@material-ui/core";
import {TextField} from "../../../../formControls/TextFieldStyled/TextField";
import {checkEmail} from "../../../../../utils/utils";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../../../utils/autocompleteRenders";
import {superRoles} from "../constants";
import {userRoles, widerUserRoles} from "../../../../../utils/constants";
import {TRole} from "../../../../../store/reducers/users/types";
import {TAdvisorForm, TConsultantOption, TDMSConsultantChange, TSelectChange} from "../types";
import {IServiceCenter} from "../../../../../store/reducers/serviceCenters/types";
import {useCurrentUser} from "../../../../../hooks/useCurrentUser/useCurrentUser";

type TAFormProps = {
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onRoleChange: (e: any, value: TRole) => void,
    onSelectChange: TSelectChange,
    form: TAdvisorForm,
    isEdit: boolean,
    loading: boolean,
    shortSC: IServiceCenter[];
    dmsConsultants: TConsultantOption[];
    onDMSConsultantChange: TDMSConsultantChange;
    onShowOnBookingChange: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    formIsChecked: boolean;
};

export const AdvisorForm: React.FC<TAFormProps> = props => {
    const currentUser = useCurrentUser();

    return <Grid container spacing={3} justify="center">
        <Grid item xs={12} sm={6}>
            <TextField
                label="First name"
                id="firstName"
                name="firstName"
                placeholder="Type First Name"
                value={props.form.firstName}
                onChange={props.onChange}
                error={!props.form.firstName?.length && props.formIsChecked}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                label="Last name"
                id="lastName"
                name="lastName"
                placeholder="Type Last Name"
                value={props.form.lastName}
                onChange={props.onChange}
                error={!props.form.lastName?.length && props.formIsChecked}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                label="Email"
                id="email"
                name="email"
                disabled={props.isEdit}
                placeholder="Type Email"
                value={props.form.email}
                onChange={props.onChange}
                error={(!props.form.email?.length && props.formIsChecked) || (!checkEmail(props.form.email) && props.formIsChecked)}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                label="Phone number"
                id="phoneNumber"
                value={props.form.phoneNumber}
                placeholder="Type Phone Number"
                name="phoneNumber"
                onChange={props.onChange}
                error={props.formIsChecked && (!props.form.phoneNumber?.length || props.form.phoneNumber?.length < 11)}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Autocomplete
                options={props.shortSC}
                onChange={props.onSelectChange}
                getOptionLabel={i => i.name}
                getOptionSelected={(o, s) => o.id === s.id}
                loading={props.loading}
                value={props.form.serviceCenter || null}
                renderInput={autocompleteRender({
                    label: "Service Center",
                    fullWidth: true,
                    placeholder: "Select Service Center",
                    error: !props.form.serviceCenter && props.formIsChecked})}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            {(props.isEdit || (props.form.role && currentUser && superRoles.includes(currentUser?.role)
                ? !widerUserRoles.includes(props.form.role)
                : !userRoles.includes(props.form.role))) ?
                <TextField
                    disabled
                    value={props.form.role}
                    fullWidth
                    label="Role"
                />
                : <Autocomplete
                    options={currentUser && superRoles.includes(currentUser?.role) ? widerUserRoles : userRoles}
                    onChange={props.onRoleChange}
                    loading={props.loading}
                    disableClearable
                    value={props.form.role || null}
                    renderInput={autocompleteRender({label: "Role", fullWidth: true, placeholder: "Select Role"})}
                />}
        </Grid>
        <Grid item xs={12}>
            <Divider color="#DADADA" style={{ margin: 0 }}/>
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
                renderInput={autocompleteRender({label: "Assign Advisor from DMS", fullWidth: true, placeholder: "Select Advisor"})}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                label="Position"
                id="position"
                value={props.form.position}
                name="position"
                placeholder="Type position"
                onChange={props.onChange}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <FormControlLabel
                labelPlacement="start"
                control={
                    <Switch
                        disabled={!props.form.dmsId}
                        name="showInBooking"
                        onChange={props.onShowOnBookingChange}
                        checked={props.form.showOnBooking || false}
                        color="primary" />
                }
                label={<span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 13 }}>Display On Booking Flow</span>} />
        </Grid>
    </Grid>
}