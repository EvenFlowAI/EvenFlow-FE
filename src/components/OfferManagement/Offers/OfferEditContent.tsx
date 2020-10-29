import React from 'react';
import {TextField} from "../../UI/TextField";
import {FormControlLabel, MenuItem, Radio, RadioGroup, Select} from "@material-ui/core";
import {
    customerPresence,
    customerSegments,
    dayOfWeek, ECustomerSegment, EDayOfWeek,
    EOfferType,
    offerTypes
} from "../../../store/reducers/offers/types";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteOptionsRender, autocompleteRender} from "../../UI/AutocompleteRender";
import clsx from "clsx";
import {DatePicker, TimePicker} from "../../UI/DateTimePickers";
import {DateRange, QueryBuilder} from "@material-ui/icons";
import {DialogContent} from "../../Modals/BaseModal";
import {makeStyles} from "@material-ui/core/styles";
import {TOfferForm} from "./types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {TEnumMap} from "../../../store/reducers/utils";
import {IAssignedServiceRequestShort} from "../../../store/reducers/serviceRequests/types";


const useStyles = makeStyles({
    inputContainer: {
        marginTop: 10,
        "&:first-child": {
            marginTop: 0
        }
    },
    rowContainer: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexFlow: "row nowrap",
    },
    innerContainer: {
        flexGrow: 1,
        flexBasis: 0
    },
    divider: {
        padding: 10
    }
});

type TAutoChangeEvent = React.ChangeEvent<{name?: string, value: unknown}>

type TProps = {
    form: TOfferForm;
    onSelect: (e: TAutoChangeEvent) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRadio: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    onChangeDateTime: (name: keyof TOfferForm) => (date: MaterialUiPickersDate) => void;
    onDOWSelect: (e: any, value: TEnumMap<EDayOfWeek>[]) => void;
    onSegmentSelect: (e: any, value: TEnumMap<ECustomerSegment>[]) => void;
    onSRChange: (e: any, value: IAssignedServiceRequestShort[]) => void;
}
export const OfferEditContent: React.FC<TProps> = ({
    form,
    onSelect,
    onChange,
    onRadio,
    onChangeDateTime,
    onDOWSelect,
    onSegmentSelect,
    onSRChange,
}) => {
    const serviceRequests = useSelector((state: RootState) => state.serviceRequests.scRequestsShort);

    const classes = useStyles();
    return <DialogContent>
        <div className={classes.inputContainer}>
            <TextField
                fullWidth
                label="Offer title"
                name="offerTitle"
                id="offerTitle"
                onChange={onChange}
                value={form.offerTitle||""}
            />
        </div>
        <div className={classes.inputContainer}>
            <RadioGroup
                row
                value={form.offerType}
                onChange={onRadio}
                name="offerType"
            >
                {offerTypes.map(ot => {
                    return <FormControlLabel
                        control={<Radio color="primary" />}
                        disabled={ot.id === EOfferType.FreeService}
                        label={ot.label}
                        labelPlacement="end"
                        key={ot.id}
                        value={ot.id}
                    />
                })}
            </RadioGroup>
        </div>
        <div className={classes.inputContainer}>
            <TextField
                style={{width: "50%"}}
                label="Offer value"
                onChange={onChange}
                name="offerValue"
                endAdornment={
                    form.offerType === EOfferType.PercentOff
                        ? "%"
                        : form.offerType === EOfferType.AmountOff
                            ? "$" : ""
                }
                id="offerValue"
                type="number"
                inputProps={{min: 0}}
                value={form.offerValue||""}
            />
        </div>
        <div className={classes.inputContainer}>
            {/*<Autocomplete*/}
            {/*    value={form.serviceType ? form.serviceType[0] : null}*/}
            {/*    options={form.serviceType || []}*/}
            {/*    onChange={(event, newValue) => {*/}
            {/*        if (typeof newValue === 'string') {*/}
            {/*            setForm({*/}
            {/*                ...form, serviceType: [{name: newValue}],*/}
            {/*            });*/}
            {/*        } else if (newValue && newValue?.inputValue) {*/}
            {/*            // Create a new value from the user input*/}
            {/*            setForm({*/}
            {/*                ...form,*/}
            {/*                serviceType: [{name: newValue.inputValue}],*/}
            {/*            });*/}
            {/*        } else if (newValue) {*/}
            {/*            setForm({...form, serviceType: [newValue]});*/}
            {/*        }*/}
            {/*    }}*/}
            {/*    filterOptions={(options, params) => {*/}
            {/*        const filtered = filter(options, params);*/}

            {/*        // Suggest the creation of a new value*/}
            {/*        if (params.inputValue !== '') {*/}
            {/*            filtered.push({*/}
            {/*                name: `Add "${params.inputValue}"`,*/}
            {/*            });*/}
            {/*        }*/}

            {/*        return filtered;*/}
            {/*    }}*/}
            {/*    selectOnFocus*/}
            {/*    clearOnBlur*/}
            {/*    fullWidth*/}
            {/*    handleHomeEndKeys*/}
            {/*    id="Offer type"*/}
            {/*    getOptionLabel={(option) => {*/}
            {/*        // Value selected with enter, right from the input*/}
            {/*        if (typeof option === 'string') {*/}
            {/*            return option;*/}
            {/*        }*/}
            {/*        // Add "xxx" option created dynamically*/}
            {/*        if (option.inputValue) {*/}
            {/*            return option.inputValue;*/}
            {/*        }*/}
            {/*        // Regular option*/}
            {/*        return option.name;*/}
            {/*    }}*/}
            {/*    renderOption={(option) => option.name}*/}
            {/*    renderInput={autocompleteRender({label: "Offer type"})}*/}
            {/*/>*/}
        </div>
        <div className={classes.inputContainer}>
            <Autocomplete
                options={serviceRequests}
                multiple
                ChipProps={{
                    color: "primary",
                    style: {borderRadius: 4},
                    size: "small"
                }}
                disableCloseOnSelect
                onChange={onSRChange}
                getOptionLabel={i => i.code}
                renderOption={autocompleteOptionsRender((e) => e.code)}
                loading={false}
                value={form.serviceRequests}
                renderInput={autocompleteRender({label: "Service request included", fullWidth: true})}
            />
        </div>
        <div className={classes.inputContainer}>
            <Autocomplete
                options={customerSegments}
                multiple
                limitTags={3}
                ChipProps={{
                    color: "primary",
                    style: {borderRadius: 4},
                    size: "small"
                }}
                disableCloseOnSelect
                onChange={onSegmentSelect}
                getOptionLabel={i => i.label}
                renderOption={autocompleteOptionsRender((e) => e.label)}
                loading={false}
                value={form.customerSegments}
                renderInput={autocompleteRender({label: "Applicable customer segment", fullWidth: true})}
            />
        </div>
        <div className={clsx(classes.inputContainer, classes.rowContainer)}>
            <div className={classes.innerContainer}>
                <Select
                    value={form.customerPresence}
                    name={"customerPresence"}
                    fullWidth
                    input={<TextField label="Customer Presence" />}
                    onChange={onSelect}
                >
                    {customerPresence.map(pr => {
                        return <MenuItem key={pr.id} value={pr.id}>{pr.label}</MenuItem>;
                    })}
                </Select>
            </div>
            <div className={classes.divider} style={{visibility: "hidden"}}>-</div>
            <div className={classes.innerContainer}>
                <div className={classes.inputContainer}>
                    <Autocomplete
                        options={dayOfWeek}
                        multiple
                        limitTags={2}
                        ChipProps={{
                            color: "primary",
                            style: {borderRadius: 4},
                            size: "small"
                        }}
                        disableCloseOnSelect
                        onChange={onDOWSelect}
                        getOptionLabel={i => i.label}
                        renderOption={autocompleteOptionsRender((e) => e.label)}
                        loading={false}
                        value={form.dayOfWeek}
                        renderInput={autocompleteRender({label: "Day of a Week", fullWidth: true})}
                    />
                </div>
            </div>
        </div>
        <div className={clsx(classes.inputContainer, classes.rowContainer)}>
            <div className={classes.innerContainer}>
                <TimePicker
                    fullWidth
                    label={"Time of Day"}
                    InputProps={{
                        endAdornment: <QueryBuilder color={"disabled"} />
                    }}
                    value={form.timeOfDayFrom||null}
                    onChange={onChangeDateTime("timeOfDayFrom")} />
            </div>
            <div className={classes.divider}>-</div>
            <div className={classes.innerContainer}>
                <TimePicker
                    fullWidth
                    InputProps={{
                        endAdornment: <QueryBuilder color={"disabled"} />
                    }}
                    value={form.timeOfDayTo||null}
                    onChange={onChangeDateTime("timeOfDayTo")} />
            </div>
        </div>
        <div className={clsx(classes.inputContainer, classes.rowContainer)}>
            <div className={classes.innerContainer}>
                <DatePicker
                    fullWidth
                    label={"Duration"}
                    InputProps={{
                        endAdornment: <DateRange color={"disabled"} />
                    }}
                    value={form.durationFrom||null}
                    onChange={onChangeDateTime("durationFrom")} />
            </div>
            <div className={classes.divider}>-</div>
            <div className={classes.innerContainer}>
                <DatePicker
                    fullWidth
                    InputProps={{
                        endAdornment: <DateRange color={"disabled"} />
                    }}
                    value={form.durationTo||null}
                    onChange={onChangeDateTime("durationTo")} />
            </div>
        </div>
    </DialogContent>
};