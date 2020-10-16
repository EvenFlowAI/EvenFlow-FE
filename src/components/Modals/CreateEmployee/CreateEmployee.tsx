import React, {useEffect, useMemo, useState} from "react";
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
import {IEmployee, IEmployeeForm} from "../../../store/reducers/employees/types";
import {createEmployee, loadAll, updateEmployee} from "../../../store/reducers/employees/actions";
import {useException, useMessage} from "../../../utils/hooks";
import {IUserForm} from "../../../store/reducers/users/types";
import {createUser, updateUser} from "../../../store/reducers/users/actions";
import {LoadingButton} from "../../UI/Button";
import {Roles} from "../../../config/constants";

export const CreateEmployee: React.FC<DialogProps<IEmployee>> = ({payload, ...props}) => {
    const isEdit = Boolean(payload?.id);
    const [role, setRole] = useState<Roles>(Roles.Technician);
    const handleChangeRole = (role: string) => {
        setRole(role as Roles);
    }
    const {shortSC, shortLoading, savingE, savingU} = useSelector((state: RootState) => ({
        shortSC: state.serviceCenters.shortSC,
        shortLoading: state.serviceCenters.shortLoading,
        savingE: state.employees.saving,
        savingU: state.users.saving,
    }));

    const [avatar, setAvatar] = useState<File | undefined>();

    const saving = savingU || savingE;
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        dispatch(loadShortSC());
    }, [dispatch]);

    const buttonStyle = (r: string) => ({
        startIcon: role === r ? <RadioButtonChecked /> : <RadioButtonUnchecked />,
        color: role === r ? "primary" as const : "default" as const
    })
    const startAdvisorForm = useMemo(() => {
        if (!payload) {
            return initialAdvisorForm;
        } else {
            return payload as TAdvisorForm;
        }
    }, [payload]);
    const [advisorForm, setAdvisorForm] = useState<TAdvisorForm>(initialAdvisorForm);
    const startTechnicianForm = useMemo(() => {
        if (!payload) {
            return initialTechnicianForm;
        } else {
            return {
                ...payload,
                hourlyRate: payload.employeeInfo?.hourlyRate || "",
                overtimeRate: payload.employeeInfo?.overtimeRate || "",
                technicianLevel: payload.employeeInfo?.skillLevel as TTechnicianLevel || 1 as TTechnicianLevel
            } as TTechnicianForm;
        }
    }, [payload]);
    const [technicianForm, setTechnicianForm] = useState<TTechnicianForm>(initialTechnicianForm);

    useEffect(() => {
        setAdvisorForm(startAdvisorForm);
        setTechnicianForm(startTechnicianForm);
        if (payload) {
            setRole(payload.role as Roles);
        }
    }, [props.open, startAdvisorForm, startTechnicianForm, payload]);

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
        let data: IEmployeeForm | IUserForm;
        if (role === Roles.Advisor) {
            data = {
                ...advisorForm,
                role,
                serviceCenterId: advisorForm.serviceCenter?.id || null
            } as IUserForm;
        } else {
            data = {
                firstName: technicianForm.firstName,
                lastName: technicianForm.lastName,
                email: technicianForm.email || undefined,
                phoneNumber: technicianForm.phoneNumber,
                serviceCenterId: technicianForm.serviceCenter?.id || null,
                employeeInfo: {
                    hourlyRate: technicianForm.hourlyRate || 0,
                    overtimeRate: technicianForm.overtimeRate || 0,
                    skillLevel: technicianForm.technicianLevel
                }
            } as IEmployeeForm;
        }
        try {
            if (role === Roles.Advisor) {
                if (payload?.id) {
                    await dispatch(updateUser(data as IUserForm, payload.id, avatar));
                } else {
                    await dispatch(createUser(data as IUserForm, avatar));
                }
            } else {
                if (payload?.id) {
                    await dispatch(updateEmployee(data as IEmployeeForm, payload.id, avatar));
                } else {
                    await dispatch(createEmployee(data as IEmployeeForm, avatar));
                }
            }
            dispatch(loadAll());
            showMessage(`Employee ${isEdit ? "updated" : "created"}`);
            setTechnicianForm(initialTechnicianForm);
            setAdvisorForm(initialAdvisorForm);
            if (props.onAction) {
                props.onAction();
            }
            props.onClose();
        } catch (e) {
            showError(e);
        }
    }

    return <BaseModal {...props} width={700}>
        <DialogTitle onClose={props.onClose}>
            {isEdit ? `Edit ${payload?.role}` : "I want to add new"}
        </DialogTitle>
        <DialogContent>
            {!isEdit ? <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Button
                        {...buttonStyle(Roles.Technician)}
                        style={{textTransform: "capitalize"}}
                        fullWidth
                        variant="outlined"
                        onClick={() => handleChangeRole(Roles.Technician)}>
                        Technician
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        {...buttonStyle(Roles.Advisor)}
                        style={{textTransform: "capitalize"}}
                        fullWidth
                        variant="outlined"
                        onClick={() => handleChangeRole(Roles.Advisor)}>
                        Service center advisor
                    </Button>
                </Grid>
            </Grid> : null}
            {isEdit ? null : <Divider />}
            <AvatarContainer onChange={(f) => setAvatar(f)} dataUrl={payload?.avatarPath} />
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
            <LoadingButton
                loading={saving}
                color="primary"
                onClick={handleCreate}
                variant="contained">
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
}