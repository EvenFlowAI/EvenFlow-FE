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
import {getOptions} from "../../../../utils/utils";

type TProps = {
    item: IEmployeeAssignmentSetting;
    onMethodChange: (item: IEmployeeAssignmentSetting, level: EAssignmentLevel, role: "Advisor"|"Technician") =>
        (e: ChangeEvent<{}>, value: TOption|null) => void;
}

const methodOptions: TOption[] = getOptions(Object.keys(EAdvisorAssignMethod).filter(key => Number.isNaN(+key)))

const ServiceBookRow: React.FC<TProps> = ({item, onMethodChange}) => {
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
};

export default ServiceBookRow;