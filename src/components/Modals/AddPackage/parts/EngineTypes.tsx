import React, {ChangeEvent, useCallback, Dispatch, SetStateAction} from 'react';
import {autocompleteRender} from "../../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import Checkbox from "../../../UI/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {IEngineType} from "../../../../store/reducers/vehicleDetails/types";
import {useMakeAndModelStyles} from "./MakeAndModel/MakeAndModel";

type TEngineTypesProps = {
    setSelectedEngineTypes: Dispatch<SetStateAction<IEngineType[]>>;
    selectedEngineTypes: IEngineType[];
    setFormIsChecked: Dispatch<SetStateAction<boolean>>;
    isApplyBusinessRules: boolean;
}

const EngineTypes: React.FC<TEngineTypesProps> = ({
                                                       setSelectedEngineTypes,
                                                       selectedEngineTypes,
                                                       setFormIsChecked,
                                                       isApplyBusinessRules,
                                                   }) => {
    const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails);
    const classes = useMakeAndModelStyles();

    const onEngineTypeChange = (e: React.ChangeEvent<{}>, value: IEngineType[]) => {
        setFormIsChecked(false);
        setSelectedEngineTypes(value);
    }

    const getSortedOptions = () => {
        return engineTypes.slice().sort((a, b) => {
            return selectedEngineTypes.find(el => a.id === el.id)
                ? selectedEngineTypes.find(el => b.id === el.id)
                    ? 0
                    : -1
                : 1
        })
    }

    const onCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>, option: IEngineType) => {
        setFormIsChecked(false);
        if (!e.target.checked) {
            setSelectedEngineTypes(prev => {
                return prev
                    .filter(item => item.id !== option.id)
                    .sort((a, b) => {
                        return selectedEngineTypes.find(el => a.id === el.id)
                            ? selectedEngineTypes.find(el => b.id === el.id)
                                ? 0
                                : -1
                            : 1
                    })
            })
        }
    }, [selectedEngineTypes])

    const renderEngineTypeOption = useCallback((option: IEngineType) => {
        const checked = !!selectedEngineTypes.find(el => el.id === option.id);
        return <React.Fragment>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onCheckboxChange(e, option)}
            />
            {option.name}
        </React.Fragment>
    }, [selectedEngineTypes, onCheckboxChange]);

    return (
        <Autocomplete
            classes={classes}
            options={getSortedOptions()}
            multiple
            renderOption={renderEngineTypeOption}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            disabled={!isApplyBusinessRules}
            value={selectedEngineTypes}
            onChange={onEngineTypeChange}
            renderInput={autocompleteRender({label: 'Engine Types', placeholder: 'Select Engine Types'})}
        />
    );
};

export default EngineTypes;