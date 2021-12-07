import React, {useEffect, useMemo, useState} from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {Button, Divider, Grid} from "@material-ui/core";
import {TTechnicianLevel} from "../../../types/types";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadShortSC} from "../../../store/reducers/serviceCenters/actions";
import {TAdvisorForm, TDMSConsultantChange, TSelectChange, TTechnicianForm} from "./types";
import {AdvisorForm, initialAdvisorForm, initialTechnicianForm, TechnicianForm} from "./Forms";
import {IEmployee, IEmployeeForm} from "../../../store/reducers/employees/types";
import {createEmployee, loadAll, loadDMSAdvisors, updateEmployee} from "../../../store/reducers/employees/actions";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {IUserForm, TRole} from "../../../store/reducers/users/types";
import {createUser, updateUser} from "../../../store/reducers/users/actions";
import {LoadingButton} from "../../UI/Button";
import {Roles} from "../../../config/constants";
import {validatePhoneNumber} from "../../../utils/utils";

export const CreateEmployee: React.FC<DialogProps<IEmployee>> = ({payload, onAction, ...props}) => {
    const isEdit = Boolean(payload?.id);
    const [role, setRole] = useState<Roles>(Roles.Technician);
    const handleChangeRole = (role: string) => {
        setRole(role as Roles);
    }
    const {shortSC, shortLoading, savingE, savingU, DmsAdvisors} = useSelector((state: RootState) => ({
        shortSC: state.serviceCenters.shortSC,
        shortLoading: state.serviceCenters.shortLoading,
        savingE: state.employees.saving,
        savingU: state.users.saving,
        DmsAdvisors: state.scEmployees.DmsAdvisors
    }));

    const [avatar, setAvatar] = useState<File | undefined>();

    const saving = savingU || savingE;
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const {selectedSC} = useSCs();

    useEffect(() => {
        dispatch(loadShortSC());
    }, [dispatch]);

    useEffect(() => {
        if (selectedSC) dispatch(loadDMSAdvisors(selectedSC.id))
    }, [selectedSC, dispatch])

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
            setRole(payload.role === Roles.Technician ? Roles.Technician : Roles.Advisor);
        }
    }, [props.open, startAdvisorForm, startTechnicianForm, payload]);

    const handleChange = (r: Roles.Advisor | Roles.Technician): React.ChangeEventHandler<HTMLInputElement> => ({target: {name, value}}) => {
        if (name === "phoneNumber") {
            value = validatePhoneNumber(value);
        }
        if (r === Roles.Advisor) {
            setAdvisorForm({...advisorForm, [name]: value});
        } else {
            setTechnicianForm({...technicianForm, [name]: value});
        }
    }
    const handleSelectChange = (r: Roles.Advisor | Roles.Technician): TSelectChange => (e, value) => {
        if (r === Roles.Advisor) {
            setAdvisorForm({...advisorForm, serviceCenter: typeof value !== 'string' ? value : null});
        } else {
            setTechnicianForm({...technicianForm, serviceCenter: typeof value !== 'string' ? value : null});
        }
    }

    const handleShowOnBookingChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setAdvisorForm(prev => ({...prev, showOnBooking: checked}));
    }

    const handleDMSConsultantChange =  (r: Roles.Advisor | Roles.Technician): TDMSConsultantChange => (e, value) => {
        if (r === Roles.Advisor) {
            setAdvisorForm(prev => ({...prev, dmsId: value ? +value.id : null}));
        }
    }
    const handleRoleChange = (e: any, value: TRole) => {
        setAdvisorForm({...advisorForm, role: value});
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
        if (role !== Roles.Technician) {
            data = {
                ...advisorForm,
                dmsId: advisorForm?.dmsId ? +advisorForm?.dmsId : null,
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
            if (role !== Roles.Technician) {
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
            if (onAction) {
                onAction();
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
                <Grid item xs={12} sm={6}>
                    <Button
                        {...buttonStyle(Roles.Technician)}
                        style={{textTransform: "capitalize"}}
                        fullWidth
                        variant="outlined"
                        onClick={() => handleChangeRole(Roles.Technician)}>
                        Technician
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        {...buttonStyle(Roles.Advisor)}
                        style={{textTransform: "capitalize"}}
                        fullWidth
                        variant="outlined"
                        onClick={() => handleChangeRole(Roles.Advisor)}>
                        User Account
                    </Button>
                </Grid>
            </Grid> : null}
            {isEdit ? null : <Divider />}
            <AvatarContainer onChange={(f) => setAvatar(f)} dataUrl={payload?.avatarPath} />
            {role === Roles.Advisor
                ? <AdvisorForm
                    onShowOnBookingChange={handleShowOnBookingChange}
                    dmsConsultants={DmsAdvisors}
                    form={advisorForm}
                    isEdit={Boolean(payload)}
                    onDMSConsultantChange={handleDMSConsultantChange(Roles.Advisor)}
                    onSelectChange={handleSelectChange(Roles.Advisor)}
                    onRoleChange={handleRoleChange}
                    shortSC={shortSC}
                    loading={shortLoading}
                    onChange={handleChange(Roles.Advisor)} />
                : <TechnicianForm
                    form={technicianForm}
                    isEdit={isEdit}
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