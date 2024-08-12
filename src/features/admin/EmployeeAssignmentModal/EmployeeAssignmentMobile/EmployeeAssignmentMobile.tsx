import React, {ChangeEvent, Dispatch, SetStateAction} from 'react';
import {Autocomplete, Grid, IconButton} from "@mui/material";
import {ServiceBook, SmallGreyGrid, StyledGrid} from "./styles";
import {
    EAdvisorAssignMethod,
    EAssignmentLevel,
    IEmployeeAssignmentSetting
} from "../../../../store/reducers/employees/types";
import {TOption} from "../../ServiceBookModal/types";
import {ReactComponent as ArrowDown} from '../../../../assets/img/dropdown_closed.svg';
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {getOptionsByRole} from "../utils";
import {methodOptions, secondaryOptions} from "../constants";

type TProps = {
    data: IEmployeeAssignmentSetting[];
    expandedItem: IEmployeeAssignmentSetting|null;
    setExpandedItem: Dispatch<SetStateAction<IEmployeeAssignmentSetting|null>>;
    onMethodChange: (item: IEmployeeAssignmentSetting, level: EAssignmentLevel, role: "Advisor"|"Technician") =>
        (e: ChangeEvent<{}>, value: TOption|null) => void;
}

const EmployeeAssignmentMobile: React.FC<TProps> = ({
                                                        data,
                                                        onMethodChange,
                                                        expandedItem,
                                                        setExpandedItem
                                                    }) => {
    const onOpenRow = (item: IEmployeeAssignmentSetting) => () => {
        setExpandedItem(item?.serviceBookId
            ? item?.serviceBookId === expandedItem?.serviceBookId
                ? null
                : item
            : item.serviceBookName === expandedItem?.serviceBookName
                ? null
                : item)
    }

    return (
        <Grid container>
            <StyledGrid item xs={12}>Service Book</StyledGrid>
            {data.map((item, idx) => {
                const isOpened = item.serviceBookId
                    ? expandedItem?.serviceBookId === item.serviceBookId
                    : expandedItem?.serviceBookName === item.serviceBookName;
                const advisorPrimaryMethod = item.employeeAssignmentSettings
                    .find(el => el.role === 'Advisor')?.methods?.find(el => el.level === EAssignmentLevel.Primary)?.type;
                const technicianPrimaryMethod = item.employeeAssignmentSettings
                    .find(el => el.role === 'Technician')?.methods?.find(el => el.level === EAssignmentLevel.Primary)?.type;
                const advisorSecondaryMethod = item.employeeAssignmentSettings
                    .find(el => el.role === 'Advisor')?.methods?.find(el => el.level === EAssignmentLevel.Secondary)?.type;
                const technicianSecondaryMethod = item.employeeAssignmentSettings
                    .find(el => el.role === 'Technician')?.methods?.find(el => el.level === EAssignmentLevel.Secondary)?.type;
                const isAdvisorSecondaryDisabled = advisorPrimaryMethod !== EAdvisorAssignMethod.LastEmployee
                const isTechSecondaryDisabled = technicianPrimaryMethod !== EAdvisorAssignMethod.LastEmployee
                const advisorOptions = getOptionsByRole(methodOptions, "Advisor")
                const technicianOptions = getOptionsByRole(methodOptions, "Technician")
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
                                <Autocomplete
                                    fullWidth
                                    options={advisorOptions}
                                    isOptionEqualToValue={(o, v) => o.value === v.value}
                                    disableClearable
                                    getOptionLabel={i => i.name}
                                    value={advisorOptions.find(el => el.value === advisorPrimaryMethod)}
                                    onChange={onMethodChange(item, EAssignmentLevel.Primary, "Advisor")}
                                    renderInput={autocompleteRender({
                                        label: '',
                                        placeholder: '',
                                        error: advisorPrimaryMethod === advisorSecondaryMethod
                                    })}
                                />
                            </SmallGreyGrid>
                            <SmallGreyGrid item xs={6} mdl={2} style={isAdvisorSecondaryDisabled ? {backgroundColor: "#EAEBEE"} : {}}>
                                <Autocomplete
                                    fullWidth
                                    options={secondaryOptions}
                                    disabled={isAdvisorSecondaryDisabled}
                                    isOptionEqualToValue={(o, v) => o.value === v.value}
                                    getOptionLabel={i => i.name}
                                    value={methodOptions.find(el => el.value === advisorSecondaryMethod) ?? null}
                                    onChange={onMethodChange(item, EAssignmentLevel.Secondary, "Advisor")}
                                    renderInput={autocompleteRender({
                                        label: '',
                                        placeholder: '',
                                        error: advisorPrimaryMethod === advisorSecondaryMethod
                                    })}
                                />
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
                                <Autocomplete
                                    fullWidth
                                    options={technicianOptions}
                                    isOptionEqualToValue={(o, v) => o.value === v.value}
                                    getOptionLabel={i => i.name}
                                    disableClearable
                                    value={technicianOptions.find(el => el.value === technicianPrimaryMethod)}
                                    onChange={onMethodChange(item, EAssignmentLevel.Primary, "Technician")}
                                    renderInput={autocompleteRender({
                                        label: '',
                                        placeholder: '',
                                        error: technicianPrimaryMethod === technicianSecondaryMethod
                                    })}
                                />
                            </SmallGreyGrid>
                            <SmallGreyGrid
                                item xs={6}
                                mdl={2}
                                style={{
                                backgroundColor: isTechSecondaryDisabled ? "#EAEBEE" : "transparent",
                                borderBottomWidth: idx === data.length - 1 && isOpened ? 1 : 0
                            }}>
                                <Autocomplete
                                    fullWidth
                                    options={secondaryOptions}
                                    disabled={isTechSecondaryDisabled}
                                    isOptionEqualToValue={(o, v) => o.value === v.value}
                                    getOptionLabel={i => i.name}
                                    value={methodOptions.find(el => el.value === technicianSecondaryMethod) ?? null}
                                    onChange={onMethodChange(item, EAssignmentLevel.Secondary, "Technician")}
                                    renderInput={autocompleteRender({
                                        label: '',
                                        placeholder: '',
                                        error: technicianPrimaryMethod === technicianSecondaryMethod
                                    })}
                                />
                            </SmallGreyGrid>
                        </>
                        : null}
                </>
            })}
        </Grid>
    );
};

export default EmployeeAssignmentMobile;