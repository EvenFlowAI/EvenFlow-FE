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
    IOfferForm,
    offerTypes
} from "../../../store/reducers/offers/types";
import {useDispatch, useSelector} from "react-redux";
import {createOffer} from "../../../store/reducers/offers/actions";
import {SC_UNDEFINED} from "../../../config/constants";
import {makeStyles} from "@material-ui/core/styles";
import {autocompleteOptionsRender, autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {IAssignedServiceRequestShort} from "../../../store/reducers/serviceRequests/types";
import {loadSCRequestsShort} from "../../../store/reducers/serviceRequests/actions";
import {RootState} from "../../../store/rootReducer";
import clsx from "clsx";

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
    customerSegment: ECustomerSegment;
    customerPresence: ECustomerPresence;
    dayOfWeek: EDayOfWeek;
}
const clearForm: TForm = {
    offerValue: undefined,
    offerTitle: undefined,
    offerType: EOfferType.AmountOff,
    serviceRequests: [],
    customerSegment: ECustomerSegment.All,
    customerPresence: ECustomerPresence.Both,
    dayOfWeek: EDayOfWeek.EveryDay,
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
                    serviceRequests: [],
                    customerSegment: payload.customerSegment,
                    customerPresence: payload.customerPresence,
                    dayOfWeek: EDayOfWeek.EveryDay
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
    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            setSaving(true);
            try {
                const data: IOfferForm = {
                    title: form.offerTitle,
                    value: Number(form.offerValue),
                    serviceCenterId: selectedSC.id,
                } as IOfferForm;
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
                    <Select
                        value={form.customerSegment}
                        name={"customerSegment"}
                        fullWidth
                        input={<TextField label="Applicable customer segment" />}
                        onChange={handleSelect}
                    >
                        {customerSegments.map(segment => {
                            return <MenuItem key={segment.id} value={segment.id}>{segment.label}</MenuItem>;
                        })}
                    </Select>
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
                        <Select
                            value={form.dayOfWeek}
                            name={"dayOfWeek"}
                            fullWidth
                            input={<TextField label="Day of a week" />}
                            onChange={handleSelect}
                        >
                            {dayOfWeek.map(pr => {
                                return <MenuItem key={pr.id} value={pr.id}>{pr.label}</MenuItem>;
                            })}
                        </Select>
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