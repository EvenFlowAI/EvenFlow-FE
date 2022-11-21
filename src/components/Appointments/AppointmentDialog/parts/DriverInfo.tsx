import React, {Dispatch, SetStateAction} from 'react';
import {Grid} from "@material-ui/core";
import {TextField} from "../../../UI/TextField";
import {TForm} from "../AppointmentDialog";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../UI/AutocompleteRender";
import {loadFilteredZip} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {makeStyles} from "@material-ui/core/styles";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";

type TServiceTypeOption = {
    value: number;
    name: string;
}
type TDriverInfoProps = {
    form: TForm;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    errors: string[];
    serviceType: TServiceTypeOption|null;
    address: any;
    zipCode: string;
    setAddress: Dispatch<SetStateAction<any>>;
    setZipCode: Dispatch<SetStateAction<string>>;
    otherServiceTypesAvailable: boolean;
}

const useStyles = makeStyles(() => ({
    select: {
        '& > div': {
            borderRadius: 0,
            backgroundColor: '#F7F8FB',
            padding: 2,
            border: "1px solid #DADADA",
            '& > div > div': {
                fontSize: '1rem',
            }
        }
    },
    label: {
        fontWeight: 700,
        margin: '0 0 4px 0',
        textTransform: 'uppercase',
        fontSize: 12,
    }
}))

const DriverInfo: React.FC<TDriverInfoProps> = ({
                                                    handleChange,
                                                    form,
                                                    errors,
                                                    serviceType,
                                                    address,
                                                    setAddress,
                                                    zipCode,
                                                    setZipCode,
                                                    otherServiceTypesAvailable}) => {
    const {selectedSC} = useSCs();
    const {filteredZipCodes} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleChangeZip =  (e: React.ChangeEvent<{}>, option: string | null) => {
        setZipCode(option ?? "")
    }

    const handleChangeAddress = async (e: any) => {
       setAddress(e);
    }

    const onInputChange = (e: React.ChangeEvent<{}>, value: string) => {
        if (selectedSC) {
            dispatch(loadFilteredZip({serviceCenterId: selectedSC.id, search: value}))
        }
    }

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <h3>Driver info</h3>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Driver name"
                    id="driverName"
                    name="driverName"
                    fullWidth
                    placeholder="Enter Driver Name"
                    onChange={handleChange}
                    value={form.driverName}
                    error={errors.includes("driverName")}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Driver email"
                    value={form.driverEmail}
                    id="driverEmail"
                    placeholder="Enter Driver Email"
                    name="driverEmail"
                    onChange={handleChange}
                    error={errors.includes("driverEmail")}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Phone number"
                    value={form.driverPhoneNumber}
                    id="driverPhoneNumber"
                    placeholder="Enter Driver Phone Number"
                    name="driverPhoneNumber"
                    error={errors.includes("driverPhoneNumber")}
                    onChange={handleChange}
                    fullWidth
                />
            </Grid>
            { serviceType?.value !== EServiceType.VisitCenter && otherServiceTypesAvailable
                ? <React.Fragment>
                    <Grid item xs={12} sm={8}>
                        <p className={classes.label}>Driver Address</p>
                        <GooglePlacesAutocomplete
                            apiKey="AIzaSyCTy-LeuU4m1uoh1nhbUVZBC2G4HDUQQ04"
                            apiOptions={{language: 'en', region: 'us'}}
                            autocompletionRequest={{
                                componentRestrictions: {
                                    country: ['us'],
                                }
                            }}
                            selectProps={{
                                addressValue: address?.label ?? '',
                                className: classes.select,
                                onChange: handleChangeAddress,
                                placeholder: address?.label ?? "Start To Type",
                                isClearable: true,
                                isSearchable: true,
                                defaultInputValue: address?.label || "",
                                key: address?.label || 'label',
                                error: errors.includes("address")
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            options={filteredZipCodes}
                            onChange={handleChangeZip}
                            fullWidth
                            autoComplete={true}
                            onInputChange={onInputChange}
                            renderInput={autocompleteRender({
                                label: 'Driver ZIP',
                                placeholder: "Driver ZIP",
                                key: zipCode || "zipcode",
                                error: errors.includes("zipCode"),
                                required: true,
                            })}
                            value={zipCode}
                        />
                    </Grid>
                </React.Fragment>
            : null}
        </React.Fragment>
    );
};

export default DriverInfo;