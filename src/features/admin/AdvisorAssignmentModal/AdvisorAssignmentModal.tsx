import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {Autocomplete, Button, Table, TableBody, TableCell, TableHead} from "@mui/material";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {TableRow} from "../../../components/styled/TableRow";
import {
    SelectsWrapper,
    SubCellsWrapper,
    SubCellTitle,
    TCellData,
    THeadCell,
    THeadCellWithSub,
    useStyles
} from "./styles";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {getOptions} from "../../../utils/utils";
import {TOption} from "../PodsTable/PODModal/types";
import {autocompleteRender} from "../../../utils/autocompleteRenders";
import {
    EAdvisorAssignMethod,
    EAssignmentLevel,
    IEmployeeAssignmentSetting
} from "../../../store/reducers/employees/types";
import {loadAssignmentSettings} from "../../../store/reducers/employees/actions";
import {useSCs} from "../../../hooks/useSCs/useSCs";

const methodOptions: TOption[] = getOptions(Object.keys(EAdvisorAssignMethod).filter(key => Number.isNaN(+key)))

const AdvisorAssignmentModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = (props) => {
    const {loading, assignmentSettings} = useSelector((state: RootState) => state.employees);
    const [data, setData] = useState<IEmployeeAssignmentSetting[]>([]);
    const {selectedSC} = useSCs();

    const advisorPrimaryMethod = data.find(item => item.employeeAssignmentSettings
        .find(el => el.role === 'Advisor')?.methods?.find(el => el.level === EAssignmentLevel.Primary)?.type === EAdvisorAssignMethod.LastAdvisor);
    const techPrimaryMethod = data.find(item => item.employeeAssignmentSettings
        .find(el => el.role === 'Technician')?.methods?.find(el => el.level === EAssignmentLevel.Primary)?.type === EAdvisorAssignMethod.LastAdvisor);

    const { classes  } = useStyles();
    const dispatch = useDispatch();
    const showError = useException()
    const showMessage = useMessage();

    useEffect(() => {
        if (props.open) {
            selectedSC && dispatch(loadAssignmentSettings(selectedSC.id))
        }
    }, [props.open, selectedSC])

    useEffect(() => {
        setData(assignmentSettings)
    }, [assignmentSettings])

    const onCancel = () => {
        props.onClose();
    }

    const onSuccess = () => {
        showMessage('The Methods of Assigning Employees to Appointments updated')
        onCancel();
    }

    const onError = (err: string) => {
        showError(err);
    }

    const onSave = () => {

    }

    const onMethodChange = useCallback((item: IEmployeeAssignmentSetting, level: EAssignmentLevel, role: "Advisor"|"Technician") =>
        (e: ChangeEvent<{}>, value: TOption|null) => {
            const itemToUpdate = data.find(el => el.serviceBookId === item.serviceBookId)
            let roleToUpdate = itemToUpdate?.employeeAssignmentSettings.find(el => el.role === role);
            let methodToUpdate = roleToUpdate?.methods?.find(el => el.level === level);
            if (itemToUpdate && roleToUpdate) {
                methodToUpdate = methodToUpdate
                    ? {...methodToUpdate, type: value?.value ?? null}
                    : {level, type: value?.value ?? null}
                roleToUpdate = {...roleToUpdate, methods: roleToUpdate.methods.filter(el => el.level !== level).concat(methodToUpdate)}
                const newItem = {
                    ...itemToUpdate,
                    employeeAssignmentSettings: item.employeeAssignmentSettings.filter(el => el.role !== role).concat(roleToUpdate)
                }
                setData(data.filter(el => el.serviceBookId
                    ? el.serviceBookId !== item.serviceBookId
                    : el.serviceBookName !== item.serviceBookName
                ).concat(newItem))
            }
        }, [data])

    return (
        <BaseModal {...props} width={1100} onClose={onCancel}>
            <DialogTitle
                onClose={onCancel}
                style={{textTransform: 'uppercase', color: "#575757", padding: '16px 48px'}}>
                Method to assign employees to appointments
            </DialogTitle>
            <DialogContent>
                {loading
                    ? <Loading/>
                    : <Table style={{border: '1px solid #DADADA'}}>
                        <TableHead>
                            <TableRow>
                                <THeadCell key="serviceBook"><div>Service Book</div></THeadCell>
                                <THeadCellWithSub key="advisors" style={{borderRight: '1px solid #DADADA', borderLeft: '1px solid #DADADA'}}>
                                    <SubCellTitle key="title">Advisors</SubCellTitle>
                                    <SubCellsWrapper key="subWrapper">
                                        <div key="primary">Primary</div>
                                        <div key="secondary" style={{backgroundColor: !advisorPrimaryMethod ? "#DADADA" : ''}}>Secondary</div>
                                    </SubCellsWrapper>
                                </THeadCellWithSub>
                                <THeadCellWithSub key="technicians">
                                    <SubCellTitle key="title">Technicians</SubCellTitle>
                                    <SubCellsWrapper key="subWrapper">
                                        <div key="primary">Primary</div>
                                        <div key="secondary" style={{backgroundColor: !techPrimaryMethod ? "#DADADA" : ''}}>Secondary</div>
                                    </SubCellsWrapper>
                                </THeadCellWithSub>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map(item => {
                                const advisorPrimaryMethod = item.employeeAssignmentSettings
                                    .find(el => el.role === 'Advisor')?.methods?.find(el => el.level === EAssignmentLevel.Primary)?.type;
                                const technicianPrimaryMethod = item.employeeAssignmentSettings
                                    .find(el => el.role === 'Technician')?.methods?.find(el => el.level === EAssignmentLevel.Primary)?.type;
                                const advisorSecondaryMethod = item.employeeAssignmentSettings
                                    .find(el => el.role === 'Advisor')?.methods?.find(el => el.level === EAssignmentLevel.Secondary)?.type;
                                const technicianSecondaryMethod = item.employeeAssignmentSettings
                                    .find(el => el.role === 'Technician')?.methods?.find(el => el.level === EAssignmentLevel.Secondary)?.type;
                                const isAdvisorSecondaryDisabled = advisorPrimaryMethod !== EAdvisorAssignMethod.LastAdvisor
                                const isTechSecondaryDisabled = technicianPrimaryMethod !== EAdvisorAssignMethod.LastAdvisor
                                return <TableRow key={item.serviceBookId ?? item.serviceBookName}>
                                    <TableCell key="name" style={{borderRight: "1px solid #DADADA"}}>{item.serviceBookName}</TableCell>
                                    <TCellData key="advisors">
                                        <SelectsWrapper>
                                            <div key="advisor">
                                                <Autocomplete
                                                    fullWidth
                                                    options={methodOptions}
                                                    isOptionEqualToValue={(o, v) => o.value === v.value}
                                                    getOptionLabel={i => i.name}
                                                    value={methodOptions.find(el => el.value === advisorPrimaryMethod) ?? null}
                                                    onChange={onMethodChange(item, EAssignmentLevel.Primary, "Advisor")}
                                                    renderInput={autocompleteRender({
                                                        label: '',
                                                        placeholder: ''
                                                    })}
                                                />
                                            </div>
                                            <div style={{backgroundColor: isAdvisorSecondaryDisabled ? "#DADADA" : ''}} key="technician">
                                                <Autocomplete
                                                    fullWidth
                                                    options={methodOptions}
                                                    disabled={isAdvisorSecondaryDisabled}
                                                    isOptionEqualToValue={(o, v) => o.value === v.value}
                                                    getOptionLabel={i => i.name}
                                                    value={methodOptions.find(el => el.value === advisorSecondaryMethod) ?? null}
                                                    onChange={onMethodChange(item, EAssignmentLevel.Secondary, "Advisor")}
                                                    renderInput={autocompleteRender({
                                                        label: '',
                                                        placeholder: ''
                                                    })}
                                                />
                                            </div>
                                        </SelectsWrapper>
                                    </TCellData>
                                    <TCellData key="technicians">
                                        <SelectsWrapper>
                                            <div key="advisor">
                                                <Autocomplete
                                                    fullWidth
                                                    options={methodOptions}
                                                    isOptionEqualToValue={(o, v) => o.value === v.value}
                                                    getOptionLabel={i => i.name}
                                                    value={methodOptions.find(el => el.value === technicianPrimaryMethod) ?? null}
                                                    onChange={onMethodChange(item, EAssignmentLevel.Primary, "Technician")}
                                                    renderInput={autocompleteRender({
                                                        label: '',
                                                        placeholder: ''
                                                    })}
                                                />
                                            </div>
                                            <div style={{backgroundColor: isTechSecondaryDisabled ? "#DADADA" : ''}} key="technician">
                                                <Autocomplete
                                                    fullWidth
                                                    options={methodOptions}
                                                    disabled={isTechSecondaryDisabled}
                                                    isOptionEqualToValue={(o, v) => o.value === v.value}
                                                    getOptionLabel={i => i.name}
                                                    value={methodOptions.find(el => el.value === technicianSecondaryMethod) ?? null}
                                                    onChange={onMethodChange(item, EAssignmentLevel.Secondary, "Technician")}
                                                    renderInput={autocompleteRender({
                                                        label: '',
                                                        placeholder: ''
                                                    })}
                                                />
                                            </div>
                                        </SelectsWrapper>
                                    </TCellData>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>}
                {/*{advisorAssignmentLoading*/}
                {/*    ? <Loading/>*/}
                {/*    : <DemandTable>*/}
                {/*        <TableHead>*/}
                {/*            <TableRow>*/}
                {/*                <TableCellWithPadding style={{color: "#9FA2B4", fontSize: 12}} align="left">Option</TableCellWithPadding>*/}
                {/*                <TableCellWithPadding style={{color: "#9FA2B4", fontSize: 12}} align="center">Primary Method</TableCellWithPadding>*/}
                {/*                <TableCellWithPadding*/}
                {/*                    style={{color: "#9FA2B4", fontSize: 12, backgroundColor: isSecondaryDisabled ? "#F4F4F4" : ""}}*/}
                {/*                    align="center">*/}
                {/*                    Secondary Method*/}
                {/*                </TableCellWithPadding>*/}
                {/*            </TableRow>*/}
                {/*        </TableHead>*/}
                {/*        <TableBody>*/}
                {/*            <TableRow>*/}
                {/*                <TableCellWithPadding>Rotational</TableCellWithPadding>*/}
                {/*                <TableCellWithPadding align="center">*/}
                {/*                    {primaryMethod === EAdvisorAssignMethod.Rotational*/}
                {/*                        ? <RadioButtonChecked*/}
                {/*                            htmlColor="#3855F3"*/}
                {/*                            cursor="pointer"/>*/}
                {/*                        : <RadioButtonUnchecked*/}
                {/*                            htmlColor="#DADADA"*/}
                {/*                            cursor="pointer"*/}
                {/*                            onClick={() => onChange("primary", EAdvisorAssignMethod.Rotational)}/>}*/}
                {/*                </TableCellWithPadding>*/}
                {/*                <TableCellWithPadding align="center" style={{backgroundColor: isSecondaryDisabled ? "#F4F4F4" : ""}}>*/}
                {/*                    {secondaryMethod === EAdvisorAssignMethod.Rotational*/}
                {/*                        ? <RadioButtonChecked*/}
                {/*                            cursor={isSecondaryDisabled ? "" : "pointer"}*/}
                {/*                            htmlColor={isSecondaryDisabled ? "#DADADA" : "#3855F3"}/>*/}
                {/*                        : <RadioButtonUnchecked*/}
                {/*                            htmlColor="#DADADA"*/}
                {/*                            cursor={isSecondaryDisabled ? "" : "pointer"}*/}
                {/*                            onClick={() => onChange("secondary", EAdvisorAssignMethod.Rotational)}/>}*/}
                {/*                </TableCellWithPadding>*/}
                {/*            </TableRow>*/}
                {/*            <TableRow>*/}
                {/*                <TableCellWithPadding>Max Capacity</TableCellWithPadding>*/}
                {/*                <TableCellWithPadding align="center">*/}
                {/*                    {primaryMethod === EAdvisorAssignMethod.MaxCapacity*/}
                {/*                        ? <RadioButtonChecked*/}
                {/*                            htmlColor="#3855F3"*/}
                {/*                            cursor="pointer"/>*/}
                {/*                        : <RadioButtonUnchecked*/}
                {/*                            htmlColor="#DADADA"*/}
                {/*                            cursor="pointer"*/}
                {/*                            onClick={() => onChange("primary", EAdvisorAssignMethod.MaxCapacity)}/>}*/}
                {/*                </TableCellWithPadding>*/}
                {/*                <TableCellWithPadding align="center" style={{backgroundColor: isSecondaryDisabled ? "#E8E9ED" : ""}}>*/}
                {/*                    {secondaryMethod === EAdvisorAssignMethod.MaxCapacity*/}
                {/*                        ? <RadioButtonChecked*/}
                {/*                            htmlColor={isSecondaryDisabled ? "#DADADA" : "#3855F3"}*/}
                {/*                            cursor={isSecondaryDisabled ? "" : "pointer"}/>*/}
                {/*                        : <RadioButtonUnchecked*/}
                {/*                            htmlColor="#DADADA"*/}
                {/*                            cursor={isSecondaryDisabled ? "" : "pointer"}*/}
                {/*                            onClick={() => onChange("secondary", EAdvisorAssignMethod.MaxCapacity)}/>}*/}
                {/*                </TableCellWithPadding>*/}
                {/*            </TableRow>*/}
                {/*            <TableRow>*/}
                {/*                <TableCellWithPadding>Last advisor</TableCellWithPadding>*/}
                {/*                <TableCellWithPadding align="center">*/}
                {/*                    {primaryMethod === EAdvisorAssignMethod.LastAdvisor*/}
                {/*                        ? <RadioButtonChecked*/}
                {/*                            htmlColor="#3855F3"*/}
                {/*                            cursor="pointer"/>*/}
                {/*                        : <RadioButtonUnchecked*/}
                {/*                            htmlColor="#DADADA"*/}
                {/*                            cursor="pointer"*/}
                {/*                            onClick={() => onChange("primary", EAdvisorAssignMethod.LastAdvisor)}/>}*/}
                {/*                </TableCellWithPadding>*/}
                {/*                <TableCellWithPadding align="center" style={{backgroundColor: "#F4F4F4"}}>*/}
                {/*                    <RadioButtonUnchecked htmlColor="#DADADA"/>*/}
                {/*                </TableCellWithPadding>*/}
                {/*            </TableRow>*/}
                {/*            <TableRow>*/}
                {/*                <TableCellWithPadding>No assignment</TableCellWithPadding>*/}
                {/*                <TableCellWithPadding align="center">*/}
                {/*                    {noAssignment*/}
                {/*                        ? <RadioButtonChecked*/}
                {/*                            htmlColor="#3855F3"*/}
                {/*                            cursor="pointer"/>*/}
                {/*                        : <RadioButtonUnchecked*/}
                {/*                            htmlColor="#DADADA"*/}
                {/*                            cursor="pointer"*/}
                {/*                            onClick={onNoAssignmentCheck}/>}*/}
                {/*                </TableCellWithPadding>*/}
                {/*                <TableCellWithPadding align="center" style={{backgroundColor: "#F4F4F4"}}>*/}
                {/*                    <RadioButtonUnchecked htmlColor="#DADADA"/>*/}
                {/*                </TableCellWithPadding>*/}
                {/*            </TableRow>*/}
                {/*        </TableBody>*/}
                {/*    </DemandTable>*/}
                {/*}*/}
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            disabled={loading}
                            onClick={onCancel}
                            className={classes.cancelButton}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={loading}
                            className={classes.saveButton}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default AdvisorAssignmentModal;