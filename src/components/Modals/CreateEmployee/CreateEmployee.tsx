import React, {useEffect, useState} from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {Button, Divider, Grid} from "@material-ui/core";
import {TTechnicianLevel} from "../../../types/types";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadShortSC} from "../../../store/reducers/serviceCenters/actions";
import {TAdvisorForm, TTechnicianForm} from "./types";
import {AdvisorForm, initialAdvisorForm, initialTechnicianForm, TechnicianForm} from "./Forms";
import {TSelectChange} from "./types";
import {IEmployeeForm} from "../../../store/reducers/employees/types";
import {createEmployee} from "../../../store/reducers/employees/actions";
import {useException, useMessage} from "../../../utils/hooks";

enum Roles {
    Advisor= 'Advisor',
    Technician= 'Technician'
}

export const CreateEmployee: React.FC<DialogProps> = (props) => {
    const [role, setRole] = useState<Roles.Advisor | Roles.Technician>(Roles.Advisor);
    const handleChangeRole = (role: string) => {
        setRole(role as Roles);
    }
    const {shortSC, shortLoading} = useSelector((state: RootState) => ({
        shortSC: state.serviceCenters.shortSC,
        shortLoading: state.serviceCenters.shortLoading
    }));
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        dispatch(loadShortSC())
    }, [dispatch]);

    const buttonStyle = (r: string) => ({
        startIcon: role === r ? <RadioButtonChecked /> : <RadioButtonUnchecked />,
        color: role === r ? "primary" as const : "default" as const
    })

    const [advisorForm, setAdvisorForm] = useState<TAdvisorForm>(initialAdvisorForm);
    const [technicianForm, setTechnicianForm] = useState<TTechnicianForm>(initialTechnicianForm);

    useEffect(() => {
        setAdvisorForm(initialAdvisorForm);
        setTechnicianForm(initialTechnicianForm)
    }, [props.open])

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
            setTechnicianForm({...technicianForm, serviceCenter: typeof value !== 'string' ? value : null});
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
    const handleCreate = async () => {
        let data: IEmployeeForm;
        if (role === Roles.Advisor) {
            data = {
                ...advisorForm,
                serviceCenterId: advisorForm.serviceCenter?.id || null
            };
        } else {
            data = {
                firstName: technicianForm.firstName,
                lastName: technicianForm.lastName,
                serviceCenterId: technicianForm.serviceCenter?.id || null,
                employeeInfo: {
                    hourlyRate: technicianForm.hourlyRate || 0,
                    overtimeRate: technicianForm.overtimeRate || 0,
                    skillLevel: technicianForm.technicianLevel
                }
            }
        }
        try {
            await dispatch(createEmployee(data));
            showMessage("Employee created");
            setTechnicianForm(initialTechnicianForm);
            setAdvisorForm(initialAdvisorForm);
            props.onClose();
        } catch (e) {
            showError(e);
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
            <Divider />
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
            <Divider />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button
                color="primary"
                onClick={handleCreate}
                variant="contained">
                Create
            </Button>
        </DialogActions>
    </BaseModal>
}