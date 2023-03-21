import React, {Dispatch, SetStateAction} from 'react';
import {Grid} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../UI/AutocompleteRender";
import {IServiceValetAppointment} from "../../../../store/reducers/appointment/types";
import moment from "moment";
import {timeString} from "../../../../config/constants";

type TSlotSelectionProps = {
    slotsLoading: boolean;
    selectedSlot: IServiceValetAppointment|null
    setSelectedSlot: Dispatch<SetStateAction<IServiceValetAppointment|null>>
    slots: IServiceValetAppointment[];
    errors: string[];
    setErrors: Dispatch<SetStateAction<string[]>>;
}

const SVSlotSelection: React.FC<TSlotSelectionProps> = ({setErrors, errors, slotsLoading, selectedSlot, setSelectedSlot, slots }) => {
    const handleSlotChange = (e: any, value: IServiceValetAppointment|null) => {
        setErrors(prev => prev.filter(item => item !== "slot"));
        setSelectedSlot(value);
    }

    const getDate = (option: IServiceValetAppointment) => {
        const date = `${String(option.date)}`;
        return moment.utc(date).format(`LL - ${timeString}`);
    }

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Autocomplete
                    loading={slotsLoading}
                    value={selectedSlot}
                    getOptionSelected={(option, value) => option.date === value.date}
                    getOptionLabel={option => `${getDate(option)} - $${(option.price.value + option.price.ancillaryPrice).toFixed(2)}`}
                    onChange={handleSlotChange}
                    renderInput={autocompleteRender({label: "Pick Up Drop Off slot", placeholder: "Select Slot", error: errors.includes("slot")})}
                    options={slots}
                />
            </Grid>
        </React.Fragment>
    );
};

export default SVSlotSelection;