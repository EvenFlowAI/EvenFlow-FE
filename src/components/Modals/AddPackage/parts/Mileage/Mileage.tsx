import React, {ChangeEvent, Dispatch, SetStateAction, useCallback} from 'react';
import {autocompleteRender} from "../../../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {useMakeAndModelStyles} from "../MakeAndModel/MakeAndModel";
import Checkbox from "../../../../UI/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";

type TMileageProps = {
    disabled: boolean;
    selectedMileages: string[];
    isApplyBusinessRules: boolean;
    formIsChecked: boolean;
    setFormIsChecked: Dispatch<SetStateAction<boolean>>;
    setSelectedMileages: Dispatch<SetStateAction<string[]>>;
}

const Mileage: React.FC<TMileageProps> = ({
                                              disabled,
                                              selectedMileages,
                                              isApplyBusinessRules,
                                              formIsChecked,
                                              setSelectedMileages,
                                              setFormIsChecked }) => {
    const { mileage } = useSelector((state: RootState) => state.vehicleDetails);
    const classes = useMakeAndModelStyles();

    const getOptions = useCallback(() => {
        const options = mileage.map(item => item.value.toString());
        if (options.length) options.unshift('Apply To All')
        return options;
    }, [mileage])

    const onMileageChange = useCallback((e: ChangeEvent<{}>, value: string[]) => {
        if (value.includes('Apply To All')) {
            setSelectedMileages(() => mileage.map(item => item.value.toString()));
        } else {
            setSelectedMileages(value);
        }
    }, [mileage])

    const onMileageCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>, option: string) => {
        setFormIsChecked(false);
        if (!e.target.checked) {
            setSelectedMileages(prev => {
                let data = option === 'Apply To All' ? [] : prev;
                return data
                    .filter(item => item !== option)
                    .sort((a, b) => selectedMileages.includes(a) ? selectedMileages.includes(b) ? 0 : -1 : 1)
            })
        }
    }, [selectedMileages])

    const renderOption = useCallback((option: string) => {
        const allMileagesSelected = mileage.length
            ? mileage.every(item => selectedMileages.includes(item.value.toString()))
            : false;
        const checked = selectedMileages.includes(option) || allMileagesSelected;
        return <React.Fragment>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onMileageCheckboxChange(e, option)}
            />
            {option}
        </React.Fragment>
    }, [mileage, selectedMileages]);

    return (
        <Autocomplete
            multiple
            style={{ marginBottom: 10 }}
            classes={classes}
            disabled={disabled}
            options={getOptions()}
            disableCloseOnSelect
            renderOption={renderOption}
            value={selectedMileages}
            onChange={onMileageChange}
            renderInput={autocompleteRender({
                label: "Mileage",
                error: !selectedMileages.length && isApplyBusinessRules && formIsChecked,
                placeholder: 'Select Mileage'
            })}
        />
    );
};

export default Mileage;