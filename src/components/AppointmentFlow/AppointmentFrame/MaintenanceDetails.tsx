import React from 'react';
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {styled} from "@material-ui/core";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TActionProps} from "./types";

const SelectWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%"
});

type TSelect = {
    label: string;
    name: string;
}
const selects: TSelect[] = [
    {label: "Year", name: "year"},
    {label: "Model", name: "model"},
    {label: "Trim", name: "trim"},
    {label: "Powertrain", name: "powertrain"},
    {label: "Oil Type", name:"oilType"},
    {label: "Service Interval", name:"serviceInterval"},
]

export const MaintenanceDetails: React.FC<TActionProps> = ({onNext, onBack}) => {
    return (<StepWrapper>
        <SelectWrapper>
            {selects.map(select => {
                return <Autocomplete
                    key={select.name}
                    options={[]}
                    onChange={() => {}}
                    // getOptionLabel={option => option.vin}
                    // getOptionSelected={(option, value) => option.vin === value.vin}
                    fullWidth
                    autoComplete={true}
                    renderInput={autocompleteRender({
                        label: select.label, placeholder: `Select ${select.label}`
                    })}
                    value={""}
                />
            })}
        </SelectWrapper>
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>);
};