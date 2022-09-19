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
import {setAddress, setSideBarSteps, setZipCode} from "../../../store/reducers/appointmentFrameReducer/actions";
import {makeStyles} from "@material-ui/core/styles";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";

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
    const {zipCode: zipCodeValue, address, serviceType} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation();

    useEffect(() => {
        const selectedZip = mockZip.find(item => item.value === zipCodeValue);
        setZip(selectedZip ?? null);
        setAddressValue(address);
    }, [zipCodeValue, mockZip, address])

    const clearSelectedData = () => {
        dispatch(setSideBarSteps(serviceType === EServiceType.VisitCenter ? ["serviceNeeds"] : ["location"]));
        dispatch(selectAppointment(null));
    }

    const clearAddress = () => {
        dispatch(setAddress(null));
        dispatch(setZipCode(null));
    }

    const handleChangeAddress = async (e: any) => {
        clearSelectedData();
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
        clearSelectedData();
        setFormChecked(false);
        setZip(option);
        option ? dispatch(setZipCode(option?.value)) : dispatch(setZipCode(null));
    }

    const handleBack = () => {
        clearAddress();
        clearSelectedData();
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
                    <p className="label">{t("Your Address")}</p>
                    <GooglePlacesAutocomplete
                        apiKey="AIzaSyCTy-LeuU4m1uoh1nhbUVZBC2G4HDUQQ04"
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
                            placeholder: address?.label ?? t('Start To Type'),
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
                        label: t('Your ZIP'),
                        placeholder: isFormChecked && !zip ? t("ZIP required") : t("Your ZIP"),
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