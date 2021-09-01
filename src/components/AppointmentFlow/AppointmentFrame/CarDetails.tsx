import React, {useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled} from "@material-ui/core";
import {IVehicle} from "../../../store/reducers/appointment/types";
import moment from "moment";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {TMaintenanceDetails} from "../../../store/reducers/appointmentFrameReducer/types";
import {setMaintenanceDetails} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TextField} from "../../UI/TextField";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";

const SelectWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));

type TSelect = {
    label: string;
    name: keyof IVehicle;
    options?: string|string[];
};

const year = moment.utc().year();
const YEARS = 20;
const yearOptions: string[] = Array(YEARS).fill(0).map((_, idx) => String(year - idx));

const selects: TSelect[] = [
    {label: "VIN", name: "vin"},
    {label: "Make", name: "make"},
    {label: "Year", name: "year", options: yearOptions},
    {label: "Model", name: "model", options: "model"},
    {label: "Mileage", name:"mileage"},
    {label: "Transmission", name: "transmission"},
    {label: "Drive Type", name: "driveType"},
    {label: "Engine Type", name: "engineType"},
];

type TOptionsState = {[s: string]: string[]};
const blankOptions: TOptionsState = {};

type TProps = {} & TActionProps;
export const CarDetails: React.FC<TProps> = ({onBack, onNext}) => {
    const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);

    const selectedVehicle = useSelector((state: RootState) => state.appointmentFrame.selectedVehicle);

    const handleChange = (name: keyof IVehicle) => (e: React.ChangeEvent<{}>, option: string|null) => {

    }
    const handleTextChange = (name: keyof IVehicle) => ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {

    }
    return <StepWrapper>
        <SelectWrapper>
            {selects.map(select => {
                if (select.options) {
                    return <Autocomplete
                        key={select.name}
                        options={typeof select.options === 'string'
                            ? loadedOptions[select.options] ?? []
                            : select.options ?? []}
                        onChange={handleChange(select.name)}
                        fullWidth
                        autoComplete={true}
                        renderInput={autocompleteRender({
                            label: select.label, placeholder: `Select ${select.label}`
                        })}
                        value={null}
                    />
                }
                return <div key={select.name}>
                    <TextField
                        onChange={handleTextChange(select.name)}
                        label={select.label}
                        name={select.name}
                        fullWidth
                        value={""}
                        placeholder={`Type ${select.label}`}
                    />
                </div>
            })}
        </SelectWrapper>
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>
};