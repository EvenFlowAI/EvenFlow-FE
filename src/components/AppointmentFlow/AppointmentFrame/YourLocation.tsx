import React, {useEffect, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {Actions} from "./Actions";
import {TActionProps} from "./types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
import {
    loadAncillaryPriceByZip,
    loadFilteredZip,
    setAddress,
    setSideBarSteps,
    setZipCode
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {makeStyles} from "@material-ui/core/styles";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import {
    EAncillaryType,
    EServiceType,
    IAncillaryByZipRequest,
    TAncillaryPriceByZip
} from "../../../store/reducers/appointmentFrameReducer/types";
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

const YourLocation: React.FC<TYourLocationProps> = ({onBack, onNext, onLogin}) => {
    const [zip, setZip] = useState<string>("");
    const [isFormChecked, setFormChecked] = useState<boolean>(false);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {zipCode: zipCodeValue, address, serviceType, filteredZipCodes, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isUnavailableOpen, onClose: onUnavailableClose, onOpen: onUnavailableOpen} = useModal();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();
    const {t} = useTranslation();

    useEffect(() => {
        setZip(zipCodeValue ?? "")
    }, [zipCodeValue])

    const clearSelectedData = () => {
        dispatch(setSideBarSteps(serviceType === EServiceType.VisitCenter ? ["serviceNeeds"] : ["location"]));
        dispatch(selectAppointment(null));
    }

    const clearAddress = () => {
        dispatch(setAddress(null));
        dispatch(setZipCode(""));
    }

    const handleChangeAddress = async (e: any) => {
        clearSelectedData();
        console.log(e?.value?.place_id)
        const geoCode = await geocodeByPlaceId(e.value.place_id)
        console.log(geoCode)
        setFormChecked(false);
        if (e?.label) {
            dispatch(setAddress(e));
        } else {
            dispatch(setAddress(null));
        }
    }
    const handleChangeZip = (e: React.ChangeEvent<{}>, option: string | null) => {
        clearSelectedData();
        setFormChecked(false);
        setZip(option ?? "");
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

    const onSuccess = (data: TAncillaryPriceByZip|null|undefined) => {
        if (!data) {
            onUnavailableOpen()
        } else {
            if (data.feeAmount === 0 && data.feeType === EAncillaryType.Amount) {
                onNext();
            } else {
                onOpen();
            }
        }
    }

    const handleNext = () => {
        setFormChecked(true);
        if (!address) return showError('"Address" is required');
        if (!zip?.length) return showError('"Zip Code" is required');
        if (address?.label && zip.length && scProfile) {
            dispatch(setZipCode(zip));
            const data: IAncillaryByZipRequest = {
                address: address.label,
                zipCode: zip,
                serviceCenterId: scProfile?.id,
                serviceTypeOptionId: serviceTypeOption?.id ?? null,
            }
            dispatch(loadAncillaryPriceByZip(data, onSuccess, showError))
        } else {
            showError(t("Please select your Address and Zip code"))
        }
    }

    const onInputChange = (e: React.ChangeEvent<{}>, value: string) => {
        if (scProfile) {
            dispatch(loadFilteredZip({serviceCenterId: scProfile.id, search: value}))
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
                    options={filteredZipCodes}
                    onChange={handleChangeZip}
                    fullWidth
                    autoComplete={true}
                    onInputChange={onInputChange}
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
            <UnavailableService open={isUnavailableOpen} onClose={onUnavailableClose} setFormChecked={setFormChecked}/>
        </StepWrapper>
    );
};

export default YourLocation;