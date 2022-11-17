import React, {useEffect, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
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
import {styled} from "@material-ui/core";
import DisplayAncillaryPrice from "../../Modals/DisplayAncillaryPrice/DisplayAncillaryPrice";
import {useException, useModal} from "../../../utils/hooks";
import UnavailableService from "../../Modals/InavailableService/UnavailableService";

export const SelectWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "100%",
    "& .label": {
        fontWeight: 700,
        margin: '0 0 4px 0',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));

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

const mockZip = [{value: '123456', name: "123456"}, {value: '57865', name: "57865"}, {value: '40065', name: "40065"}]

const YourLocation: React.FC<TYourLocationProps> = ({onBack, onNext, onLogin}) => {
    const [addressValue, setAddressValue] = useState<any>(null);
    const [zip, setZip] = useState<TOption | null>(null);
    const [isFormChecked, setFormChecked] = useState<boolean>(false);
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const {zipCode: zipCodeValue, address, serviceType} = useSelector((state: RootState) => state.appointmentFrame);
    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isUnavailableOpen, onClose: onUnavailableClose, onOpen: onUnavailableOpen} = useModal();
    const dispatch = useDispatch();
    const showError = useException();
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

    const onSuccess = () => {
        onOpen();
    }

    const onError = () => {
        onUnavailableOpen()
    }

    const handleNext = () => {
        setFormChecked(true);
        if (!address) return showError('"Address" is required');
        if (!zip) return showError('"Zip Code" is required');
        if (address && zip) {
            // todo request
            onSuccess()
        } else {
            onError()
        }
    }

    return (
        <StepWrapper>
            <SelectWrapper>
                <div style={{width: '100%'}}>
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
                            defaultInputValue: address?.label || "",
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
            <DisplayAncillaryPrice onNext={onNext} open={isOpen} onClose={onClose}/>
            <UnavailableService open={isUnavailableOpen} onClose={onUnavailableClose}/>
        </StepWrapper>
    );
};

export default YourLocation;