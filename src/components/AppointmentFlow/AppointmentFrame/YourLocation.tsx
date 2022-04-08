import React, {useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {SelectWrapper} from "./CarDetails";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {Actions} from "./Actions";
import {TActionProps} from "./types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {Label} from "@material-ui/icons";

type TOption = {
    value: string;
    name: string;
}

type TYourLocationProps = TActionProps & {
    onLogin: () => void
}

const mockAddress = [{value: 'Address1', name: "Address1"}]
const mockState = [{value: 'Address1', name: "Address1"}]
const mockCity = [{value: 'Address1', name: "Address1"}]
const mockZip = [{value: 'Address1', name: "Address1"}]

const YourLocation: React.FC<TYourLocationProps> = ({onBack, onNext, onLogin}) => {
    const [value, setValue] = useState<string|null>(null);
    const [address, setAddress] = useState<TOption | null>(null);
    const [state, setState] = useState<TOption | null>(null);
    const [city, setCity] = useState<TOption | null>(null);
    const [zipCode, setZipCode] = useState<TOption | null>(null);
    const [isFormChecked, setFormChecked] = useState<boolean>(false);
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);

    const handleChangeAddress = (e: React.ChangeEvent<{}>, option: TOption | null) => {
        setFormChecked(false);
        setAddress(option);
    }
    const handleChangeState = (e: React.ChangeEvent<{}>, option: TOption | null) => {
        setFormChecked(false);
        setState(option)
    }
    const handleChangeCity = (e: React.ChangeEvent<{}>, option: TOption | null) => {
        setFormChecked(false);
        setCity(option)
    }
    const handleChangeZip = (e: React.ChangeEvent<{}>, option: TOption | null) => {
        setFormChecked(false);
        setZipCode(option)
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
        if (address && state && city && zipCode) {
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
                            value,
                            onChange: setValue,
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
                        placeholder: isFormChecked && !zipCode ? `ZIP required` : `Your ZIP`,
                        error: isFormChecked && !zipCode,
                        required: true
                    })}
                    value={zipCode || undefined}
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