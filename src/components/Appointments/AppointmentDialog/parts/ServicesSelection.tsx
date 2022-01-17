import React from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../UI/AutocompleteRender";
import {Grid} from "@material-ui/core";
import {ISR} from "../../../../store/reducers/appointment/types";

type TServicesSelectionProps = {
    handleSRChange: (e: any, value: ISR[]) => void;
    srLoading: boolean;
    srList: ISR[];
    selectedSR: ISR[];
}

const ServicesSelection: React.FC<TServicesSelectionProps> = ({handleSRChange, selectedSR, srLoading, srList}) => {
    return (
        <Grid item xs={12}>
            <Autocomplete
                multiple
                onChange={handleSRChange}
                value={selectedSR}
                ChipProps={{
                    color: "primary",
                    style: {borderRadius: 4},
                    size: "small"
                }}
                loading={srLoading}
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={(option) => `${option.code}: ${option.description}`}
                renderInput={autocompleteRender({label: "Service Requests"})}
                options={srList}
            />
        </Grid>
    );
};

export default ServicesSelection;