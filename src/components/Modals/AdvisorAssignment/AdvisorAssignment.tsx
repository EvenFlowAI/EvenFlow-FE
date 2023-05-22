import React, {useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DemandTable, TableRow} from "../../Optimizer/AppointmentAllocation/UI";
import {Button, TableBody, TableCell as TC, TableHead, withStyles} from "@material-ui/core";
import {DialogProps} from "../types";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useException, useMessage} from "../../../utils/hooks";
import {EAdvisorAssignMethod, IAdvisorAssignment} from "../../../store/reducers/serviceCenters/types";
import {Loading} from "../../UI/Loading";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {loadAdvisorAssignment, updateAdvisorAssignment} from "../../../store/reducers/serviceCenters/actions";

const useStyles = makeStyles(() => ({
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
}))

export const TableCell = withStyles({
    root: {
        padding: "12px 16px !important",
    }
})(TC);

type TMethod = "primary"|"secondary"

const AdvisorAssignment: React.FC<DialogProps> = (props) => {
    const {selectedSC, advisorAssignment, advisorAssignmentLoading} = useSelector((state: RootState) => state.serviceCenters);
    const [primaryMethod, setPrimaryMethod] = useState<EAdvisorAssignMethod|null>(null);
    const [secondaryMethod, setSecondaryMethod] = useState<EAdvisorAssignMethod|null>(null);
    const [noAssignment, setNoAssignment] = useState<boolean>(false);
    const isSecondaryDisabled = useMemo(() => primaryMethod !== EAdvisorAssignMethod.LastAdvisor
        || noAssignment,[primaryMethod])

    const classes = useStyles();
    const dispatch = useDispatch();
    const showError = useException()
    const showMessage = useMessage();

    useEffect(() => {
        if (props.open) {
            selectedSC && dispatch(loadAdvisorAssignment(selectedSC.id))
        }
    }, [props.open, selectedSC])

    useEffect(() => {
        setPrimaryMethod( advisorAssignment.primaryMethod ?? null);
        setSecondaryMethod(advisorAssignment.secondaryMethod ?? null);
    }, [advisorAssignment])

    const onCancel = () => {
        setPrimaryMethod(null);
        setSecondaryMethod(null);
        setNoAssignment(false);
        props.onClose();
    }

    const onSuccess = () => {
        showMessage('The Methods of Assigning Advisors to Appointments updated')
        onCancel();
    }

    const onError = (err: string) => {
        showError(err);
    }

    const onSave = () => {
        const data: IAdvisorAssignment = {
            primaryMethod,
            secondaryMethod
        }
        selectedSC && dispatch(updateAdvisorAssignment(selectedSC.id, data, onSuccess, onError))
    }

    const onChange = (method: TMethod, type: EAdvisorAssignMethod) => {
        setNoAssignment(false)
        if (method === "primary") {
            setPrimaryMethod(type)
            if (type !== EAdvisorAssignMethod.LastAdvisor) setSecondaryMethod(null);
        } else {
            !isSecondaryDisabled && setSecondaryMethod(type)
        }
    }

    const onNoAssignmentCheck = () => {
        const noAssignmentSelected = !noAssignment;
        setNoAssignment(prev => !prev)
        if (noAssignmentSelected) {
            setPrimaryMethod(null);
            setSecondaryMethod(null);
        }
    }

    return (
        <BaseModal {...props} width={550} onClose={onCancel}>
            <DialogTitle
                onClose={onCancel}
                style={{textTransform: 'uppercase', color: "#575757", padding: '16px 48px'}}>
                Method to assign advisors to appointments
            </DialogTitle>
            <DialogContent>
                {advisorAssignmentLoading
                    ? <Loading/>
                    : <DemandTable>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{color: "#9FA2B4", fontSize: 12}} align="left">Option</TableCell>
                                <TableCell style={{color: "#9FA2B4", fontSize: 12}} align="center">Primary Method</TableCell>
                                <TableCell
                                    style={{color: "#9FA2B4", fontSize: 12, backgroundColor: isSecondaryDisabled ? "#F4F4F4" : ""}}
                                    align="center">
                                    Secondary Method
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Rotational</TableCell>
                                <TableCell align="center">
                                    {primaryMethod === EAdvisorAssignMethod.Rotational
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange("primary", EAdvisorAssignMethod.Rotational)}/>}
                                </TableCell>
                                <TableCell align="center" style={{backgroundColor: isSecondaryDisabled ? "#F4F4F4" : ""}}>
                                    {secondaryMethod === EAdvisorAssignMethod.Rotational
                                        ? <RadioButtonChecked
                                            cursor={isSecondaryDisabled ? "" : "pointer"}
                                            htmlColor={isSecondaryDisabled ? "#DADADA" : "#3855F3"}/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor={isSecondaryDisabled ? "" : "pointer"}
                                            onClick={() => onChange("secondary", EAdvisorAssignMethod.Rotational)}/>}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Max Capacity</TableCell>
                                <TableCell align="center">
                                    {primaryMethod === EAdvisorAssignMethod.MaxCapacity
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange("primary", EAdvisorAssignMethod.MaxCapacity)}/>}
                                </TableCell>
                                <TableCell align="center" style={{backgroundColor: isSecondaryDisabled ? "#E8E9ED" : ""}}>
                                    {secondaryMethod === EAdvisorAssignMethod.MaxCapacity
                                        ? <RadioButtonChecked
                                            htmlColor={isSecondaryDisabled ? "#DADADA" : "#3855F3"}
                                            cursor={isSecondaryDisabled ? "" : "pointer"}/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor={isSecondaryDisabled ? "" : "pointer"}
                                            onClick={() => onChange("secondary", EAdvisorAssignMethod.MaxCapacity)}/>}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Last advisor</TableCell>
                                <TableCell align="center">
                                    {primaryMethod === EAdvisorAssignMethod.LastAdvisor
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange("primary", EAdvisorAssignMethod.LastAdvisor)}/>}
                                </TableCell>
                                <TableCell align="center"  style={{backgroundColor: isSecondaryDisabled ? "#F4F4F4" : ""}}>
                                    {secondaryMethod === EAdvisorAssignMethod.LastAdvisor
                                        ? <RadioButtonChecked
                                            htmlColor={isSecondaryDisabled ? "#DADADA" : "#3855F3"}
                                            cursor={isSecondaryDisabled ? "" : "pointer"}/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor={isSecondaryDisabled ? "" : "pointer"}
                                            onClick={() => onChange("secondary", EAdvisorAssignMethod.LastAdvisor)}/>}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>No assignment</TableCell>
                                <TableCell align="center">
                                    {noAssignment
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={onNoAssignmentCheck}/>}
                                </TableCell>
                                <TableCell align="center" style={{backgroundColor: "#F4F4F4"}}>
                                    <RadioButtonUnchecked htmlColor="#DADADA"/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </DemandTable>
                }
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            disabled={advisorAssignmentLoading}
                            onClick={onCancel}
                            className={classes.cancelButton}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={advisorAssignmentLoading}
                            className={classes.saveButton}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default AdvisorAssignment;