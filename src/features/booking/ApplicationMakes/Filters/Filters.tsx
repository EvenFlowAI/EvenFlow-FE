import React from 'react';
import {FiltersWrapper} from "./styles";
import {TArgCallback} from "../../../../types/types";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {Autocomplete} from "@mui/material";

type TProps = {
    onMakeChange: TArgCallback<any>;
    onStatusChange: TArgCallback<any>;
    isLoading: boolean;
    selectedMake: any;
    selectedStatus: any;
}

const Filters: React.FC<TProps> = ({onMakeChange, onStatusChange, isLoading, selectedMake, selectedStatus}) => {
    const makes = ['make 1'];
    const statuses = ['Status 1'];
    return (
        <FiltersWrapper>
            <Autocomplete
                style={{width: 180}}
                loading={isLoading}
                value={selectedMake}
                options={makes}
                isOptionEqualToValue={(o, v) => o === v}
                getOptionLabel={o => o}
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
                options={statuses}
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