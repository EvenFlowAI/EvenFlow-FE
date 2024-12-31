import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {SelectWrapper, useAutocompleteStyles} from "../../features/booking/AppointmentFlow/Screens/YourLocation/styles";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {Autocomplete} from "@mui/material";
import {KeyboardArrowDown} from "@mui/icons-material";
import {autocompleteRender} from "../../utils/autocompleteRenders";
import {EServiceType} from "../../store/reducers/appointmentFrameReducer/types";
import {
    loadFilteredZip,
    setAddress,
    setZipCode
} from "../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {useLocationStyles} from "../../hooks/styling/useLocationStyles";
import {useException} from "../../hooks/useException/useException";

type TProps = {
    zip: string|null;
    setZip: Dispatch<SetStateAction<string|null>>;
    userAddress: any;
    setUserAddress: Dispatch<SetStateAction<any>>;
    loadAncillaryPrice: (zip: string|null, address: any) => void;
    disabled: boolean;
}

const UserLocation: React.FC<TProps> = ({
                                            zip,
                                            setZip,
                                            userAddress,
                                            setUserAddress,
                                            loadAncillaryPrice,
                                            disabled
                                        }) => {
    const {
        serviceTypeOption,
        address,
        zipCode: zipCodeValue,
        filteredZipCodes,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile, customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const [isFormChecked, setFormChecked] = useState<boolean>(false);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const error = isFormChecked && !zip;
    const {classes} = useLocationStyles();
    const { classes: autocompleteClasses } = useAutocompleteStyles({"error": error});
    const showError = useException();

    const placeholderLabel = useMemo(() => {
        if (typeof userAddress === 'string' && userAddress.length) return address;
        if (userAddress?.label) return userAddress?.label;
        return isFormChecked ? t('Address is required') : t('Enter pick up address')
    }, [userAddress, isFormChecked])

    useEffect(() => {
        if (customerLoadedData?.address && !address) {
            dispatch(setAddress(customerLoadedData?.address?.fullAddress  ?? customerLoadedData?.address?.originalFullAddress ?? null))
        }
        if (customerLoadedData?.address?.zipCode && !zipCodeValue) {
            dispatch(setZipCode(customerLoadedData?.address?.zipCode ? customerLoadedData?.address?.zipCode.slice(0, 5) : ''))
        }
    }, [customerLoadedData, address, zipCodeValue])

    const onInputChange = (e: React.ChangeEvent<{}>, value: string, reason: string) => {
        if (scProfile) {
            if (value.length && reason === 'input') {
                setFormChecked(false);
                if (value.length > 5) {
                    showError("ZIP should include 5 digits")
                } else {
                    setZip(value);
                    dispatch(loadFilteredZip({serviceCenterId: scProfile.id, search: value}))
                    if (value.length === 5) {
                        loadAncillaryPrice(value, userAddress);
                    }
                }
            }
        }
    }

    const handleChangeAddress = async (e: any) => {
        setFormChecked(false);
        setUserAddress(e ?? null)
        e?.label && loadAncillaryPrice(zip, e?.label);
    }

    const handleChangeZip = (e: React.ChangeEvent<{}>, option: string | null) => {
        setFormChecked(false);
        if (option?.length === 5) {
            loadAncillaryPrice(option, userAddress);
            setZip(option);
        }
    }

    return (
        <SelectWrapper>
            <div style={{width: '100%'}}>
                <p className="label">{t("Your Address")}</p>
                <GooglePlacesAutocomplete
                    apiKey="AIzaSyCTy-LeuU4m1uoh1nhbUVZBC2G4HDUQQ04"
                    apiOptions={{ language: 'en-GB', region: 'us' }}
                    autocompletionRequest={{
                        componentRestrictions: {
                            country: ['us'],
                        },
                    }}
                    selectProps={{
                        addressValue: typeof userAddress === 'string' && userAddress.length ? userAddress : userAddress?.label ?? null,
                        className: typeof userAddress === 'string' && userAddress.length
                            ? classes.select
                            : !userAddress?.label ?
                                isFormChecked
                                    ? classes.errorSelect
                                    : classes.emptySelect
                                : classes.select,
                        onChange: handleChangeAddress,
                        placeholder: placeholderLabel,
                        isClearable: true,
                        isSearchable: true,
                        key: userAddress?.label || 'label',
                    }}
                />
            </div>

            <Autocomplete
                options={filteredZipCodes}
                freeSolo
                autoSelect
                isOptionEqualToValue={(o, v) => o === v}
                onChange={handleChangeZip}
                fullWidth
                classes={autocompleteClasses}
                autoComplete={true}
                onInputChange={onInputChange}
                disabled={disabled}
                popupIcon={<KeyboardArrowDown htmlColor="#CCCCCC" />}
                renderInput={autocompleteRender({
                    label: t('Your ZIP'),
                    placeholder: isFormChecked && !zip
                        ? t("zip code required")
                        : serviceTypeOption?.type === EServiceType.PickUpDropOff
                            ? t("Enter pick up zip code")
                            : t("Enter your requested zip code"),
                    error: isFormChecked && !zip,
                    required: true,
                    key: zipCodeValue || "zipcode",
                })}
                value={zip ?? ''}
            />
        </SelectWrapper>
    );
};

export default UserLocation;