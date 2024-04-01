import React, {ChangeEvent} from 'react';
import {TableRow} from "../../../../components/styled/TableRow";
import {Autocomplete, TableCell} from "@mui/material";
import {SelectsWrapper, TCellData} from "../styles";
import {
    EAdvisorAssignMethod,
    EAssignmentLevel,
    IEmployeeAssignmentSetting
} from "../../../../store/reducers/employees/types";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {TOption} from "../../PodsTable/PODModal/types";
import {methodOptions, secondaryOptions} from "../constants";
import {getOptionsByRole} from "../utils";

type TProps = {
    item: IEmployeeAssignmentSetting;
    onMethodChange: (item: IEmployeeAssignmentSetting, level: EAssignmentLevel, role: "Advisor"|"Technician") =>
        (e: ChangeEvent<{}>, value: TOption|null) => void;
}

const ServiceBookRow: React.FC<TProps> = ({item, onMethodChange}) => {
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

    return <TableRow key={item.serviceBookId ?? item.serviceBookName}>
        <TableCell key="name" style={{borderRight: "1px solid #DADADA"}}>{item.serviceBookName}</TableCell>
        <TCellData key="advisors">
            <SelectsWrapper>
                <div key="advisor">
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
                </div>
                <div style={{backgroundColor: isAdvisorSecondaryDisabled ? "#DADADA" : ''}} key="technician">
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
                </div>
            </SelectsWrapper>
        </TCellData>
        <TCellData key="technicians">
            <SelectsWrapper>
                <div key="advisor">
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
                </div>
                <div style={{backgroundColor: isTechSecondaryDisabled ? "#DADADA" : ''}} key="technician">
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
                </div>
            </SelectsWrapper>
        </TCellData>
    </TableRow>
};

export default ServiceBookRow;