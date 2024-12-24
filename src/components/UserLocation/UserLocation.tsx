import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {SelectWrapper, useAutocompleteStyles} from "../../features/booking/AppointmentFlow/Screens/YourLocation/styles";
import GooglePlacesAutocomplete, {geocodeByPlaceId} from "react-google-places-autocomplete";
import {Autocomplete} from "@mui/material";
import {KeyboardArrowDown} from "@mui/icons-material";
import {autocompleteRender} from "../../utils/autocompleteRenders";
import {EServiceType} from "../../store/reducers/appointmentFrameReducer/types";
import {
    loadFilteredZip,
    setAddress,
    setZipCode
} from "../../store/reducers/appointmentFrameReducer/actions";
import {parseGeoCode} from "../../features/booking/AppointmentFlow/Screens/YourLocation/utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {useLocationStyles} from "../../hooks/styling/useLocationStyles";

type TProps = {
    zip: string;
    setZip: Dispatch<SetStateAction<string>>;
    userAddress: any;
    setUserAddress: Dispatch<SetStateAction<any>>;
}

const UserLocation: React.FC<TProps> = ({
                                            zip, setZip, userAddress, setUserAddress
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

    const placeholder = useMemo(() => serviceTypeOption?.type === EServiceType.PickUpDropOff
        ? t('Enter pick up address')
        : t('Enter your requested location'), [serviceTypeOption])

    useEffect(() => {
        if (!zip && zipCodeValue) {
            setZip(zipCodeValue)
        }
        if (!userAddress && address) {
            setUserAddress(address)
        }
    }, [zipCodeValue, address])

    useEffect(() => {
        if (customerLoadedData?.address && !address) {
            dispatch(setAddress(customerLoadedData?.address?.fullAddress  ?? customerLoadedData?.address?.originalFullAddress ?? null))
        }
        if (customerLoadedData?.address?.zipCode && !zipCodeValue) {
            dispatch(setZipCode(customerLoadedData?.address?.zipCode ? customerLoadedData?.address?.zipCode.slice(0, 5) : ''))
        }
    }, [customerLoadedData, address, zipCodeValue])

    const onGetZipCodesList = (list: string[], postalCode: string) => {
        if (list.includes(postalCode)) setZip(postalCode)
    }

    const onInputChange = (e: React.ChangeEvent<{}>, value: string) => {
        if (scProfile) {
            if (value.length && filteredZipCodes.includes(value)) {
                setFormChecked(false);
                setZip(value);
            }
            dispatch(loadFilteredZip({serviceCenterId: scProfile.id, search: value}))
        }
    }

    const handleChangeAddress = async (e: any) => {
        setFormChecked(false);
        setUserAddress(e ?? null)
        setZip('');
        if (e?.value?.place_id && e?.label) {
            geocodeByPlaceId(e.value.place_id).then(res => {
                const data = parseGeoCode(res[0].address_components, e.label, e.value?.structured_formatting?.main_text, e.value?.structured_formatting?.secondary_text)
                if (data.postalCode && scProfile) {
                    dispatch(loadFilteredZip({serviceCenterId: scProfile.id, search: data.postalCode}, onGetZipCodesList))
                }
            })
        }
    }

    const handleChangeZip = (e: React.ChangeEvent<{}>, option: string | null) => {
        setFormChecked(false);
        setZip(option ?? "");
    }

    const getPlaceholderLabel = (): string => {
        if (typeof address === 'string' && address.length) return address;
        if (address?.label) return address?.label;
        return isFormChecked ? t('Address is required') : placeholder
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
                        addressValue: typeof address === 'string' && address.length ? address : address?.label ?? null,
                        className: typeof address === 'string' && address.length
                            ? classes.select
                            : !address?.label ?
                                isFormChecked
                                    ? classes.errorSelect
                                    : classes.emptySelect
                                : classes.select,
                        onChange: handleChangeAddress,
                        placeholder: getPlaceholderLabel(),
                        isClearable: true,
                        isSearchable: true,
                        key: address?.label || 'label',
                    }}
                />
            </div>

            <Autocomplete
                options={filteredZipCodes}
                freeSolo
                isOptionEqualToValue={(o, v) => o === v}
                onChange={handleChangeZip}
                fullWidth
                classes={autocompleteClasses}
                autoComplete={true}
                onInputChange={onInputChange}
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
                value={zip}
            />
        </SelectWrapper>
    );
};

export default UserLocation;