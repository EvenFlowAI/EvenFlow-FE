import React, {useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal";
import {Button, TableBody, TableHead} from "@material-ui/core";
import {DialogProps} from "../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useException, useMessage} from "../../../../utils/hooks";
import {EAdvisorAssignMethod, IAdvisorAssignment} from "../../../../store/reducers/serviceCenters/types";
import {Loading} from "../../../UI/Loading";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {loadAdvisorAssignment, updateAdvisorAssignment} from "../../../../store/reducers/serviceCenters/actions";
import {DemandTable} from "../../../styled/DemandTable";
import {TableRow} from "../../../styled/TableRow";
import {useStyles} from "./styles";
import {TableCellWithPadding} from "../../../styled/TableCellWithPadding";

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
        const {primaryMethod, secondaryMethod} = advisorAssignment;
        setPrimaryMethod( primaryMethod ?? null);
        setSecondaryMethod(secondaryMethod ?? null);
        setNoAssignment((primaryMethod === null || primaryMethod === undefined) && (secondaryMethod === null || secondaryMethod === undefined));
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
        const data: IAdvisorAssignment = {primaryMethod};
        if (secondaryMethod !== null) data.secondaryMethod = secondaryMethod;
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
                                <TableCellWithPadding style={{color: "#9FA2B4", fontSize: 12}} align="left">Option</TableCellWithPadding>
                                <TableCellWithPadding style={{color: "#9FA2B4", fontSize: 12}} align="center">Primary Method</TableCellWithPadding>
                                <TableCellWithPadding
                                    style={{color: "#9FA2B4", fontSize: 12, backgroundColor: isSecondaryDisabled ? "#F4F4F4" : ""}}
                                    align="center">
                                    Secondary Method
                                </TableCellWithPadding>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCellWithPadding>Rotational</TableCellWithPadding>
                                <TableCellWithPadding align="center">
                                    {primaryMethod === EAdvisorAssignMethod.Rotational
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange("primary", EAdvisorAssignMethod.Rotational)}/>}
                                </TableCellWithPadding>
                                <TableCellWithPadding align="center" style={{backgroundColor: isSecondaryDisabled ? "#F4F4F4" : ""}}>
                                    {secondaryMethod === EAdvisorAssignMethod.Rotational
                                        ? <RadioButtonChecked
                                            cursor={isSecondaryDisabled ? "" : "pointer"}
                                            htmlColor={isSecondaryDisabled ? "#DADADA" : "#3855F3"}/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor={isSecondaryDisabled ? "" : "pointer"}
                                            onClick={() => onChange("secondary", EAdvisorAssignMethod.Rotational)}/>}
                                </TableCellWithPadding>
                            </TableRow>
                            <TableRow>
                                <TableCellWithPadding>Max Capacity</TableCellWithPadding>
                                <TableCellWithPadding align="center">
                                    {primaryMethod === EAdvisorAssignMethod.MaxCapacity
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange("primary", EAdvisorAssignMethod.MaxCapacity)}/>}
                                </TableCellWithPadding>
                                <TableCellWithPadding align="center" style={{backgroundColor: isSecondaryDisabled ? "#E8E9ED" : ""}}>
                                    {secondaryMethod === EAdvisorAssignMethod.MaxCapacity
                                        ? <RadioButtonChecked
                                            htmlColor={isSecondaryDisabled ? "#DADADA" : "#3855F3"}
                                            cursor={isSecondaryDisabled ? "" : "pointer"}/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor={isSecondaryDisabled ? "" : "pointer"}
                                            onClick={() => onChange("secondary", EAdvisorAssignMethod.MaxCapacity)}/>}
                                </TableCellWithPadding>
                            </TableRow>
                            <TableRow>
                                <TableCellWithPadding>Last advisor</TableCellWithPadding>
                                <TableCellWithPadding align="center">
                                    {primaryMethod === EAdvisorAssignMethod.LastAdvisor
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange("primary", EAdvisorAssignMethod.LastAdvisor)}/>}
                                </TableCellWithPadding>
                                <TableCellWithPadding align="center" style={{backgroundColor: "#F4F4F4"}}>
                                    <RadioButtonUnchecked htmlColor="#DADADA"/>
                                </TableCellWithPadding>
                            </TableRow>
                            <TableRow>
                                <TableCellWithPadding>No assignment</TableCellWithPadding>
                                <TableCellWithPadding align="center">
                                    {noAssignment
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={onNoAssignmentCheck}/>}
                                </TableCellWithPadding>
                                <TableCellWithPadding align="center" style={{backgroundColor: "#F4F4F4"}}>
                                    <RadioButtonUnchecked htmlColor="#DADADA"/>
                                </TableCellWithPadding>
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