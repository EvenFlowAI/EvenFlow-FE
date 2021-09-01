import React, {useEffect, useState} from 'react';
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
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {EVehiclePropType} from "../../../api/types";
import moment from "moment";

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
    name: keyof TMaintenanceDetails;
    options: string[]|string;
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

const year = moment.utc().year();
const YEARS = 20;
const yearOptions: string[] = Array(YEARS).fill(0).map((_, idx) => String(year - idx));

type TTypeNameList = [EVehiclePropType, keyof TMaintenanceDetails];
const typesToLoad: TTypeNameList[] = [
    [EVehiclePropType.Model, "model"],
    [EVehiclePropType.DriveType, "powertrain"]
]
const selects: TSelect[] = [
    {label: "Year", name: "year", options: yearOptions},
    {label: "Model", name: "model", options: "model"},
    {label: "Trim", name: "trim", options: "trim"},
    {label: "Powertrain", name: "powertrain", options: "powertrain"},
    {label: "Oil Type", name:"oilType", options: []},
    {label: "Estimated mileage", name:"serviceInterval", options: mileageOptions},
];

type TOptionsState = {[s: string]: string[]};
const blankOptions: TOptionsState = {};

export const MaintenanceDetails: React.FC<TActionProps> = ({onNext, onBack}) => {
    const dispatch = useDispatch();
    const [loadedOptions, setLoadedOptions] = useState<TOptionsState>(blankOptions);
    const {id} = useParams();
    const maintenanceDetails = useSelector((state: RootState) => state.appointmentFrame.maintenanceDetails);
    const selectedVehicle = useSelector((state: RootState) => state.appointmentFrame.selectedVehicle);

    useEffect(() => {
        if (selectedVehicle) {
            dispatch(setMaintenanceDetails({
                make: selectedVehicle.make,
                model: selectedVehicle.model,
                year: selectedVehicle.year ? String(selectedVehicle.year) : undefined,
            }))
        }
    }, [dispatch, selectedVehicle]);

    useEffect(() => {
        const filter = [];
        if (maintenanceDetails.make) {
            filter.push({type: EVehiclePropType.Make, value: maintenanceDetails.make});
        }
        if (maintenanceDetails.model) {
            filter.push({type: EVehiclePropType.Model, value: maintenanceDetails.model});
        }
        for (let [propertyToReturn, name] of typesToLoad) {
            Api.call<string[]>(
                Api.endpoints.Vehicles.GetByQuery,
                {data: {
                    serviceCenterId: decodeSCID(id),
                    filter,
                    propertyToReturn
                }}
            ).then(({data}) => {
                setLoadedOptions(d => ({...d, [name]: data}));
            })
        }
    }, [id, maintenanceDetails]);

    const handleChange = (name: keyof TMaintenanceDetails) => (e: React.ChangeEvent<{}>, option: string|null) => {
        dispatch(setMaintenanceDetails({[name]: option ?? null}))
    }

    return (<StepWrapper>
        <SelectWrapper>
            {selects.map(select => {
                return <Autocomplete
                    key={select.name}
                    options={typeof select.options === 'string'
                        ? loadedOptions[select.options] ?? []
                        : select.options}
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
        <Actions onBack={onBack} nextDisabled={!maintenanceDetails.serviceInterval} onNext={onNext} />
    </StepWrapper>);
};