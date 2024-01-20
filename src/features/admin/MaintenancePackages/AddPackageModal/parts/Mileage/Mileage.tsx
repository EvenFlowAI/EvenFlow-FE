import React, {Dispatch, SetStateAction, useCallback} from 'react';
import {autocompleteRender} from "../../../../../../utils/autocompleteRenders";
import { Autocomplete } from '@mui/material';
import Checkbox from "../../../../../../components/formControls/Checkbox/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {useAutocompleteStyles} from "../../../../../../hooks/styling/useAutocompleteStyles";
import {ApplyToAll} from "../constants";

type TMileageProps = {
    disabled: boolean;
    selectedMileages: string[];
    setFormIsChecked: Dispatch<SetStateAction<boolean>>;
    setSelectedMileages: Dispatch<SetStateAction<string[]>>;
}

const Mileage: React.FC<React.PropsWithChildren<TMileageProps>> = ({
                                              disabled,
                                              selectedMileages,
                                              setSelectedMileages,
                                              setFormIsChecked }) => {
    const { mileage } = useSelector((state: RootState) => state.vehicleDetails);
    const classes = useAutocompleteStyles();

    const sortMileage = (a: string, b: string) => {
        return selectedMileages.includes(a) ? selectedMileages.includes(b) ? 0 : -1 : 1
    }

    const getOptions = useCallback(() => {
        let options = mileage.map(item => item.value.toString());
        options = options.sort(sortMileage);
        if (options.length) options.unshift(ApplyToAll)
        return options;
    }, [mileage])

    const renderOption = useCallback((props: any, option: string) => {
        const allMileagesSelected = mileage.length
            ? mileage.every(item => selectedMileages.includes(item.value.toString()))
            : false;
        const checked = selectedMileages.includes(option) || allMileagesSelected;
        return <li style={{display: 'flex', alignItems: 'center'}} key={option} {...props}>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
            />
            {option}
        </li>
    }, [mileage, selectedMileages]);

    const onChange = (e: React.SyntheticEvent, value: string[]) => {
        setFormIsChecked(false);
        if (value.includes(ApplyToAll)) {
            if (mileage.length && value.length === mileage.length + 1) {
                setSelectedMileages([])
            } else {
                setSelectedMileages(mileage.map(item => item.value.toString()));
            }
        } else {
            setSelectedMileages(value);
        }
    }

    return (
        <Autocomplete
            multiple
            style={{ marginBottom: 10 }}
            classes={classes}
            disabled={disabled}
            options={getOptions()}
            disableCloseOnSelect
            getOptionLabel={o => o ?? null}
            isOptionEqualToValue={(o, v) => o.toLowerCase() === v.toLowerCase()}
            renderOption={renderOption}
            value={selectedMileages}
            onChange={onChange}
            renderInput={autocompleteRender({
                label: "Mileage",
                placeholder: 'Select Mileage'
            })}
        />
    );
};

export default Mileage;