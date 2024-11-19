import React from 'react';
import {FiltersWrapper} from "./styles";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {Autocomplete} from "@mui/material";
import {IGlobalMake, IGlobalModel, TReviewOption} from "../../../../store/reducers/globalVehicles/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useAutocompleteStyles} from "../../../../hooks/styling/useAutocompleteStyles";
import {reviewOptions} from "../../../../utils/constants";

type TProps = {
    onMakeChange: (e: React.ChangeEvent<{}>, option: IGlobalMake|null) => void;
    onStatusChange: (e: React.ChangeEvent<{}>, option: TReviewOption|null) => void;
    onModelsChange: (e: React.ChangeEvent<{}>, option: IGlobalModel[]) => void;
    modelsOptions: IGlobalModel[];
    isLoading: boolean;
    selectedMake: IGlobalMake|null
    selectedModel: IGlobalModel[];
    selectedStatus: TReviewOption|null;
    disabled: boolean;
}

const Filters: React.FC<TProps> = ({disabled, modelsOptions, selectedModel, onModelsChange, onMakeChange, onStatusChange, isLoading, selectedMake, selectedStatus}) => {
    const {allMakesOptions} = useSelector((state: RootState) => state.globalVehicles);
    const { classes  } = useAutocompleteStyles()
    return (
        <FiltersWrapper>
            <Autocomplete
                style={{width: 180}}
                loading={isLoading}
                value={selectedMake}
                disabled={disabled || isLoading}
                options={allMakesOptions}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={o => o.vinMake}
                onChange={onMakeChange}
                renderInput={autocompleteRender({
                    label: "Make",
                    placeholder: 'Not selected'
                })}
            />
            <Autocomplete
                style={{width: 180}}
                loading={isLoading}
                disabled={disabled || isLoading}
                value={selectedModel}
                options={modelsOptions}
                multiple
                classes={classes}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={o => o.vinModel}
                onChange={onModelsChange}
                renderInput={autocompleteRender({
                    label: "Model",
                    placeholder: 'Not selected'
                })}
            />
            <Autocomplete
                style={{width: 180}}
                loading={isLoading}
                value={selectedStatus}
                options={reviewOptions}
                isOptionEqualToValue={(o, v) => o === v}
                getOptionLabel={o => o}
                onChange={onStatusChange}
                disabled={disabled || isLoading}
                renderInput={autocompleteRender({
                    label: "Review Status",
                    placeholder: 'Not selected'
                })}
            />
        </FiltersWrapper>
    );
};

export default Filters;