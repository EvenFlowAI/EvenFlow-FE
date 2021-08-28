import React from 'react';
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {styled} from "@material-ui/core";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TActionProps} from "./types";
import {TOption} from "../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {TMaintenanceDetails} from "../../../store/reducers/appointmentFrameReducer/types";
import {setMaintenanceDetails} from "../../../store/reducers/appointmentFrameReducer/actions";
import {RootState} from "../../../store/rootReducer";

const SelectWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%"
});

type TSelect = {
    label: string;
    name: keyof TMaintenanceDetails;
    options: TOption[];
};


const mileageOptions: TOption[] = [
    {value: "3000", name: "3000"},
    {value: "5000", name: "5000"},
    {value: "10000", name: "10000"},
    {value: "15000", name: "15000"},
    {value: "25000", name: "25000"},
    {value: "30000", name: "30000"},
    {value: "40000", name: "40000"},
    {value: "50000", name: "50000"},
    {value: "60000", name: "60000"},
    {value: "70000", name: "70000"},
    {value: "80000", name: "80000"},
    {value: "90000", name: "90000"},
    {value: "100000", name: "100000"},
];
const selects: TSelect[] = [
    {label: "Year", name: "year", options: []},
    {label: "Model", name: "model", options: []},
    {label: "Trim", name: "trim", options: []},
    {label: "Powertrain", name: "powertrain", options: []},
    {label: "Oil Type", name:"oilType", options: []},
    {label: "Service Interval", name:"serviceInterval", options: mileageOptions},
];

export const MaintenanceDetails: React.FC<TActionProps> = ({onNext, onBack}) => {
    const dispatch = useDispatch();
    const maintenanceDetails = useSelector((state: RootState) => state.appointmentFrame.maintenanceDetails);
    const handleChange = (name: keyof TMaintenanceDetails) => (e: React.ChangeEvent<{}>, option: TOption|null) => {
        dispatch(setMaintenanceDetails({[name]: option?.value ?? null}))
    }
    return (<StepWrapper>
        <SelectWrapper>
            {selects.map(select => {
                return <Autocomplete
                    key={select.name}
                    options={select.options}
                    onChange={handleChange(select.name)}
                    getOptionLabel={option => option.name}
                    getOptionSelected={(option, value) => option.value === value.value}
                    fullWidth
                    autoComplete={true}
                    renderInput={autocompleteRender({
                        label: select.label, placeholder: `Select ${select.label}`
                    })}
                    value={
                        maintenanceDetails[select.name]
                            ? select.options.find(o => o.value === maintenanceDetails[select.name]) ?? null
                            : null
                    }
                />
            })}
        </SelectWrapper>
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>);
};