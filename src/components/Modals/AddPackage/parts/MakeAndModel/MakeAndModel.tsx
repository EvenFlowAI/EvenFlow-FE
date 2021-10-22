import React, {ChangeEvent, useCallback, Dispatch, SetStateAction} from 'react';
import {autocompleteRender} from "../../../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import Checkbox from "../../../../UI/Checkbox";
import {makeStyles} from "@material-ui/core/styles";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {IMake} from "../../../../../api/types";

type MakeAndModelProps = {
    setSelectedMakes: Dispatch<SetStateAction<string[]>>;
    setSelectedModels: Dispatch<SetStateAction<string[]>>;
    selectedModels: string[];
    selectedMakes: string[];
    formIsChecked: boolean;
    setFormIsChecked: Dispatch<SetStateAction<boolean>>;
    disabled: boolean;
    isApplyBusinessRules?:boolean;
}

const useStyles = makeStyles(() => ({
    tag: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#7898FF',
        borderRadius: 4,
        color: 'white',
        fontWeight: 'bold',
        margin: '1px 2px',
        '& > svg': {
            color: 'white',
        }
    },
    option: {
        padding: 0,
        fontSize: 15,
        height: 28,
    },
    inputRoot: {
        padding: 5,
        paddingRight: 8,
    },
}))

const MakeAndModel: React.FC<MakeAndModelProps> = ({
                                                       disabled,
                                                       setSelectedMakes,
                                                       selectedModels,
                                                       selectedMakes,
                                                       setSelectedModels,
                                                       formIsChecked,
                                                       setFormIsChecked,
                                                       isApplyBusinessRules}) => {
    const { makes: makesFromDB } = useSelector((state: RootState) => state.packages);
    const classes = useStyles();

    const getSortedMakes = (makesFromDB: IMake[]): string[] => {
        const data: string[] = makesFromDB
            .map(make => make.name)
            .sort((a, b) => selectedMakes.includes(a) ? selectedMakes.includes(b) ? 0 : -1 : 1);
        data.unshift('Apply To All');
        return data;
    }

    const getSortedModels = (makesFromDB: IMake[]): string[] => {
        const data: string[] = makesFromDB
            .map(make => make.models)
            .flat(1)
            .sort((a, b) => selectedModels.includes(a) ? selectedModels.includes(b) ? 0 : -1 : 1);
        data.unshift('Apply To All');
        return data;
    }

    const onMakeChange = (e: ChangeEvent<{}>, value: string[]) => {
        if (value.includes('Apply To All')) {
            setSelectedMakes(() => makesFromDB.map(item => item.name));
        } else setSelectedMakes(value);
    }

    const onModelChange = (e: ChangeEvent<{}>, value: string[]) => {
        if (value.includes('Apply To All')) {
            setSelectedModels(() => makesFromDB.map(item => item.models).flat(1));
        } else setSelectedModels(value);
    }

    const onMakeCheckboxChange = (e: ChangeEvent<HTMLInputElement>, option: string) => {
        setFormIsChecked(false);
        if (!e.target.checked) {
            setSelectedMakes(prev => {
                let data = option === 'Apply To All' ? [] : prev;
                return data
                    .filter(item => item !== option)
                    .sort((a, b) => selectedMakes.includes(a) ? selectedMakes.includes(b) ? 0 : -1 : 1)
            })
        }
    }

    const onModelCheckboxChange = (e: ChangeEvent<HTMLInputElement>, option: string) => {
        setFormIsChecked(false);
        if (!e.target.checked) {
            setSelectedModels(prev => {
                let data = option === 'Apply To All' ? [] : prev;
                return data
                    .filter(item => item !== option)
                    .sort((a, b) => selectedModels.includes(a) ? selectedModels.includes(b) ? 0 : -1 : 1)
            })
        }
    }

    const renderMakeOption = useCallback((option: string) => {
        const checked = selectedMakes.includes(option) || Boolean(!makesFromDB.find(make => !selectedMakes.includes(make.name)));
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
        const allModelsSelected = Boolean(!makesFromDB
            .map(item => item.models)
            .flat(1)
            .find(model => !selectedModels.includes(model)))
        const checked = selectedModels.includes(option) || allModelsSelected;
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
    }, [makesFromDB, selectedModels]);

    return (
            <div>
                <Autocomplete
                    multiple
                    style={{ marginBottom: 10 }}
                    classes={classes}
                    disabled={disabled}
                    options={getSortedMakes(makesFromDB)}
                    disableCloseOnSelect
                    renderOption={renderMakeOption}
                    value={selectedMakes}
                    onChange={onMakeChange}
                    renderInput={autocompleteRender({
                        label: "Make",
                        error: !selectedMakes.length && isApplyBusinessRules && formIsChecked,
                        placeholder: 'Select Make'
                    })}
                />
                <Autocomplete
                    multiple
                    style={{ marginBottom: 10 }}
                    classes={classes}
                    disabled={disabled}
                    options={getSortedModels(makesFromDB)}
                    disableCloseOnSelect
                    renderOption={renderModelOption}
                    value={selectedModels}
                    onChange={onModelChange}
                    renderInput={autocompleteRender({
                        label: "Model",
                        error: !selectedMakes.length && isApplyBusinessRules && formIsChecked,
                        placeholder: 'Select Model'
                    })}
                />
            </div>
    );
};

export default MakeAndModel;