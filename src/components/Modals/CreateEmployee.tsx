import React, {useState} from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "./BaseModal";
import {DialogProps} from "./types";
import {Button, Grid} from "@material-ui/core";
import {ModalForm, TFormItem, TModalFormProps} from "./ModalForm";
import {TTechnicianLevel} from "../../types/types";
import {TextField} from "../UI/TextField";

enum Roles {
    Advisor= 'Advisor',
    Technician= 'Technician'
}
type TAdvisorForm = {
    firstName: string;
    lastName: string;
    serviceCenter: number | null;
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

const advisorFormItems: TFormItem<TAdvisorForm>[][] = [
    [
        {value: d => d.firstName, id: "firstName", label: "First name"},
        {value: d => d.lastName, id: "lastName", label: "Last name"},
    ]
]
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

const AdvisorForm: React.FC<{
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onSelectChange: React.ChangeEventHandler<HTMLInputElement>,
    form: TAdvisorForm,
}> = props => {
    return <Grid container spacing={3}>
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
    </Grid>
}
const TechnicianForm = <I extends {}>(props: TModalFormProps<I>) => <ModalForm {...props} />;

export const CreateEmployee: React.FC<DialogProps> = (props) => {
    const [role, setRole] = useState<Roles.Advisor | Roles.Technician>(Roles.Advisor);
    const toggleRole = () => {
        setRole(role === Roles.Technician ? Roles.Advisor : Roles.Technician);
    }

    const [advisorForm, setAdvisorForm] = useState<TAdvisorForm>(initialAdvisorForm);
    const [technicianForm, setTechnicianForm] = useState<TTechnicianForm>(initialTechnicianForm);

    const handleChange = (r: Roles.Advisor | Roles.Technician): React.ChangeEventHandler<HTMLInputElement> => e => {
        if (r === Roles.Advisor) {
            setAdvisorForm({...advisorForm, [e.target.name]: e.target.value});
        } else {
            setTechnicianForm({...technicianForm, [e.target.name]: e.target.value});
        }
    }
    const handleSelectChange = (r: Roles.Advisor | Roles.Technician): React.ChangeEventHandler => e => {
        if (r === Roles.Advisor) {

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