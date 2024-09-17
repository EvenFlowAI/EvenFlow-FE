import React, {useMemo} from 'react';
import {
    EAdvisorAssignMethod,
    EAssignmentLevel,
    IEmployeeAssignmentSetting
} from "../../../../../store/reducers/employees/types";
import {getMethods, getOptionsByRole} from "../../utils";
import {methodOptions, secondaryOptions} from "../../constants";
import {ServiceBook, SmallGreyGrid} from "../styles";
import {IconButton, MenuItem, Select} from "@mui/material";
import {ReactComponent as ArrowDown} from '../../../../../assets/img/dropdown_closed.svg';
import {TEmployeeAssignmentMobileProps} from "../../types";
import {TextField} from "../../../../../components/formControls/TextFieldStyled/TextField";
import {EmptyMenuItem} from "../../../Appointments/AppointmentFilters/styles";

type TProps = TEmployeeAssignmentMobileProps & {
    item: IEmployeeAssignmentSetting;
    idx: number;
}

const ServiceBookRowMobile: React.FC<TProps> = ({
                                                    item,
                                                    idx,
                                                    data,
                                                    expandedItem,
                                                    setExpandedItem,
                                                    onMethodChange}) => {
    const isOpened = useMemo(() => item.serviceBookId
        ? expandedItem?.serviceBookId === item.serviceBookId
        : expandedItem?.serviceBookName === item.serviceBookName,
        [expandedItem, item]);
    const {
        advisorPrimaryMethod,
        technicianPrimaryMethod,
        advisorSecondaryMethod,
        technicianSecondaryMethod} = getMethods(item);

    const isAdvisorSecondaryDisabled = advisorPrimaryMethod !== EAdvisorAssignMethod.LastEmployee
    const isTechSecondaryDisabled = technicianPrimaryMethod !== EAdvisorAssignMethod.LastEmployee
    const advisorOptions = getOptionsByRole(methodOptions, "Advisor")
    const technicianOptions = getOptionsByRole(methodOptions, "Technician")

    const onOpenRow = (item: IEmployeeAssignmentSetting) => () => {
        setExpandedItem(item?.serviceBookId
            ? item?.serviceBookId === expandedItem?.serviceBookId
                ? null
                : item
            : item.serviceBookName === expandedItem?.serviceBookName
                ? null
                : item)
    }

    return <>
        <ServiceBook item xs={12} mdl={4} style={idx === data.length - 1 && !isOpened ? {borderBottomWidth: 1} :{}}>
            <div>{item.serviceBookName}</div>
            <div>
                <IconButton
                    style={{padding: 0}}
                    onClick={onOpenRow(item)}>
                    <ArrowDown style={
                        isOpened ? {transform: 'rotate(180deg)', transition: '0.6s ease'}
                            : {transform: 'rotate(360deg)', transition: '0.6s ease'}}
                    />
                </IconButton>
            </div>
        </ServiceBook>
        {isOpened
            ? <>
                <SmallGreyGrid item xs={6} mdl={2} style={{borderRightWidth: 0}}>
                    Advisors Primary
                </SmallGreyGrid>
                <SmallGreyGrid item xs={6} mdl={2} style={isAdvisorSecondaryDisabled ? {backgroundColor: "#EAEBEE"} : {}}>
                    Advisors Secondary
                </SmallGreyGrid>
                <SmallGreyGrid item xs={6} mdl={2} style={{borderRightWidth: 0}}>
                    <Select
                        fullWidth
                        onChange={onMethodChange(item, EAssignmentLevel.Primary, "Advisor")}
                        error={advisorPrimaryMethod === advisorSecondaryMethod}
                        value={advisorOptions.find(el => el.value === advisorPrimaryMethod)?.value ?? ''}
                        input={<TextField/>}
                    >
                        {advisorOptions.map(item => {
                            return <MenuItem key={item.name}
                                             value={item.value}>{item.name}</MenuItem>
                        })}
                    </Select>
                </SmallGreyGrid>
                <SmallGreyGrid item xs={6} mdl={2} style={isAdvisorSecondaryDisabled ? {backgroundColor: "#EAEBEE"} : {}}>
                    <Select
                        fullWidth
                        onChange={onMethodChange(item, EAssignmentLevel.Secondary, "Advisor")}
                        disabled={isAdvisorSecondaryDisabled}
                        error={advisorPrimaryMethod === advisorSecondaryMethod}
                        value={methodOptions.find(el => el.value === advisorSecondaryMethod)?.value ?? ''}
                        input={<TextField/>}
                    >
                        <EmptyMenuItem value="">Not Selected</EmptyMenuItem>
                        {secondaryOptions.map(item => {
                            return <MenuItem key={item.name}
                                             value={item.value}>{item.name}</MenuItem>
                        })}
                    </Select>
                </SmallGreyGrid>
                <SmallGreyGrid item xs={6} mdl={2} style={{borderRightWidth: 0}}>
                    Technician Primary
                </SmallGreyGrid>
                <SmallGreyGrid item xs={6} mdl={2} style={isTechSecondaryDisabled ? {backgroundColor: "#EAEBEE"} : {}}>
                    Technician Secondary
                </SmallGreyGrid>
                <SmallGreyGrid
                    item xs={6}
                    mdl={2}
                    style={{
                        borderBottomWidth: idx === data.length - 1 && isOpened ? 1 : 0,
                        borderRightWidth: 0
                    }}
                >
                    <Select
                        fullWidth
                        onChange={onMethodChange(item, EAssignmentLevel.Primary, "Technician")}
                        error={technicianPrimaryMethod === technicianSecondaryMethod}
                        value={technicianOptions.find(el => el.value === technicianPrimaryMethod)?.value ?? ''}
                        input={<TextField/>}
                    >
                        {technicianOptions.map(item => {
                            return <MenuItem key={item.name}
                                             value={item.value}>{item.name}</MenuItem>
                        })}
                    </Select>
                </SmallGreyGrid>
                <SmallGreyGrid
                    item xs={6}
                    mdl={2}
                    style={{
                        backgroundColor: isTechSecondaryDisabled ? "#EAEBEE" : "transparent",
                        borderBottomWidth: idx === data.length - 1 && isOpened ? 1 : 0
                    }}>
                    <Select
                        fullWidth
                        disabled={isTechSecondaryDisabled}
                        onChange={onMethodChange(item, EAssignmentLevel.Secondary, "Technician")}
                        error={technicianPrimaryMethod === technicianSecondaryMethod}
                        value={methodOptions.find(el => el.value === technicianSecondaryMethod)?.value ?? ''}
                        input={<TextField/>}
                    >
                        <EmptyMenuItem value="">Not Selected</EmptyMenuItem>
                        {secondaryOptions.map(item => {
                            return <MenuItem key={item.name}
                                             value={item.value}>{item.name}</MenuItem>
                        })}
                    </Select>
                </SmallGreyGrid>
            </>
            : null}
    </>
};

export default ServiceBookRowMobile;