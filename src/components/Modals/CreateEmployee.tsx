import React, {useEffect, useState} from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "./BaseModal";
import {DialogProps} from "./types";
import {Button, Grid} from "@material-ui/core";
import {TTechnicianLevel} from "../../types/types";
import {TextField} from "../UI/TextField";
import {Autocomplete, ToggleButton, ToggleButtonGroup, Value} from "@material-ui/lab";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {IServiceCenter} from "../../store/reducers/serviceCenters/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {loadShortSC} from "../../store/reducers/serviceCenters/actions";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    toggleButtonGroup: {
        width: "100%"
    }
});

enum Roles {
    Advisor= 'Advisor',
    Technician= 'Technician'
}
type TAdvisorForm = {
    firstName: string;
    lastName: string;
    serviceCenter: IServiceCenter | null;
}
type TTechnicianForm = {
    firstName: string;
    lastName: string;
    serviceCenter: IServiceCenter | null;
    hourlyRate: number | null;
    overtimeRate: number | null;
    technicianLevel: TTechnicianLevel;
}

const initialAdvisorForm: TAdvisorForm = {
    firstName: '', lastName: '', serviceCenter: null
}
const initialTechnicianForm: TTechnicianForm = {
    firstName: '', lastName: '', serviceCenter: null,
    hourlyRate: null, overtimeRate: null, technicianLevel: 1
}

type TSelectChange = (e: React.ChangeEvent<{}>, value: Value<IServiceCenter, false, any, any>) => void;
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
const AdvisorForm: React.FC<TAFormProps> = props => {
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
const TechnicianForm: React.FC<TTFormProps> = props => {
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
    </Grid>
}

export const CreateEmployee: React.FC<DialogProps> = (props) => {
    const classes = useStyles();

    const [role, setRole] = useState<Roles.Advisor | Roles.Technician>(Roles.Advisor);
    const handleChangeRole = (role: string) => {
        setRole(role as Roles);
    }
    const {shortSC, shortLoading} = useSelector((state: RootState) => ({
        shortSC: state.serviceCenters.shortSC,
        shortLoading: state.serviceCenters.shortLoading
    }));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadShortSC())
    }, [dispatch]);

    const buttonStyle = (r: string) => ({
        startIcon: role === r ? <RadioButtonChecked /> : <RadioButtonUnchecked />,
        color: role === r ? "primary" as const : "default" as const
    })

    const [advisorForm, setAdvisorForm] = useState<TAdvisorForm>(initialAdvisorForm);
    const [technicianForm, setTechnicianForm] = useState<TTechnicianForm>(initialTechnicianForm);

    const handleChange = (r: Roles.Advisor | Roles.Technician): React.ChangeEventHandler<HTMLInputElement> => e => {
        if (r === Roles.Advisor) {
            setAdvisorForm({...advisorForm, [e.target.name]: e.target.value});
        } else {
            setTechnicianForm({...technicianForm, [e.target.name]: e.target.value});
        }
    }
    const handleSelectChange = (r: Roles.Advisor | Roles.Technician): TSelectChange => (e, value) => {
        if (r === Roles.Advisor) {
            setAdvisorForm({...advisorForm, serviceCenter: typeof value !== 'string' ? value : null});
        } else {

        }
    }
    const handleSwitchChange = (e: React.ChangeEvent<{}>, newVal: number) => {
        if (newVal) {
            setTechnicianForm({
                ...technicianForm,
                technicianLevel: newVal as TTechnicianLevel
            });
        }
    }

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>
            I want to add new
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Button
                        {...buttonStyle(Roles.Advisor)}
                        fullWidth
                        variant="outlined"
                        onClick={() => handleChangeRole(Roles.Advisor)}>
                        Service center advisor
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        {...buttonStyle(Roles.Technician)}
                        fullWidth
                        variant="outlined"
                        onClick={() => handleChangeRole(Roles.Technician)}>
                        Technician
                    </Button>
                </Grid>
            </Grid>
            <AvatarContainer />
            {role === Roles.Advisor
                ? <AdvisorForm
                    form={advisorForm}
                    onSelectChange={handleSelectChange(Roles.Advisor)}
                    shortSC={shortSC}
                    loading={shortLoading}
                    onChange={handleChange(Roles.Advisor)} />
                : <TechnicianForm
                    form={technicianForm}
                    loading={shortLoading}
                    shortSC={shortSC}
                    onSwitch={handleSwitchChange}
                    onChange={handleChange(Roles.Technician)}
                    onSelectChange={handleSelectChange(Roles.Technician)}
                />
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button
                color="primary"
                variant="contained">
                Create
            </Button>
        </DialogActions>
    </BaseModal>
}