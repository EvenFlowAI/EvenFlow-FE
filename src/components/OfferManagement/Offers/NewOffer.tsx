import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {TextField} from "../../UI/TextField";
import {Button, FormControlLabel, MenuItem, Radio, RadioGroup, Select} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {
    customerPresence,
    customerSegments,
    dayOfWeek,
    ECustomerPresence,
    ECustomerSegment,
    EDayOfWeek,
    EOfferType,
    IOffer,
    IOfferForm, IServiceType,
    offerTypes
} from "../../../store/reducers/offers/types";
import {useDispatch, useSelector} from "react-redux";
import {createOffer} from "../../../store/reducers/offers/actions";
import {SC_UNDEFINED, timeSpanString} from "../../../config/constants";
import {makeStyles} from "@material-ui/core/styles";
import {autocompleteOptionsRender, autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete, /*createFilterOptions*/} from "@material-ui/lab";
import {IAssignedServiceRequestShort} from "../../../store/reducers/serviceRequests/types";
import {loadSCRequestsShort} from "../../../store/reducers/serviceRequests/actions";
import {RootState} from "../../../store/rootReducer";
import clsx from "clsx";
import {TEnumMap} from "../../../store/reducers/utils";
import {DatePicker, TimePicker} from "../../UI/DateTimePickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import moment from "moment";
import {DateRange, QueryBuilder} from "@material-ui/icons";

// const filter = createFilterOptions<IServiceType>();

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

type TForm = {
    offerValue?: string;
    offerTitle?: string;
    offerType: EOfferType;
    serviceRequests: IAssignedServiceRequestShort[];
    customerSegments: TEnumMap<ECustomerSegment>[];
    customerPresence: ECustomerPresence;
    dayOfWeek: TEnumMap<EDayOfWeek>[];
    timeOfDayFrom?: moment.Moment;
    timeOfDayTo?: moment.Moment;
    durationFrom?: moment.Moment;
    durationTo?: moment.Moment;
    serviceType?: (IServiceType & {inputValue?: string})[];
}
const clearForm: TForm = {
    offerValue: undefined,
    offerTitle: undefined,
    offerType: EOfferType.AmountOff,
    serviceRequests: [],
    customerSegments: [customerSegments[0]],
    customerPresence: ECustomerPresence.Both,
    dayOfWeek: [dayOfWeek[0]],
}
export const NewOffer:React.FC<DialogProps<IOffer>> = ({onAction, payload, ...props}) => {
    const [form, setForm] = useState<TForm>(clearForm);
    const [isSaving, setSaving] = useState<boolean>(false);

    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    const serviceRequests = useSelector((state: RootState) => state.serviceRequests.scRequestsShort);

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setForm({
                    offerTitle: payload.title,
                    offerValue: String(payload.value),
                    offerType: payload.type,
                    serviceRequests: payload.serviceRequests,
                    customerSegments: payload.customerSegments.map(s => {
                        return customerSegments.find(seg => seg.id === s);
                    }).filter(el => el !== undefined) as TEnumMap<ECustomerSegment>[],
                    customerPresence: payload.customerPresence,
                    dayOfWeek: payload.dayOfWeeks.reduce((acc, el) => {
                        const dof = dayOfWeek.find(e => e.id === el);
                        if (dof) acc.push(dof);
                        return acc;
                    }, [] as TEnumMap<EDayOfWeek>[]),
                    durationFrom: moment(payload.duration.start),
                    durationTo: moment(payload.duration.end)
                })
            } else {
                setForm(clearForm);
            }
        }
    }, [props.open, payload]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadSCRequestsShort(selectedSC.id));
        }
    }, [dispatch, selectedSC]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        setForm({...form, [name]: value})
    }
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setForm({...form, offerType: Number(value) as EOfferType});
    }
    const handleSegmentsSelect = (e: any, value: TEnumMap<ECustomerSegment>[]) => {
        if (form.customerSegments.find(d => d.id === ECustomerSegment.All && value.length > 1)) {
            setForm({...form, customerSegments: value.filter(s => s.id !== ECustomerSegment.All)});
        } else if (value.find(s => s.id === ECustomerSegment.All)) {
            setForm({...form, customerSegments: [customerSegments[0]]});
        } else {
            setForm({...form, customerSegments: value});
        }
    }
    const handleDOWSelect = (e: any, value: TEnumMap<EDayOfWeek>[]) => {
        if (form.dayOfWeek.find(d => d.id === EDayOfWeek.EveryDay) && value.length > 1) {
            setForm({...form, dayOfWeek: value.filter(e => e.id !== EDayOfWeek.EveryDay)});
        } else if (value.find(d => d.id === EDayOfWeek.EveryDay)) {
            setForm({...form, dayOfWeek: [dayOfWeek[0]]});
        } else {
            setForm({...form, dayOfWeek: value});
        }
    }
    const handleChangeDateTime = (name: keyof TForm) => (date: MaterialUiPickersDate) => {
        setForm({...form, [name]: date});
    }

    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                const data: IOfferForm = {
                    title: form.offerTitle || "",
                    value: Number(form.offerValue),
                    serviceCenterId: selectedSC.id,
                    type: form.offerType,
                    customerPresence: form.customerPresence,
                    customerSegments: form.customerSegments.map(s => s.id),
                    dayOfWeeks: form.dayOfWeek.map(d => d.id),
                    duration: {
                        start: form.durationFrom?.toISOString(),
                        end: form.durationTo?.toISOString()
                    },
                    timeOfDay: {
                        start: form.timeOfDayFrom?.format(timeSpanString),
                        end: form.timeOfDayTo?.format(timeSpanString),
                    },
                    isAllServiceRequestsIncluded: false,
                    serviceRequests: form.serviceRequests.map(s => s.id),
                };
                await dispatch(createOffer(data));
                showMessage("Saved");
                setSaving(false);
                props.onClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    const handleSRChange = (e: any, value: IAssignedServiceRequestShort[]) => {
        setForm({...form, serviceRequests: value});
    }

    const handleSelect = ({target: {name, value}}: React.ChangeEvent<{name?: string, value: unknown}>) => {
        if (name) {
            setForm({...form, [name]: value});
        }
    }

    const classes = useStyles();
    return (
        <BaseModal {...props} width={500}>
            <DialogTitle onClose={props.onClose}>Add new Offer</DialogTitle>
            <DialogContent>
                <div className={classes.inputContainer}>
                    <TextField
                        fullWidth
                        label="Offer title"
                        name="offerTitle"
                        id="offerTitle"
                        onChange={handleChange}
                        value={form.offerTitle||""}
                    />
                </div>
                <div className={classes.inputContainer}>
                    <RadioGroup
                        row
                        value={form.offerType}
                        onChange={handleRadio}
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
                <div className={classes.inputContainer}>
                    <TextField
                        style={{width: "50%"}}
                        label="Offer value"
                        onChange={handleChange}
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
                        onChange={handleSRChange}
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
                        onChange={handleSegmentsSelect}
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
                            onChange={handleSelect}
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
                                onChange={handleDOWSelect}
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
                            onChange={handleChangeDateTime("timeOfDayFrom")} />
                    </div>
                    <div className={classes.divider}>-</div>
                    <div className={classes.innerContainer}>
                        <TimePicker
                            fullWidth
                            InputProps={{
                                endAdornment: <QueryBuilder color={"disabled"} />
                            }}
                            value={form.timeOfDayTo||null}
                            onChange={handleChangeDateTime("timeOfDayTo")} />
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
                            onChange={handleChangeDateTime("durationFrom")} />
                    </div>
                    <div className={classes.divider}>-</div>
                    <div className={classes.innerContainer}>
                        <DatePicker
                            fullWidth
                            InputProps={{
                                endAdornment: <DateRange color={"disabled"} />
                            }}
                            value={form.durationTo||null}
                            onChange={handleChangeDateTime("durationTo")} />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <LoadingButton
                    onClick={handleSave}
                    loading={isSaving}
                    variant="contained"
                    color="primary"
                >Save</LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};