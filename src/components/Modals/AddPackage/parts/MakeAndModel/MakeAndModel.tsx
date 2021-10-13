import React, {ChangeEvent} from 'react';
import {autocompleteRender} from "../../../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {TMake} from "../../AddPackage";
import {IMake} from "../../../../../api/types";

export type TModelOption = {
    title: string;
    selected: string;
}

type MakeAndModelProps = {
    data: TMake;
    onMakeChange: (e: ChangeEvent<{}>, make: string | null, id: number) => void;
    onModelsChange: (e: ChangeEvent<{}>, models: TModelOption[], id: number) => void;
}

const MakeAndModel: React.FC<MakeAndModelProps> = ({ data, onMakeChange, onModelsChange}) => {
    const { makes } = useSelector((state: RootState) => state.packages);

    const getModelsOptions = (makes: IMake[]) => {
        let models: TModelOption[] = [];
        if (makes.length && data?.name) {
            const make = makes.find(make => make.name === data.name);
            if (make?.models) models = make.models
                .map(model => ({selected: data.models.includes(model) ? 'Selected': "All Models", title: model}))
                .sort((a, b) => {
                    return a.selected === 'Selected' && b.selected === 'Selected' ? 0 : b.selected !== 'Selected' ? -1 : 1
                });
        }
        return models;
    }

    return (
        <div>
            <Autocomplete
                options={makes.map(make => make.name)}
                value={data?.name || null}
                onChange={(e, make) => onMakeChange(e, make, data.id)}
                renderInput={autocompleteRender({label: "Make", fullWidth: true, placeholder: 'Select Make'})}
            />
            <Autocomplete
                multiple
                options={getModelsOptions(makes)}
                disableCloseOnSelect
                groupBy={option => option.selected}
                getOptionLabel={(option) => option.title}
                value={data?.models.map(model => ({selected: 'Selected', title: model})) || undefined}
                onChange={(e, models) => onModelsChange(e, models, data.id)}
                renderInput={autocompleteRender({label: "Models", fullWidth: true, placeholder: 'Select Models'})}
            />
        </div>
    );
};

export default MakeAndModel;