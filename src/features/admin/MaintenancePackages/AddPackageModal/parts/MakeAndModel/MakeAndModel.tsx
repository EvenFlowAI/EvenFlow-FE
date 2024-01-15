import React, {ChangeEvent, useCallback, Dispatch, SetStateAction, useState, useEffect} from 'react';
import {autocompleteRender} from "../../../../../../utils/autocompleteRenders";
import { Autocomplete } from '@mui/material';
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import Checkbox from "../../../../../../components/formControls/Checkbox/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@mui/icons-material";
import {IMake} from "../../../../../../api/types";
import {upperCase} from "./utils";
import {useAutocompleteStyles} from "../../../../../../hooks/styling/useAutocompleteStyles";

type MakeAndModelProps = {
    setSelectedMakes: Dispatch<SetStateAction<string[]>>;
    setSelectedModels: Dispatch<SetStateAction<string[]>>;
    selectedModels: string[];
    selectedMakes: string[];
    setFormIsChecked: Dispatch<SetStateAction<boolean>>;
    disabled: boolean;
}

const MakeAndModel: React.FC<MakeAndModelProps> = ({
                                                       disabled,
                                                       setSelectedMakes,
                                                       selectedModels,
                                                       selectedMakes,
                                                       setSelectedModels,
                                                       setFormIsChecked,
                                                   }) => {
    const { makes: makesFromDB } = useSelector((state: RootState) => state.packages);
    const [models, setModels] = useState<string[]>([]);
    const classes = useAutocompleteStyles();

    useEffect(() => {
        const filteredMakes = makesFromDB.filter(item => upperCase(selectedMakes).includes(item.name.toUpperCase()));
        setModels(getSortedModels(filteredMakes))
    }, [makesFromDB])

    const getSortedMakes = useCallback((makesFromDB: IMake[]): string[] => {
        const data: string[] = makesFromDB
            .map(make => make.name)
            .sort((a, b) => upperCase(selectedMakes).includes(a.toUpperCase())
                ? upperCase(selectedMakes).includes(b.toUpperCase())
                    ? 0
                    : -1
                : 1);
        if (data.length) data.unshift('Apply To All');
        return data;
    }, [makesFromDB, selectedMakes])

    const getSortedModels = useCallback((makesFromDB: IMake[]): string[] => {
        const data: string[] = makesFromDB
            .map(make => make.models)
            .flat(1)
            .sort((a, b) => upperCase(selectedModels).includes(a.toUpperCase())
                ? upperCase(selectedModels).includes(b.toUpperCase())
                    ? 0
                    : -1
                : 1);
        if (data.length) data.unshift('Apply To All');
        return data;
    }, [makesFromDB, selectedModels])

    const sortMakes = (a: string, b: string) => {
        return upperCase(selectedMakes).includes(a.toUpperCase())
            ? upperCase(selectedMakes).includes(b.toUpperCase())
                ? 0
                : -1
            : 1
    }

    const sortModels = (a: string, b: string) => {
        return upperCase(selectedModels).includes(a.toUpperCase())
            ? upperCase(selectedModels).includes(b.toUpperCase())
                ? 0
                : -1
            : 1
    }

    const onMakeCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>, option: string) => {
        setFormIsChecked(false);
        let data = option === 'Apply To All'
            ? e.target.checked
                ? makesFromDB.map(el => el.name)
                : []
            : selectedMakes;
        setSelectedMakes(() => {
            data = !e.target.checked
                ? data.filter(item => item !== option).sort(sortMakes)
                : option === 'Apply To All'
                    ? data.sort(sortModels)
                    : data.concat(option).sort(sortMakes)
            return data
        })
        const filteredMakes = makesFromDB.filter(item => upperCase(data).includes(item.name.toUpperCase()))
        setModels(getSortedModels(filteredMakes));
    }, [selectedMakes, makesFromDB])

    const onModelCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>, option: string) => {
        setFormIsChecked(false);
        setSelectedModels(prev => {
            let data = option === 'Apply To All'
                ? e.target.checked
                    ? models
                    : []
                : prev;
            return !e.target.checked
                ? data.filter(item => item !== option).sort(sortModels)
                : option === 'Apply To All'
                    ? data.sort(sortModels)
                    : data.concat(option).sort(sortModels)
        })
    }, [selectedModels, models])

    const renderMakeOption = useCallback((props, option) => {
        const checked = upperCase(selectedMakes).includes(option.toUpperCase())
            || Boolean(!makesFromDB.find(make => !upperCase(selectedMakes).includes(make.name.toUpperCase())));
        return <div style={{display: 'flex', alignItems: 'center'}} key={option}>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onMakeCheckboxChange(e, option)}
            />
            {option}
        </div>
    }, [makesFromDB, selectedMakes]);

    const renderModelOption = useCallback((props, option) => {
        const filteredMakes = makesFromDB.filter(item => upperCase(selectedMakes).includes(item.name.toUpperCase()));

        const allModelsSelected = filteredMakes.length
            ? Boolean(!filteredMakes
            .map(item => item.models)
            .flat(1)
            .find(model => !upperCase(selectedModels).includes(model.toUpperCase())))
            : false;

        const checked = upperCase(selectedModels).includes(option.toUpperCase()) || allModelsSelected;
        return <div style={{display: 'flex', alignItems: 'center'}} key={option}>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onModelCheckboxChange(e, option)}
            />
            {option}
        </div>
    }, [makesFromDB, selectedModels, selectedMakes, onModelCheckboxChange]);

    const onMakeChange = (e: React.SyntheticEvent, value: string[]) => {
        setSelectedMakes(value);
    }

    const onModelChange = (e: React.SyntheticEvent, value: string[]) => {
        setSelectedModels(value);
    }

    return (
        <div>
            <Autocomplete
                multiple
                style={{ marginBottom: 10 }}
                classes={classes}
                disabled={disabled}
                options={getSortedMakes(makesFromDB)}
                disableCloseOnSelect
                onChange={onMakeChange}
                getOptionLabel={o => o ?? null}
                isOptionEqualToValue={(o, v) => o.toLowerCase() === v.toLowerCase()}
                renderOption={renderMakeOption}
                value={selectedMakes}
                renderInput={autocompleteRender({
                    label: "Make",
                    placeholder: 'Select Make'
                })}
            />
            <Autocomplete
                multiple
                style={{ marginBottom: 10 }}
                classes={classes}
                disabled={disabled}
                options={models}
                disableCloseOnSelect
                onChange={onModelChange}
                renderOption={renderModelOption}
                getOptionLabel={o => o ?? null}
                isOptionEqualToValue={(o, v) => o.toLowerCase() === v.toLowerCase()}
                value={selectedModels}
                renderInput={autocompleteRender({
                    label: "Model",
                    placeholder: 'Select Model'
                })}
            />
        </div>
    );
};

export default MakeAndModel;