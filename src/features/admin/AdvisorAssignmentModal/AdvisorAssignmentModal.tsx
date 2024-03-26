import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {Button, Table, TableBody, TableHead} from "@mui/material";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {TableRow} from "../../../components/styled/TableRow";
import {SubCellsWrapper, SubCellTitle, THeadCell, THeadCellWithSub, useStyles} from "./styles";
import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {TOption} from "../PodsTable/PODModal/types";
import {
    EAdvisorAssignMethod,
    EAssignmentLevel,
    IEmployeeAssignmentSetting,
    TUpdateAssignmentSettingsData
} from "../../../store/reducers/employees/types";
import {loadAssignmentSettings, updateAssignmentSettings} from "../../../store/reducers/employees/actions";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import ServiceBookRow from "./ ServiceBookRow/ServiceBookRow";

const AdvisorAssignmentModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = (props) => {
    const {loading, assignmentSettings} = useSelector((state: RootState) => state.employees);
    const [data, setData] = useState<IEmployeeAssignmentSetting[]>([]);
    const {selectedSC} = useSCs();
    const { classes  } = useStyles();
    const dispatch = useDispatch();
    const showError = useException()
    const showMessage = useMessage();

    const isAdvisorSecondaryEnabled = useMemo(() => {
        return data.find(item => item.employeeAssignmentSettings
            .find(el => el.role === 'Advisor')?.methods
            ?.find(el => el.level === EAssignmentLevel.Primary)?.type === EAdvisorAssignMethod.LastEmployee);
    }, [data])
    const isTechSecondaryEnabled = useMemo(() => {
        return data.find(item => item.employeeAssignmentSettings
            .find(el => el.role === 'Technician')?.methods
            ?.find(el => el.level === EAssignmentLevel.Primary)?.type === EAdvisorAssignMethod.LastEmployee);
    }, [data])

    useEffect(() => {
        if (props.open) {
            selectedSC && dispatch(loadAssignmentSettings(selectedSC.id))
        }
    }, [props.open, selectedSC])

    useEffect(() => {
        setData(assignmentSettings)
    }, [assignmentSettings])

    const onCancel = () => {
        setData(assignmentSettings)
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
        if (selectedSC) {
            const requestData: TUpdateAssignmentSettingsData = {
                serviceCenterId: selectedSC.id,
                serviceBookSettings: data.map(({employeeAssignmentSettings, serviceBookId}) => {
                    return serviceBookId
                        ? {serviceBookId, employeeAssignmentSettings}
                        : {employeeAssignmentSettings}
                })
            }
            dispatch(updateAssignmentSettings(requestData, onError, onSuccess))
        }
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
                if (methodToUpdate.level === EAssignmentLevel.Primary && value?.value !== EAdvisorAssignMethod.LastEmployee) {
                    roleToUpdate = {...roleToUpdate, methods: [methodToUpdate, {level: EAssignmentLevel.Secondary, type: null}]}
                } else {
                    roleToUpdate = {...roleToUpdate, methods: roleToUpdate.methods.filter(el => el.level !== level).concat(methodToUpdate)}
                }
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
                                        <div key="secondary" style={{backgroundColor: !isAdvisorSecondaryEnabled ? "#DADADA" : ''}}>Secondary</div>
                                    </SubCellsWrapper>
                                </THeadCellWithSub>
                                <THeadCellWithSub key="technicians">
                                    <SubCellTitle key="title">Technicians</SubCellTitle>
                                    <SubCellsWrapper key="subWrapper">
                                        <div key="primary">Primary</div>
                                        <div key="secondary" style={{backgroundColor: !isTechSecondaryEnabled ? "#DADADA" : ''}}>Secondary</div>
                                    </SubCellsWrapper>
                                </THeadCellWithSub>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map(item => <ServiceBookRow item={item} onMethodChange={onMethodChange}/>)}
                        </TableBody>
                    </Table>}
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