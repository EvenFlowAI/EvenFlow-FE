import React, {Dispatch, SetStateAction} from 'react';
import {Grid} from "@material-ui/core";
import {DatePicker} from "../../../UI/DateTimePickers";
import {CalendarToday} from "@material-ui/icons";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../UI/AutocompleteRender";
import {IAppointmentSlot} from "../../../../store/reducers/appointment/types";
import moment from "moment";
import {timeString} from "../../../../config/constants";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

type TSlotSelectionProps = {
    slotsLoading: boolean;
    selectedSlot: IAppointmentSlot|null
    setSelectedSlot: Dispatch<SetStateAction<IAppointmentSlot|null>>
    slots: IAppointmentSlot[];
    filterDate: ParsableDate;
    setDate: Dispatch<SetStateAction<ParsableDate>>;
    errors: string[];
    setErrors: Dispatch<SetStateAction<string[]>>;
}

const SlotSelection: React.FC<TSlotSelectionProps> = ({ setErrors, errors, slotsLoading, selectedSlot, setSelectedSlot, slots, filterDate, setDate }) => {
    const handleSlotChange = (e: any, value: IAppointmentSlot|null) => {
        setErrors(prev => prev.filter(item => item !== "slot"));
        setSelectedSlot(value);
    }

    const getDate = (option: IAppointmentSlot) => {
        const date = `${String(option.date).split("T")[0]}T${option.time}Z`;
        return moment.utc(date).format(`LL - ${timeString}`);
    }

    const handleDateChange = (date: ParsableDate) => {
        setErrors(prev => prev.filter(item => item !== "date"));
        setDate(date);
    }

    return (
        <React.Fragment>
            <Grid item xs={12} sm={4}>
                <DatePicker
                    value={filterDate || null}
                    onChange={handleDateChange}
                    label="Date"
                    disablePast
                    error={errors.includes("date")}
                    InputProps={{
                        endAdornment: <CalendarToday />,
                        placeholder: "Select Date",
                    }}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={8}>
                <Autocomplete
                    loading={slotsLoading}
                    value={selectedSlot}
                    getOptionSelected={(option, value) => option.date === value.date && option.time === value.time}
                    getOptionLabel={option =>
                        `${getDate(option)} - $${
                            option.priceWithOffer?.value ? option.priceWithOffer.value.toFixed(2) : option.price.value.toFixed(2)
                        }`
                    }
                    onChange={handleSlotChange}
                    renderInput={autocompleteRender({label: "Time slot", placeholder: "Select Slot", error: errors.includes("slot")})}
                    options={slots}
                />
            </Grid>
        </React.Fragment>
    );
};

export default SlotSelection;