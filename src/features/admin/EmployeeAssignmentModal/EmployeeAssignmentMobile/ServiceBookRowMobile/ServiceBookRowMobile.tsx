import React, {useMemo} from 'react';
import {
    EAdvisorAssignMethod,
    EAssignmentLevel,
    IEmployeeAssignmentSetting
} from "../../../../../store/reducers/employees/types";
import {getMethods, getOptionsByRole} from "../../utils";
import {methodOptions, secondaryOptions} from "../../constants";
import {ServiceBook, SmallGreyGrid} from "../styles";
import {Autocomplete, IconButton} from "@mui/material";
import {autocompleteRender} from "../../../../../utils/autocompleteRenders";
import {ReactComponent as ArrowDown} from '../../../../../assets/img/dropdown_closed.svg';
import {TEmployeeAssignmentMobileProps} from "../../types";

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
                    <Autocomplete
                        fullWidth
                        options={advisorOptions}
                        blurOnSelect="touch"
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
                        blurOnSelect="touch"
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
                        blurOnSelect="touch"
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
                        blurOnSelect="touch"
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
};

export default ServiceBookRowMobile;