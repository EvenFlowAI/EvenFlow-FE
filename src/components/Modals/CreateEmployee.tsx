import React, {useEffect, useState} from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "./BaseModal";
import {DialogProps} from "./types";
import {Button, Grid} from "@material-ui/core";
import {ModalForm, TFormItem, TModalFormProps} from "./ModalForm";
import {TTechnicianLevel} from "../../types/types";
import {TextField} from "../UI/TextField";
import {Autocomplete, Value} from "@material-ui/lab";
import {IServiceCenter} from "../../store/reducers/serviceCenters/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {loadShortSC} from "../../store/reducers/serviceCenters/actions";

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
    serviceCenter: number | null;
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

const technicianFormItems: TFormItem<TTechnicianForm>[][] = [
    [
        {value: d => d.firstName, id: "firstName", label: "First name"},
        {value: d => d.lastName, id: "lastName", label: "Last name"},
    ],
    [
        {value: d => d.hourlyRate ? d.hourlyRate.toString() : '', id: "hourlyRate", label: "Hourly rate", inputType: "number"},
        {value: d => d.overtimeRate ? d.overtimeRate.toString() : '', id: "overtimeRate", label: "Overtime rate", inputType: "number"},
    ]
]
type TSelectChange = (e: React.ChangeEvent<{}>, value: Value<IServiceCenter, false, any, any>) => void;
const AdvisorForm: React.FC<{
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onSelectChange: TSelectChange,
    form: TAdvisorForm,
    loading: boolean,
    shortSC: IServiceCenter[]
}> = props => {
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
const TechnicianForm = <I extends {}>(props: TModalFormProps<I>) => <ModalForm {...props} />;

export const CreateEmployee: React.FC<DialogProps> = (props) => {
    const [role, setRole] = useState<Roles.Advisor | Roles.Technician>(Roles.Advisor);
    const toggleRole = () => {
        setRole(role === Roles.Technician ? Roles.Advisor : Roles.Technician);
    }
    const {shortSC, shortLoading} = useSelector((state: RootState) => ({
        shortSC: state.serviceCenters.shortSC,
        shortLoading: state.serviceCenters.shortLoading
    }));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadShortSC())
    }, [dispatch]);

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

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>
            I want to add new
        </DialogTitle>
        <DialogContent>
            <AvatarContainer />
            {role === Roles.Advisor
                ? <AdvisorForm
                    form={advisorForm}
                    onSelectChange={handleSelectChange(Roles.Advisor)}
                    shortSC={shortSC}
                    loading={shortLoading}
                    onChange={handleChange(Roles.Advisor)} />
                : <TechnicianForm<TTechnicianForm>
                    items={technicianFormItems}
                    values={technicianForm}
                    onChange={handleChange(Roles.Technician)}
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