import React from 'react';
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {styled} from "@material-ui/core";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TActionProps} from "./types";
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
    options: string[];
};


const mileageOptions: string[] = [
    "3000",
    "5000",
    "10000",
    "15000",
    "25000",
    "30000",
    "40000",
    "50000",
    "60000",
    "70000",
    "80000",
    "90000",
    "100000",
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
    const handleChange = (name: keyof TMaintenanceDetails) => (e: React.ChangeEvent<{}>, option: string|null) => {
        dispatch(setMaintenanceDetails({[name]: option ?? null}))
    }
    return (<StepWrapper>
        <SelectWrapper>
            {selects.map(select => {
                return <Autocomplete
                    key={select.name}
                    options={select.options}
                    onChange={handleChange(select.name)}
                    fullWidth
                    autoComplete={true}
                    renderInput={autocompleteRender({
                        label: select.label, placeholder: `Select ${select.label}`
                    })}
                    value={maintenanceDetails[select.name] ?? null}
                />
            })}
        </SelectWrapper>
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>);
};