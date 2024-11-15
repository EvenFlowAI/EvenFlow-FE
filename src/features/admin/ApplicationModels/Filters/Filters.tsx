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
    onStatusChange: (e: React.ChangeEvent<{}>, option: TReviewOption) => void;
    onModelsChange: (e: React.ChangeEvent<{}>, option: IGlobalModel[]) => void;
    isLoading: boolean;
    selectedMake: any;
    selectedModel: any;
    selectedStatus: any;
}

const Filters: React.FC<TProps> = ({selectedModel, onModelsChange, onMakeChange, onStatusChange, isLoading, selectedMake, selectedStatus}) => {
    const {allMakesOptions, allModelsOptions} = useSelector((state: RootState) => state.globalVehicles);
    const { classes  } = useAutocompleteStyles()
    return (
        <FiltersWrapper>
            <Autocomplete
                style={{width: 180}}
                loading={isLoading}
                value={selectedMake}
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
                value={selectedModel}
                options={allModelsOptions}
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
                renderInput={autocompleteRender({
                    label: "Review Status",
                    placeholder: 'Not selected'
                })}
            />
        </FiltersWrapper>
    );
};

export default Filters;