import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {Button, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {useStyles} from "./styles";
import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";
import {TOption} from "../ServiceBookModal/types";
import {
    EAdvisorAssignMethod,
    EAssignmentLevel,
    IEmployeeAssignmentSetting,
    TUpdateAssignmentSettingsData
} from "../../../store/reducers/employees/types";
import {loadAssignmentSettings, updateAssignmentSettings} from "../../../store/reducers/employees/actions";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {sortServiceBooks} from "./utils";
import EmployeeAssignmentDesktop from "./EmployeeAssignmentDesktop/EmployeeAssignmentDesktop";
import EmployeeAssignmentMobile from "./EmployeeAssignmentMobile/EmployeeAssignmentMobile";
import {StyledActions} from "./EmployeeAssignmentMobile/styles";

const EmployeeAssignmentModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = (props) => {
    const {loading, assignmentSettings} = useSelector((state: RootState) => state.employees);
    const [data, setData] = useState<IEmployeeAssignmentSetting[]>([]);
    const [expandedItem, setExpandedItem] = useState<IEmployeeAssignmentSetting|null>(null)
    const {selectedSC} = useSCs();
    const { classes  } = useStyles();
    const dispatch = useDispatch();
    const showError = useException()
    const showMessage = useMessage();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("mdl"));

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
        setData([...assignmentSettings].sort(sortServiceBooks))
    }, [assignmentSettings])

    const onCancel = () => {
        setExpandedItem(null)
        setData([])
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

    const onChange = (item: IEmployeeAssignmentSetting, level: EAssignmentLevel, role: "Advisor"|"Technician", value: EAdvisorAssignMethod|null) => {
        const itemToUpdate = data.find(el => el.serviceBookId === item.serviceBookId)
        let roleToUpdate = itemToUpdate?.employeeAssignmentSettings.find(el => el.role === role);
        let methodToUpdate = roleToUpdate?.methods?.find(el => el.level === level);
        if (itemToUpdate && roleToUpdate) {
            methodToUpdate = methodToUpdate
                ? {...methodToUpdate, type: value}
                : {level, type: value}
            if (methodToUpdate.level === EAssignmentLevel.Primary && value !== EAdvisorAssignMethod.LastEmployee) {
                roleToUpdate = {...roleToUpdate, methods: [methodToUpdate]}
            } else if (methodToUpdate.level === EAssignmentLevel.Secondary && value === null) {
                roleToUpdate = {
                    ...roleToUpdate,
                    methods: roleToUpdate.methods.filter(el => el.level !== EAssignmentLevel.Secondary)
                }
            } else {
                roleToUpdate = {
                    ...roleToUpdate,
                    methods: roleToUpdate.methods.filter(el => el.level !== level).concat(methodToUpdate)
                }
            }
            const newItem = {
                ...itemToUpdate,
                employeeAssignmentSettings: item.employeeAssignmentSettings
                    .filter(el => el.role !== role)
                    .concat(roleToUpdate)
            }
            setData(data.filter(el => el.serviceBookId
                ? el.serviceBookId !== item.serviceBookId
                : el.serviceBookName !== item.serviceBookName
            )
                .concat(newItem)
                .sort(sortServiceBooks))
        }
    }

    const onMobileMethodChange = useCallback((item: IEmployeeAssignmentSetting, level: EAssignmentLevel, role: "Advisor"|"Technician") =>
        (e: SelectChangeEvent<number>) => {
            onChange(item, level, role, e.target?.value !== '' ? +e.target?.value as EAdvisorAssignMethod : null)
        }, [data])

    const onMethodChange = useCallback((item: IEmployeeAssignmentSetting, level: EAssignmentLevel, role: "Advisor"|"Technician") =>
        (e: ChangeEvent<{}>, value: TOption|null) => {
            onChange(item, level, role, value ? value?.value : null)
        }, [data])

    return (
        <BaseModal {...props} width={1100} onClose={onCancel}>
            <DialogTitle
                onClose={onCancel}
                style={{
                    textTransform: isMobile ? 'capitalize' : 'uppercase',
                    color: isMobile ? "#252733" : "#575757",
                    padding: isMobile? '18px 16px 24px 16px' : '16px 48px'}}>
                Method to assign employees to appointments
            </DialogTitle>
            <DialogContent style={isMobile ? {padding: '0px 16px'}: {}}>
                {loading
                    ? <Loading/>
                    : isMobile
                        ? <EmployeeAssignmentMobile data={data} onMethodChange={onMobileMethodChange} expandedItem={expandedItem} setExpandedItem={setExpandedItem}/>
                        : <EmployeeAssignmentDesktop
                            data={data}
                            isAdvisorSecondaryEnabled={!!isAdvisorSecondaryEnabled}
                            isTechSecondaryEnabled={!!isTechSecondaryEnabled}
                            onMethodChange={onMethodChange}
                        />}
            </DialogContent>
            <StyledActions>
                <Button
                    disabled={loading}
                    onClick={onCancel}
                    color="info"
                    className={classes.cancelButton}>
                    Cancel
                </Button>
                <Button
                    onClick={onSave}
                    disabled={loading}
                    className={classes.saveButton}>
                    Save
                </Button>
            </StyledActions>
        </BaseModal>
    );
};

export default EmployeeAssignmentModal;