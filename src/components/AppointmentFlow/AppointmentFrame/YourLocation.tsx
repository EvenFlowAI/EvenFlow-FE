import React, {useEffect, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {SelectWrapper} from "./CarDetails";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {Actions} from "./Actions";
import {TActionProps} from "./types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
import {setAddress, setZipCode} from "../../../store/reducers/appointmentFrameReducer/actions";
import {makeStyles} from "@material-ui/core/styles";

type TOption = {
    value: string;
    name: string;
}

type TYourLocationProps = TActionProps & {
    onLogin: () => void
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
    }
}))

const mockZip = [{value: '123456', name: "123456"}]

const YourLocation: React.FC<TYourLocationProps> = ({onBack, onNext, onLogin}) => {
    const [addressValue, setAddressValue] = useState<any>(null);
    const [zip, setZip] = useState<TOption | null>(null);
    const [isFormChecked, setFormChecked] = useState<boolean>(false);
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const {zipCode: zipCodeValue, address} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        const selectedZip = mockZip.find(item => item.value === zipCodeValue);
        setZip(selectedZip ?? null);
        setAddressValue(address);
    }, [zipCodeValue, mockZip, address])

    const handleChangeAddress = async (e: any) => {
        console.log(e?.value?.place_id)
        const geoCode = await geocodeByPlaceId(e.value.place_id)
        console.log(geoCode)
        setFormChecked(false);
        if (e?.label) {
            setAddressValue(e);
            dispatch(setAddress(e));
        } else {
            setAddressValue(null);
            dispatch(setAddress(null));
        }
    }
    const handleChangeZip = (e: React.ChangeEvent<{}>, option: TOption | null) => {
        setFormChecked(false);
        setZip(option);
        option ? dispatch(setZipCode(option?.value)) : dispatch(setZipCode(null));
    }

    const clearAddress = () => {
        dispatch(setAddress(null));
        dispatch(setZipCode(null));
    }

    const handleBack = () => {
        clearAddress();
        if (!customerLoadedData?.id) {
            onLogin();
        } else {
            onBack();
        }
    }

    const handleNext = () => {
        setFormChecked(true);
        onNext()
        if (address && zip) {
            // todo checking request

        }
    }

    return (
        <StepWrapper>
            <SelectWrapper>
                <div>
                    <p className="label">Your Address</p>
                    <GooglePlacesAutocomplete
                        apiKey="AIzaSyBV1Ejz4kegeZemo5HVJhNG1qEDtiJWGVk"
                        apiOptions={{ language: 'en', region: 'us' }}
                        autocompletionRequest={{
                            componentRestrictions: {
                                country: ['us'],
                            }
                        }}
                        selectProps={{
                            addressValue: address?.label ?? '',
                            className: classes.select,
                            onChange: handleChangeAddress,
                            placeholder: address?.label ?? 'Start To Type',
                            isClearable: true,
                            isSearchable: true,
                            defaultInputValue: addressValue?.label || "",
                            key: address?.label || 'label'
                        }}
                    />
                </div>

                <Autocomplete
                    options={mockZip}
                    onChange={handleChangeZip}
                    fullWidth
                    autoComplete={true}
                    getOptionLabel={(option) => option.name}
                    renderInput={autocompleteRender({
                        label: 'Your ZIP',
                        placeholder: isFormChecked && !zip ? `ZIP required` : `Your ZIP`,
                        error: isFormChecked && !zip,
                        required: true,
                        key: zipCodeValue || "zipcode",
                    })}
                    value={zip}
                />

            </SelectWrapper>
            <Actions onBack={handleBack} onNext={handleNext} />
        </StepWrapper>
    );
};

export default YourLocation;