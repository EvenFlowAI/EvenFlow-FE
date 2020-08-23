import React, {useEffect, useState} from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {Button, Grid} from "@material-ui/core";
import {TTechnicianLevel} from "../../../types/types";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadShortSC} from "../../../store/reducers/serviceCenters/actions";
import {makeStyles} from "@material-ui/core/styles";
import {TAdvisorForm, TTechnicianForm} from "./types";
import {AdvisorForm, initialAdvisorForm, initialTechnicianForm, TechnicianForm} from "./Forms";
import {TSelectChange} from "./types";

const useStyles = makeStyles({
    toggleButtonGroup: {
        width: "100%"
    }
});

enum Roles {
    Advisor= 'Advisor',
    Technician= 'Technician'
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