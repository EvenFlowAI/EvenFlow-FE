import React, {Dispatch, SetStateAction, useMemo, useState} from "react";
import { Autocomplete } from '@mui/material';
import {Divider, FormControlLabel, Grid, Switch} from "@mui/material";
import {TextField} from "../../../../formControls/TextFieldStyled/TextField";
import {TDMSConsultantChange, TEmployeeForm, TSelectChange} from "../types";
import {ToggleButtons} from "../../../../buttons/ToggleButtons/ToggleButtons";
import {
    autocompleteRender
} from "../../../../../utils/autocompleteRenders";
import {checkEmail, validatePhoneNumber} from "../../../../../utils/utils";
import 'react-phone-number-input/style.css'
import {DmsRoles, superRoles} from "../constants";
import {userRoles, widerUserRoles} from "../../../../../utils/constants";
import {useCurrentUser} from "../../../../../hooks/useCurrentUser/useCurrentUser";
import {Roles, TTechnicianLevel} from "../../../../../types/types";
import {loadDMSAdvisors} from "../../../../../store/reducers/employees/actions";
import {TRole} from "../../../../../store/reducers/users/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {IServiceCenter} from "../../../../../store/reducers/serviceCenters/types";
import {useMultipleAutocompleteStyles} from "./styles";

type TTFormProps = {
    isEdit: boolean;
    form: TEmployeeForm;
    formIsChecked: boolean;
    setFormIsChecked: Dispatch<SetStateAction<boolean>>;
    setEmployeeForm: Dispatch<SetStateAction<TEmployeeForm>>;
};

export const CreateEmployeeForm: React.FC<React.PropsWithChildren<React.PropsWithChildren<TTFormProps>>> = ({
                                                              setEmployeeForm,
                                                              setFormIsChecked,
                                                              formIsChecked,
                                                              form,
                                                              isEdit}) => {
    const {shortSC, shortLoading} = useSelector((state: RootState) => state.serviceCenters);
    const {DmsAdvisors: dmsAdvisors} = useSelector((state: RootState) => state.scEmployees);
    const {loadingDMSAdvisors} = useSelector((state: RootState) => state.employees);

    const [serviceCenters, setServiceCenters] = useState<IServiceCenter[]>([])
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();

    // todo multiple service centers
    const autocompleteClasses = useMultipleAutocompleteStyles();
    const dmsOptions = useMemo(() => dmsAdvisors.filter(el => el.role && form.role && DmsRoles[el.role] === form.role),
        [dmsAdvisors, form.role])
    const dmsAdvisor = useMemo(() => form?.dmsId && dmsAdvisors.length ? dmsAdvisors.find(item => item.dmsId === form.dmsId) : null,
        [form?.dmsId, dmsAdvisors])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}})  => {
        setFormIsChecked(false);
        if (name === "phoneNumber") {
            value = validatePhoneNumber(value);
        }
        setEmployeeForm(prev => ({...prev, [name]: value}));
    }

    const handleSelectChange: TSelectChange = (e, value) => {
        setFormIsChecked(false);
        if (value?.id) {
            dispatch(loadDMSAdvisors(value.id))
        }
        setEmployeeForm(prev => ({...prev, serviceCenter: value ?? null}));
    }

    const handleServiceCentersChange = (e: React.ChangeEvent<{}>, options: IServiceCenter[]) => {
        setServiceCenters(options)
    }

    const handleShowOnBookingChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setFormIsChecked(false);
        setEmployeeForm(prev => ({...prev, showOnBooking: checked}));
    }

    const handleDMSConsultantChange:TDMSConsultantChange = (e, value) => {
        setFormIsChecked(false);
        setEmployeeForm(prev => ({...prev, dmsId: value ? value.dmsId : null}));
    }

    const handleRoleChange = (e: any, value: string) => {
        setFormIsChecked(false);
        setEmployeeForm(prev => ({...prev, role: value as TRole, dmsId: null}));
    }

    const handleSwitchChange = (e: React.ChangeEvent<{}>, newVal: number) => {
        setFormIsChecked(false);
        if (newVal) {
            setEmployeeForm(prev => ({
                ...prev,
                technicianLevel: newVal as TTechnicianLevel
            }));
        }
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Type First name"
                    name="firstName"
                    fullWidth
                    error={!form.firstName?.length && formIsChecked}
                    label="First name" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="lastName"
                    fullWidth
                    value={form.lastName}
                    onChange={handleChange}
                    error={!form.lastName?.length && formIsChecked}
                    placeholder="Type Last name"
                    name="lastName"
                    label="Last name" />
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    disabled={isEdit}
                    options={shortSC}
                    onChange={handleSelectChange}
                    getOptionLabel={i => i.name}
                    isOptionEqualToValue={(o, s) => o.id === s.id}
                    loading={shortLoading}
                    value={form.serviceCenter || null}
                    renderInput={autocompleteRender({
                        label: "Service center",
                        fullWidth: true,
                        placeholder: "Select Service Center",
                        error: !form.serviceCenter && formIsChecked
                    })}
                />
            </Grid>
            {/*<Grid item xs={12}>*/}
            {/*    <Autocomplete*/}
            {/*        multiple*/}
            {/*        classes={autocompleteClasses}*/}
            {/*        disabled={isEdit}*/}
            {/*        options={shortSC}*/}
            {/*        onChange={handleServiceCentersChange}*/}
            {/*        getOptionLabel={i => i.name}*/}
            {/*        renderOption={autocompleteOptionsCheckboxRender((e) => e.name)}*/}
            {/*        getOptionSelected={(o, s) => o.id === s.id}*/}
            {/*        loading={shortLoading}*/}
            {/*        value={serviceCenters}*/}
            {/*        renderInput={autocompleteRender({*/}
            {/*            label: "Service centers",*/}
            {/*            fullWidth: true,*/}
            {/*            placeholder: "Select Service Centers",*/}
            {/*            error: !serviceCenters.length && formIsChecked*/}
            {/*        })}*/}
            {/*    />*/}
            {/*</Grid>*/}
            <Grid item xs={12} sm={6}>
                <TextField
                    id="email"
                    name="email"
                    fullWidth
                    disabled={isEdit}
                    placeholder="Type Email"
                    value={form.email}
                    error={Boolean(form.email?.length) && !checkEmail(form.email) && formIsChecked}
                    onChange={handleChange}
                    label="Email"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                {(isEdit || (form.role && currentUser && superRoles.includes(currentUser?.role)
                    ? !widerUserRoles.includes(form.role)
                    : form.role && !userRoles.includes(form.role))) ?
                    <TextField
                        disabled
                        value={form.role}
                        fullWidth
                        label="Role"
                    />
                    : <Autocomplete
                        options={currentUser && superRoles.includes(currentUser?.role) ? widerUserRoles : userRoles}
                        isOptionEqualToValue={(option, value) => option === value}
                        onChange={handleRoleChange}
                        loading={shortLoading}
                        disableClearable
                        value={form.role ?? undefined}
                        renderInput={autocompleteRender({label: "Role", fullWidth: true, placeholder: "Select Role"})}
                    />}
            </Grid>
            <Grid item xs={12}>
                <Divider color="#DADADA" style={{ margin: 0 }}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    options={dmsOptions}
                    onChange={handleDMSConsultantChange}
                    getOptionLabel={i => i.fullName ? `${i.fullName} - ${i.dmsId}` : `${i.dmsId}`}
                    isOptionEqualToValue={(o, s) => o.id === s.id}
                    disabled={!form.role || shortLoading || loadingDMSAdvisors}
                    loading={shortLoading || loadingDMSAdvisors}
                    value={dmsAdvisor}
                    renderInput={autocompleteRender({label: "Assign Employee from DMS", fullWidth: true, placeholder: "Assign Employee from DMS"})}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Position"
                    id="position"
                    value={form.position}
                    name="position"
                    placeholder="Type position"
                    onChange={handleChange}
                    fullWidth
                />
            </Grid>
            {form.role === Roles.Technician
                ? <>
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
                                    onChange={handleChange}
                                    value={form.hourlyRate}
                                    error={!form.hourlyRate && formIsChecked}
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
                                    onChange={handleChange}
                                    error={!form.overtimeRate && formIsChecked}
                                    value={form.overtimeRate}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ToggleButtons
                            value={form.technicianLevel}
                            label="Technician Level"
                            buttons={[
                                {id: "1", label: "1", value: 1},
                                {id: "2", label: "2", value: 2},
                                {id: "3", label: "3", value: 3}
                            ]}
                            exclusive
                            onChange={handleSwitchChange}
                        />
                    </Grid>
                </>
                : <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        style={{width: '100%', display: 'flex', justifyContent: 'space-between', marginLeft: 2}}
                        labelPlacement="start"
                        control={
                            <Switch
                                disabled={!form.dmsId}
                                name="showInBooking"
                                onChange={handleShowOnBookingChange}
                                checked={form.showOnBooking || false}
                                color="primary"/>
                        }
                        label={<span style={{fontWeight: 'bold', textTransform: 'uppercase', fontSize: 13}}>Display On Booking Flow</span>}/>
                </Grid>
            }
        </Grid>
    );
}