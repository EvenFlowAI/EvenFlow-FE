import React from 'react';
import {FiltersWrapper} from "./styles";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {Autocomplete} from "@mui/material";
import {TOption, TReviewOption} from "../../../../store/reducers/globalVehicles/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {reviewOptions} from "../ApplicationMakes";

type TProps = {
    onMakeChange: (e: React.ChangeEvent<{}>, option: TOption) => void;
    onStatusChange: (e: React.ChangeEvent<{}>, option: TReviewOption) => void;
    isLoading: boolean;
    selectedMake: any;
    selectedStatus: any;
}

const Filters: React.FC<TProps> = ({onMakeChange, onStatusChange, isLoading, selectedMake, selectedStatus}) => {
    const {allMakesOptions} = useSelector((state: RootState) => state.globalVehicles);
    return (
        <FiltersWrapper>
            <Autocomplete
                style={{width: 180}}
                loading={isLoading}
                value={selectedMake}
                options={allMakesOptions}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={o => o.name}
                onChange={onMakeChange}
                renderInput={autocompleteRender({
                    label: "Make",
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
                    placeholder: "Not selected"
                })}
            />
        </FiltersWrapper>
    );
};

export default Filters;