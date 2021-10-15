import React, {ChangeEvent, useCallback, useMemo, Dispatch, SetStateAction} from 'react';
import {autocompleteRender} from "../../../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {TMake} from "../../AddPackage";
import Checkbox from "../../../../UI/Checkbox";
import {makeStyles} from "@material-ui/core/styles";
import {Cancel, CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";

export type TModelOption = {
    title: string;
    selected: string;
}

type MakeAndModelProps = {
    data: TMake;
    setMakes: Dispatch<SetStateAction<TMake[]>>;
    makes: TMake[];
    formIsChecked: boolean;
    setFormIsChecked: Dispatch<SetStateAction<boolean>>;
    disabled: boolean;
}

const optionsState = {
    selectAll: 'Select All',
    selected: 'Selected',
    nonSelected: 'All Models'
}

const useAutoCompleteStyles = makeStyles(() => ({
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

const useStyles = makeStyles(() => ({
    makeWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 40px',
        columnGap: 5,
        alignItems: "center",
    },
    iconBtn: {
        marginTop: 15,
    }
}))

const MakeAndModel: React.FC<MakeAndModelProps> = ({ disabled, setMakes, data, makes, formIsChecked, setFormIsChecked}) => {
    const { makes: makesFromDB } = useSelector((state: RootState) => state.packages);
    const make = useMemo(() => makesFromDB.find(make => make.name === data.name), [makesFromDB, data]);
    const index = useMemo(() => makes.findIndex(item => item.id === data.id), [makes, data]);
    const classes = useAutoCompleteStyles();
    const styles = useStyles();

    const onMakeChange = useCallback((e: ChangeEvent<{}>, make: string | null, id: number): void => {
        setFormIsChecked(false);
        if (make) {
            setMakes(prev => {
                const data: TMake = {id, name: make, models: []};
                const filtered = prev.filter(item => item.id !== id);
                return [...filtered, data].sort((a, b) => a.id - b.id)
            })
        } else {
            setMakes(prev => {
                if (prev.length > 1) return prev.filter(item => item.id !== id);
                return prev;
            })
        }
    }, [])

    const onModelsChange = useCallback((e: ChangeEvent<{}>, models: TModelOption[], id: number, reason: string): void => {
        setFormIsChecked(false);
        const selectedMake: TMake | undefined = makes.find(item => item.id === id);
        const selectedModels = selectedMake?.models;
        const modelIsNew = Boolean(models.find(model => !selectedModels?.includes(model.title)));

        if (modelIsNew || reason === 'remove-option') {
            setMakes(prev => {
                const data = prev.find(item => item.id === id);
                if (data) {
                    if (models.find(model => model.selected === optionsState.selectAll)) {
                        const models = makesFromDB.find(item => item.name === data.name)?.models;
                        if (models) data.models = models;
                    } else {
                        data.models = models.map(model => model.title)
                    }
                    const filtered = prev.filter(item => item.id !== id);
                    return [...filtered, data].sort((a, b) => a.id - b.id)
                } else return prev
            })
        }
    }, [makes, makesFromDB])

    const sortOptions = (a: TModelOption, b: TModelOption) => {
        return a.selected === optionsState.selected && b.selected === optionsState.selected
            ? 0
            : b.selected !== optionsState.selected
                ? -1
                : 1
    }

    const getModelsOptions = useCallback(() => {
        let models: TModelOption[] = [];
        if (makesFromDB.length && data?.name) {
            models.push({selected: optionsState.selectAll, title: 'Apply To All'});
            if (make?.models) models.push(...make.models
                .map(model => ({selected: data.models.includes(model) ? optionsState.selected: optionsState.nonSelected, title: model}))
                .sort(sortOptions));
        }
        return models;
    }, [data, makesFromDB])

    const onCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>, option: TModelOption, id: number) => {
        setFormIsChecked(false);
        if (!e.target.checked) {
            setMakes(prev => {
                const data = prev.find(item => item.id === id);
                if (data) {
                    data.models = option.selected !== optionsState.selectAll
                        ? data.models.filter(item => item !== option.title)
                        : [];
                    const filtered = prev.filter(item => item.id !== id);
                    return [...filtered, data].sort((a, b) => a.id - b.id)
                } else return prev
            })
        }
    }, [])

    const renderOption = useCallback((option: TModelOption) => {
        const allModelsSelected = Boolean(make && !make.models.find(item => !data.models.includes(item)));
        const checked = option.selected === optionsState.selected || (option.selected === optionsState.selectAll && allModelsSelected)
        return <React.Fragment>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onCheckboxChange(e, option, data.id)}
            />
            {option.title}
        </React.Fragment>
    }, [data, make])

    const deleteMake = () => {
        if (makes.length > 1) setMakes(prev => prev.filter(item => item.id !== data.id));
    }

    return (
            <div>
                <div className={index > 0 ? styles.makeWrapper : undefined}>
                    <Autocomplete
                        disabled={disabled}
                        style={{ marginBottom: 10 }}
                        options={makesFromDB.map(make => make.name)}
                        getOptionSelected={(option, value) => option === value}
                        value={data?.name || null}
                        onChange={(e, make) => onMakeChange(e, make, data.id)}
                        renderInput={autocompleteRender({
                            label: "Make",
                            fullWidth: true,
                            placeholder: 'Select Make',
                            error: !data?.name && formIsChecked
                        })}
                    />
                    {index > 0 && <IconButton
                        className={styles.iconBtn}
                        onClick={deleteMake}>
                        <Cancel htmlColor="#DADADA"/>
                    </IconButton>}
                </div>
                <Autocomplete
                    multiple
                    disabled={disabled}
                    style={{ marginBottom: 10 }}
                    classes={classes}
                    getOptionSelected={(option, value) => option.title === value.title}
                    options={getModelsOptions()}
                    disableCloseOnSelect
                    disableClearable
                    groupBy={option => option.selected}
                    getOptionLabel={(option) => option.title}
                    renderOption={renderOption}
                    value={data?.models.map(model => ({selected: optionsState.selected, title: model})) || undefined}
                    onChange={(e, models, reason) => onModelsChange(e, models, data.id, reason)}
                    renderInput={autocompleteRender({
                        label: "Model",
                        placeholder: data.models.length ? undefined : 'Select model',
                        error: !data?.models.length && formIsChecked
                    })}
                />
            </div>
    );
};

export default MakeAndModel;