import React, {useMemo} from 'react';
import {TextField} from "../../UI/TextField";
import {Button, FormControlLabel, MenuItem, Radio, RadioGroup, Select, Switch} from "@material-ui/core";
import {
    customerPresence,
    customerSegments,
    dayOfWeek,
    ECustomerSegment,
    EDayOfWeek,
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
import {selectAllSR, TOfferForm} from "./types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {TEnumMap} from "../../../store/reducers/utils";
import {IAssignedServiceRequestShort} from "../../../store/reducers/serviceRequests/types";
import {useModal} from "../../../utils/hooks";
import HtmlEditor from "../../Modals/HTMLEditor/HTMLEditor";


const useStyles = makeStyles(theme => ({
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
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
            alignItems: "stretch",
            marginTop: theme.spacing(4)
        }
    },
    lastRowContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexFlow: "row nowrap",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
            alignItems: "stretch",
            marginTop: theme.spacing(4)
        }
    },
    innerContainer: {
        flexGrow: 1,
        flexBasis: 0
    },
    divider: {
        padding: 10,
        [theme.breakpoints.down("xs")]: {
            visibility: "hidden",
            height: theme.spacing(1)
        }
    },
    text: {
        textTransform: "uppercase",
        fontWeight: "bold",
    }
}));

// const filter = createFilterOptions<TServiceTypeWithCustom>();

type TAutoChangeEvent = React.ChangeEvent<{name?: string, value: unknown}>;

type TProps = {
    form: TOfferForm;
    onSelect: (e: TAutoChangeEvent) => void;
    onValueChange: (name: keyof TOfferForm, value: unknown) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRadio: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    onChangeDateTime: (name: keyof TOfferForm) => (date: MaterialUiPickersDate) => void;
    onDOWSelect: (e: any, value: TEnumMap<EDayOfWeek>[]) => void;
    onSegmentSelect: (e: any, value: TEnumMap<ECustomerSegment>[]) => void;
    onSRChange: (e: any, value: IAssignedServiceRequestShort[]) => void;
    formIsChecked: boolean;
}
export const OfferEditContent: React.FC<TProps> = ({
    form,
    onSelect,
    onChange,
    onRadio,
    onChangeDateTime,
    onDOWSelect,
    onValueChange,
    onSegmentSelect,
    onSRChange,
    formIsChecked,
}) => {
    // const [options, setOptions] = useState<TServiceTypeWithCustom[]>([]);
    const serviceRequests = useSelector((state: RootState) => state.serviceRequests.scRequestsShort);
    const srWithAll: IAssignedServiceRequestShort[] = useMemo(() => {
        return [selectAllSR, ...serviceRequests];
    }, [serviceRequests]);
    const {isOpen, onOpen, onClose} = useModal();

    // const handleChangeServiceType = (event: any, values: TServiceTypeWithCustom[]) => {
    //     if (values.length) {
    //         // Add option to list and activate
    //         for (let i = 0; i < values.length; i++) {
    //             let v = values[i];
    //             if (v.inputValue) {
    //                 const newValue = {name: v.inputValue};
    //                 setOptions([...options, {name: v.inputValue}]);
    //                 values[i] = newValue;
    //                 break;
    //             }
    //         }
    //     }
    //     onValueChange("serviceType", values);
    // }

    const handleSwitch = (e: any, value: boolean) => {
        onValueChange('isProductPageOn', value);
    }

    const classes = useStyles();
    return <DialogContent>
        <div className={classes.inputContainer}>
            <TextField
                fullWidth
                label="Offer title"
                name="offerTitle"
                id="offerTitle"
                error={formIsChecked && !form.offerTitle?.length}
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
                        label={ot.label}
                        labelPlacement="end"
                        key={ot.id}
                        value={ot.id}
                    />
                })}
            </RadioGroup>
        </div>
        {form.offerType === EOfferType.FreeService ?
            <div className={classes.inputContainer}>
                <TextField
                    value={form.serviceType || ""}
                    name="serviceType"
                    id="serviceType"
                    label="Service type"
                    fullWidth
                    onChange={onChange}
                />
                {/*<Autocomplete
                    multiple
                    value={form.serviceType || []}
                    options={options}
                    ChipProps={{
                        color: "primary",
                        style: {borderRadius: 4},
                        size: "small"
                    }}
                    onChange={handleChangeServiceType}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        // Suggest the creation of a new value
                        if (params.inputValue !== '' && !filtered.length) {
                            filtered.push({
                                name: `Add "${params.inputValue}"`,
                                inputValue: params.inputValue
                            });
                        }

                        return filtered;
                    }}
                    getOptionSelected={((option, value) => option.name === value.name)}
                    selectOnFocus
                    clearOnBlur
                    fullWidth
                    handleHomeEndKeys
                    id="offer_type"
                    getOptionLabel={(option) => {
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        // Regular option
                        return option.name;
                    }}
                    renderOption={autocompleteOptionsRender(e => e.name)}
                    renderInput={autocompleteRender({label: "Offer type"})}
                />*/}
            </div> :
            <div className={classes.inputContainer}>
                <TextField
                    style={{width: "50%"}}
                    label="Offer value"
                    onChange={onChange}
                    name="offerValue"
                    endAdornment={
                        form.offerType === EOfferType.PercentOff
                            ? "%"
                            : "$"
                    }
                    id="offerValue"
                    type="number"
                    inputProps={{min: 0}}
                    error={formIsChecked && !form.offerValue?.length}
                    value={form.offerValue||""}
                />
            </div>
        }
        <div className={classes.inputContainer}>
            <Autocomplete
                options={srWithAll}
                multiple
                ChipProps={{
                    color: "primary",
                    style: {borderRadius: 4},
                    size: "small"
                }}
                disableCloseOnSelect
                onChange={onSRChange}
                getOptionLabel={i => i.code}
                getOptionSelected={(option, value) => {
                    return option.id === value.id;
                }}
                renderOption={autocompleteOptionsRender((e) => e.code)}
                loading={false}
                value={form.serviceRequests}
                renderInput={autocompleteRender({
                    label: "Service request included",
                    fullWidth: true,
                    error: formIsChecked && !form.serviceRequests.length
                })}
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
                renderInput={autocompleteRender({
                    label: "Applicable customer segment",
                    fullWidth: true,
                    error: formIsChecked && !form.customerSegments.length
                })}
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
                        renderInput={autocompleteRender({
                            label: "Day of a Week",
                            fullWidth: true,
                            error: formIsChecked && !form.dayOfWeek.length
                        })}
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
                        endAdornment: <QueryBuilder color={"disabled"} />,
                        error: formIsChecked && !form.timeOfDayFrom
                    }}
                    value={form.timeOfDayFrom||null}
                    onChange={onChangeDateTime("timeOfDayFrom")} />
            </div>
            <div className={classes.divider}>-</div>
            <div className={classes.innerContainer}>
                <TimePicker
                    fullWidth
                    InputProps={{
                        endAdornment: <QueryBuilder color={"disabled"} />,
                        error: formIsChecked && !form.timeOfDayTo
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
                    disablePast
                    maxDate={form.durationTo || undefined}
                    InputProps={{
                        endAdornment: <DateRange color={"disabled"} />,
                        error: formIsChecked && !form.durationFrom
                    }}
                    value={form.durationFrom||null}
                    onChange={onChangeDateTime("durationFrom")} />
            </div>
            <div className={classes.divider}>-</div>
            <div className={classes.innerContainer}>
                <DatePicker
                    fullWidth
                    disablePast
                    minDate={form.durationFrom || undefined}
                    InputProps={{
                        endAdornment: <DateRange color={"disabled"} />,
                        error: formIsChecked && !form.durationTo
                    }}
                    value={form.durationTo||null}
                    onChange={onChangeDateTime("durationTo")} />
            </div>
        </div>
        <div className={classes.lastRowContainer}>
            <p className={classes.text}>Product Page</p>
            <Switch
                onChange={handleSwitch}
                checked={form.isProductPageOn}
                color="primary"
            />
            <Button variant="contained" onClick={onOpen} color="primary" disabled={!form.isProductPageOn}>
                Edit Product Page
            </Button>
        </div>

        <HtmlEditor open={isOpen} onSave={(value) => console.log(value)} onClose={onClose} title="Edit Product Page Content"/>
    </DialogContent>
};