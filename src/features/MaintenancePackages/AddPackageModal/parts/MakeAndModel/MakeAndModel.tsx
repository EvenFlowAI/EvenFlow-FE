import React, {ChangeEvent, useCallback, Dispatch, SetStateAction, useState, useEffect} from 'react';
import {autocompleteRender, useAutocompleteStyles} from "../../../../../components/UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import Checkbox from "../../../../../components/UI/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {IMake} from "../../../../../api/types";
import {upperCase} from "./utils";

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

    const onMakeChange = useCallback((e: ChangeEvent<{}>, value: string[]) => {
        if (value.includes('Apply To All')) {
            setSelectedMakes(() => makesFromDB.map(item => item.name));
            setModels(getSortedModels(makesFromDB));
        } else {
            setSelectedMakes(value);
            const filteredMakes = makesFromDB.filter(item => upperCase(value).includes(item.name.toUpperCase()))
            setModels(getSortedModels(filteredMakes));
            setSelectedModels(prev => prev.filter(item => filteredMakes.find(make => upperCase(make.models).includes(item.toUpperCase()))))
        }
    }, [makesFromDB, getSortedModels])

    const onModelChange = useCallback((e: ChangeEvent<{}>, value: string[]) => {
        if (value.includes('Apply To All')) {
            const filteredMakes = makesFromDB.filter(item => upperCase(selectedMakes).includes(item.name.toUpperCase()));
            setSelectedModels(() => filteredMakes
                .map(item => item.models)
                .flat(1));
        } else setSelectedModels(value);
    }, [makesFromDB, selectedMakes])

    const onMakeCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>, option: string) => {
        setFormIsChecked(false);
        if (!e.target.checked) {
            setSelectedMakes(prev => {
                let data = option === 'Apply To All' ? [] : prev;
                return data
                    .filter(item => item !== option)
                    .sort((a, b) => upperCase(selectedMakes).includes(a.toUpperCase())
                        ? upperCase(selectedMakes).includes(b.toUpperCase())
                            ? 0
                            : -1
                        : 1)
            })
        }
    }, [selectedMakes])

    const onModelCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>, option: string) => {
        setFormIsChecked(false);
        if (!e.target.checked) {
            setSelectedModels(prev => {
                let data = option === 'Apply To All' ? [] : prev;
                return data
                    .filter(item => item !== option)
                    .sort((a, b) => upperCase(selectedModels).includes(a.toUpperCase())
                        ? upperCase(selectedModels).includes(b.toUpperCase())
                            ? 0
                            : -1
                        : 1)
            })
        }
    }, [selectedModels])

    const renderMakeOption = useCallback((option: string) => {
        const checked = upperCase(selectedMakes).includes(option.toUpperCase())
            || Boolean(!makesFromDB.find(make => !upperCase(selectedMakes).includes(make.name.toUpperCase())));
        return <React.Fragment>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onMakeCheckboxChange(e, option)}
            />
            {option}
        </React.Fragment>
    }, [makesFromDB, selectedMakes]);

    const renderModelOption = useCallback((option: string) => {
        const filteredMakes = makesFromDB.filter(item => upperCase(selectedMakes).includes(item.name.toUpperCase()));

        const allModelsSelected = filteredMakes.length
            ? Boolean(!filteredMakes
            .map(item => item.models)
            .flat(1)
            .find(model => !upperCase(selectedModels).includes(model.toUpperCase())))
            : false;

        const checked = upperCase(selectedModels).includes(option.toUpperCase()) || allModelsSelected;
        return <React.Fragment>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onModelCheckboxChange(e, option)}
            />
            {option}
        </React.Fragment>
    }, [makesFromDB, selectedModels, selectedMakes, onModelCheckboxChange]);

    return (
            <div>
                <Autocomplete
                    multiple
                    style={{ marginBottom: 10 }}
                    classes={classes}
                    disabled={disabled}
                    options={getSortedMakes(makesFromDB)}
                    disableCloseOnSelect
                    getOptionSelected={(o, v) => o.toLowerCase() === v.toLowerCase()}
                    renderOption={renderMakeOption}
                    value={selectedMakes}
                    onChange={onMakeChange}
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
                    renderOption={renderModelOption}
                    getOptionSelected={(o, v) => o.toLowerCase() === v.toLowerCase()}
                    value={selectedModels}
                    onChange={onModelChange}
                    renderInput={autocompleteRender({
                        label: "Model",
                        placeholder: 'Select Chip'
                    })}
                />
            </div>
    );
};

export default MakeAndModel;