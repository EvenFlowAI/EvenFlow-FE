import React, {ChangeEvent, Dispatch, SetStateAction, useCallback} from 'react';
import {autocompleteRender} from "../../../../../../utils/autocompleteRenders";
import { Autocomplete } from '@mui/material';
import Checkbox from "../../../../../../components/formControls/Checkbox/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {useAutocompleteStyles} from "../../../../../../hooks/styling/useAutocompleteStyles";

type TMileageProps = {
    disabled: boolean;
    selectedMileages: string[];
    setFormIsChecked: Dispatch<SetStateAction<boolean>>;
    setSelectedMileages: Dispatch<SetStateAction<string[]>>;
}

const Mileage: React.FC<TMileageProps> = ({
                                              disabled,
                                              selectedMileages,
                                              setSelectedMileages,
                                              setFormIsChecked }) => {
    const { mileage } = useSelector((state: RootState) => state.vehicleDetails);
    const classes = useAutocompleteStyles();

    const getOptions = useCallback(() => {
        const options = mileage.map(item => item.value.toString());
        if (options.length) options.unshift('Apply To All')
        return options;
    }, [mileage])

    const sortMileage = (a: string, b: string) => {
        return selectedMileages.includes(a) ? selectedMileages.includes(b) ? 0 : -1 : 1
    }

    const onMileageCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>, option: string) => {
        setFormIsChecked(false);
        setSelectedMileages(prev => {
            let data = option === 'Apply To All'
                ? !e.target.checked
                    ? []
                    : getOptions()
                : prev;
            return !e.target.checked
                ? data.filter(item => item !== option).sort(sortMileage)
                : option === 'Apply To All'
                    ? data.sort(sortMileage)
                    : data.concat(option).sort(sortMileage)
        })
    }, [selectedMileages])

    const renderOption = useCallback((props, option: string) => {
        const allMileagesSelected = mileage.length
            ? mileage.every(item => selectedMileages.includes(item.value.toString()))
            : false;
        const checked = selectedMileages.includes(option) || allMileagesSelected;
        return <div style={{display: 'flex', alignItems: 'center'}} key={option}>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onMileageCheckboxChange(e, option)}
            />
            {option}
        </div>
    }, [mileage, selectedMileages]);

    const onChange = (e: React.SyntheticEvent, value: string[]) => {
        setSelectedMileages(value)
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