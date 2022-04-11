import React, {useEffect, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {SelectWrapper} from "./CarDetails";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {Actions} from "./Actions";
import {TActionProps} from "./types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
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

// const mockAddress = [{value: 'Address1', name: "Address1"}]
// const mockState = [{value: 'Address1', name: "Address1"}]
// const mockCity = [{value: 'Address1', name: "Address1"}]
const mockZip = [{value: '123456', name: "123456"}]

const YourLocation: React.FC<TYourLocationProps> = ({onBack, onNext, onLogin}) => {
    const [addressValue, setAddressValue] = useState<string|null>(null);
    const [state, setState] = useState<TOption | null>(null);
    const [city, setCity] = useState<TOption | null>(null);
    const [zip, setZip] = useState<TOption | null>(null);
    const [isFormChecked, setFormChecked] = useState<boolean>(false);
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const {zipCode: zipCodeValue, address} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (zipCodeValue) {
            const selectedZip = mockZip.find(item => item.value === zipCodeValue);
            selectedZip && setZip(selectedZip)
        }
    }, [zipCodeValue, mockZip])

    useEffect(() => {
        if (address) {
          setAddressValue(address)
        }
    }, [address])

    const handleChangeAddress = (e: any, option: string | null) => {
        setFormChecked(false);
        setAddressValue(e.label);
        dispatch(setAddress(e.label));
    }
    // const handleChangeState = (e: React.ChangeEvent<{}>, option: TOption | null) => {
    //     setFormChecked(false);
    //     setState(option)
    // }
    // const handleChangeCity = (e: React.ChangeEvent<{}>, option: TOption | null) => {
    //     setFormChecked(false);
    //     setCity(option)
    // }
    const handleChangeZip = (e: React.ChangeEvent<{}>, option: TOption | null) => {
        setFormChecked(false);
        setZip(option);
        option ? dispatch(setZipCode(option?.value)) : dispatch(setZipCode(null));
    }

    const handleBack = () => {
        if (!customerLoadedData?.id) {
            onLogin();
        } else {
            onBack();
        }
    }

    const handleNext = () => {
        setFormChecked(true);
        onNext()
        if (address && state && city && zip) {
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
                            addressValue,
                            className: classes.select,
                            onChange: handleChangeAddress,
                            placeholder: 'Start To Type'
                        }}
                    />
                </div>
                {/*<Autocomplete*/}
                {/*    key="state"*/}
                {/*    options={mockState}*/}
                {/*    onChange={handleChangeState}*/}
                {/*    fullWidth*/}
                {/*    autoComplete={true}*/}
                {/*    getOptionLabel={(option) => option.name}*/}
                {/*    renderInput={autocompleteRender({*/}
                {/*        label: 'Your State',*/}
                {/*        placeholder: isFormChecked && !state ? `State required` : `Your State`,*/}
                {/*        error: isFormChecked && !state,*/}
                {/*        required: true*/}
                {/*    })}*/}
                {/*    value={state || undefined}*/}
                {/*/>*/}
                {/*<Autocomplete*/}
                {/*    key="city"*/}
                {/*    options={mockCity}*/}
                {/*    onChange={handleChangeCity}*/}
                {/*    fullWidth*/}
                {/*    getOptionLabel={(option) => option.name}*/}
                {/*    autoComplete={true}*/}
                {/*    renderInput={autocompleteRender({*/}
                {/*        label: 'Your City',*/}
                {/*        placeholder: isFormChecked && !city ? `City required` : `Your City`,*/}
                {/*        error: isFormChecked && !city,*/}
                {/*        required: true*/}
                {/*    })}*/}
                {/*    value={city || undefined}*/}
                {/*/>*/}
                <Autocomplete
                    key="code"
                    options={mockZip}
                    onChange={handleChangeZip}
                    fullWidth
                    autoComplete={true}
                    getOptionLabel={(option) => option.name}
                    renderInput={autocompleteRender({
                        label: 'Your ZIP',
                        placeholder: isFormChecked && !zip ? `ZIP required` : `Your ZIP`,
                        error: isFormChecked && !zip,
                        required: true
                    })}
                    value={zip || undefined}
                />
                {/*<Autocomplete*/}
                {/*    key="address"*/}
                {/*    options={mockAddress}*/}
                {/*    onChange={handleChangeAddress}*/}
                {/*    fullWidth*/}
                {/*    autoComplete={true}*/}
                {/*    getOptionLabel={(option) => option.name}*/}
                {/*    renderInput={autocompleteRender({*/}
                {/*        label: 'Your Address',*/}
                {/*        placeholder: isFormChecked && !address ? `Address required` : `Your Address`,*/}
                {/*        error: isFormChecked && !address,*/}
                {/*        required: true*/}
                {/*    })}*/}
                {/*    value={address || undefined}*/}
                {/*/>*/}
            </SelectWrapper>
            <Actions onBack={handleBack} onNext={handleNext} />
        </StepWrapper>
    );
};

export default YourLocation;