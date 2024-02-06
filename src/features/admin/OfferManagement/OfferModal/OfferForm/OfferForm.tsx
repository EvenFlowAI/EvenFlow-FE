import React, {useMemo} from 'react';
import {TextField} from "../../../../../components/formControls/TextFieldStyled/TextField";
import {
    Button,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Switch
} from "@mui/material";
import {
    customerPresence,
    customerSegments,
    dayOfWeek, ECustomerPresence,
    ECustomerSegment,
    EDayOfWeek,
    EOfferType,
    offerTypes
} from "../../../../../store/reducers/offers/types";
import { Autocomplete } from '@mui/material';
import {autocompleteOptionsRender, autocompleteRender} from "../../../../../utils/autocompleteRenders";
import clsx from "clsx";
import {DateRange, QueryBuilder} from "@mui/icons-material";
import {DialogContent} from "../../../../../components/modals/BaseModal/BaseModal";
import {selectAllSR, TOfferForm} from "../../types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {IAssignedServiceRequestShort} from "../../../../../store/reducers/serviceRequests/types";
import {EServiceCategoryType, ICategory} from "../../../../../store/reducers/categories/types";
import HtmlEditor from "../../../../../components/modals/admin/HTMLEditor/HTMLEditor";
import {useStyles} from "./styles";
import {useModal} from "../../../../../hooks/useModal/useModal";
import {TEnumMap} from "../../../../../store/reducers/types";
import ClockTimePicker from "../../../../../components/pickers/ClockTimePicker/ClockTimePicker";
import {useDatePickerStyles} from "../../../../../hooks/styling/useDatePickerStyles";
import {TParsableDate} from "../../../../../types/types";
import {CustomDatePicker} from "../../../../../components/pickers/CustomDatePicker/CustomDatePicker";

type TProps = {
    form: TOfferForm;
    onSelect: (e: SelectChangeEvent<ECustomerPresence>) => void;
    onValueChange: (name: keyof TOfferForm, value: unknown) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRadio: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    onChangeDateTime: (name: keyof TOfferForm) => (date: TParsableDate) => void;
    onDOWSelect: (e: any, value: TEnumMap<EDayOfWeek>[]) => void;
    onSegmentSelect: (e: any, value: TEnumMap<ECustomerSegment>[]) => void;
    onSRChange: (e: any, value: IAssignedServiceRequestShort[]) => void;
    onCategoryChange: (e: any, value: ICategory[]) => void;
    formIsChecked: boolean;
}

export const OfferForm: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
    form,
    onSelect,
    onChange,
    onRadio,
    onChangeDateTime,
    onDOWSelect,
    onValueChange,
    onSegmentSelect,
    onCategoryChange,
    onSRChange,
    formIsChecked,
}) => {
    const serviceRequests = useSelector((state: RootState) => state.serviceRequests.scRequestsShort);
    const {allCategories} = useSelector((state: RootState) => state.categories);
    const srWithAll: IAssignedServiceRequestShort[] = useMemo(() => {
        return [selectAllSR, ...serviceRequests];
    }, [serviceRequests]);
    const {isOpen, onOpen, onClose} = useModal();
    const { classes  } = useStyles();
    const { classes: pickerClasses } = useDatePickerStyles();

    const handleSwitch = (e: any, value: boolean) => {
        onValueChange('isProductPageOn', value);
    }

    return (
        <DialogContent>
            {/*<MuiXDatePicker/>*/}
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
                </div> :
                <div className={classes.inputContainer}>
                    <TextField
                        style={{width: "50%"}}
                        label="Offer value"
                        onChange={onChange}
                        name="offerValue"
                        startAdornment={
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
                    isOptionEqualToValue={(option, value) => {
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
                    options={allCategories.filter(category => category.type === EServiceCategoryType.GeneralCategory)}
                    multiple
                    ChipProps={{
                        color: "primary",
                        style: {borderRadius: 4},
                        size: "small"
                    }}
                    disableCloseOnSelect
                    onChange={onCategoryChange}
                    getOptionLabel={i => i.name}
                    isOptionEqualToValue={(option, value) => {
                        return option.id === value.id;
                    }}
                    renderOption={autocompleteOptionsRender((e) => e.name)}
                    loading={false}
                    value={form.serviceCategories}
                    renderInput={autocompleteRender({label: "Service categories included", fullWidth: true})}
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
                    isOptionEqualToValue={(o, v) => o.label === v.label}
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
                            isOptionEqualToValue={(o, v) => o.label === v.label}
                            getOptionLabel={i => i.label}
                            renderOption={autocompleteOptionsRender((e) => e.label)}
                            loading={false}
                            value={form.dayOfWeek}
                            renderInput={autocompleteRender({
                                label: "Day of Week",
                                fullWidth: true,
                                error: formIsChecked && !form.dayOfWeek.length
                            })}
                        />
                    </div>
                </div>
            </div>
            <div className={clsx(classes.inputContainer, classes.rowContainer)}>
                <div className={classes.innerContainer}>
                    <ClockTimePicker
                        fullWidth
                        label={"Time of Day"}
                        InputProps={{
                            endAdornment: <QueryBuilder color={"disabled"} cursor="pointer"/>,
                            error: formIsChecked && !form.timeOfDayFrom
                        }}
                        value={form.timeOfDayFrom ?? null}
                        onChange={onChangeDateTime("timeOfDayFrom")} />
                </div>
                <div className={classes.divider}>-</div>
                <div className={classes.innerContainer}>
                    <ClockTimePicker
                        fullWidth
                        InputProps={{
                            endAdornment: <QueryBuilder color={"disabled"} cursor="pointer"/>,
                            error: formIsChecked && !form.timeOfDayTo
                        }}
                        value={form.timeOfDayTo ?? null}
                        onChange={onChangeDateTime("timeOfDayTo")} />
                </div>
            </div>
            <div className={clsx(classes.inputContainer, classes.rowContainer)}>
                <div className={classes.innerContainer}>
                    <InputLabel shrink className={pickerClasses.label}>Start Date</InputLabel>
                    <CustomDatePicker
                        fullWidth
                        value={form.durationFrom||null}
                        onChange={onChangeDateTime("durationFrom")}
                        format="MMMM, DD"
                        maxDate={form.durationTo || undefined}
                        InputProps={{
                            endAdornment: <DateRange color={"disabled"} cursor="pointer"/>,
                            error: formIsChecked && !form.durationFrom
                        }}
                    />
                </div>
                <div className={classes.divider}>-</div>
                <div className={classes.innerContainer}>
                    <InputLabel shrink className={pickerClasses.label}>End Date</InputLabel>
                    <CustomDatePicker
                        fullWidth
                        value={form.durationTo||null}
                        onChange={onChangeDateTime("durationTo")}
                        format="MMMM, DD"
                        disablePast
                        minDate={form.durationFrom || undefined}
                        InputProps={{
                            endAdornment: <DateRange color={"disabled"} cursor="pointer"/>,
                            error: formIsChecked && !form.durationTo
                        }}
                    />
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
    );
};