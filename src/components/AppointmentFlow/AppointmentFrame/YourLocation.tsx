import React, {useEffect, useMemo, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {Actions} from "./Actions";
import {TActionProps} from "./types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {
    clearAppointmentData,
    loadAncillaryPriceByZip,
    loadFilteredZip,
    setAddress,
    setSideBarSteps,
    setZipCode
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {makeStyles} from "@material-ui/core/styles";
import {
    EAncillaryType,
    EServiceType,
    IAncillaryByZipRequest,
    TAncillaryPriceByZip
} from "../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {styled, Theme} from "@material-ui/core";
import DisplayAncillaryPrice from "../../Modals/DisplayAncillaryPrice/DisplayAncillaryPrice";
import {useCurrentUser, useException, useModal} from "../../../utils/hooks";
import UnavailableService from "../../Modals/InavailableService/UnavailableService";
import {ArrowDownward, KeyboardArrowDown} from "@material-ui/icons";

export const SelectWrapper = styled('div')(({theme}) => ({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "47% 47%",
    justifyContent: 'space-between',
    "& .label": {
        fontWeight: 700,
        margin: '0 0 4px 0',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "100%",
        gap: "20px",
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
                // color: 'rgba(0, 0, 0, 0.87)',
                // opacity: 0.4
            },
        },
    },
    errorSelect: {
        '& > div': {
            borderRadius: 0,
            backgroundColor: '#F7F8FB',
            padding: 2,
            border: "1px solid red",
            '& > div > div': {
                fontSize: '1rem',
                color: '#ff00006b',
                opacity: 1
            }
        },
    }
}))

export interface TStyleProps {
    error: boolean;
}

const useAutocompleteStyles = makeStyles<Theme, TStyleProps>(() => ({
    root: {
        "& input::placeholder": {
            color: props => props.error ? "red" : 'black'
        },
    },
    popupIndicator: {
        marginRight: 8
    },
}))

const YourLocation: React.FC<TYourLocationProps> = ({onBack, onNext, onLogin}) => {
    const [zip, setZip] = useState<string>("");
    const [isFormChecked, setFormChecked] = useState<boolean>(false);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {zipCode: zipCodeValue, address, filteredZipCodes, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {isOpen, onClose, onOpen} = useModal();
    const {isOpen: isUnavailableOpen, onClose: onUnavailableClose, onOpen: onUnavailableOpen} = useModal();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();
    const styleProps:TStyleProps = {error: isFormChecked && !zip};
    const autocompleteClasses = useAutocompleteStyles(styleProps);
    const {t} = useTranslation();
    const currentUser = useCurrentUser();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const placeholder = useMemo(() => serviceTypeOption?.type === EServiceType.PickUpDropOff
        ? t('Enter pick up address')
        : t('Enter your requested location'), [serviceTypeOption])

    useEffect(() => {
        setZip(zipCodeValue ?? "")
    }, [zipCodeValue])

    const clearSelectedData = () => {
        dispatch(setSideBarSteps(serviceType === EServiceType.VisitCenter ? ["serviceNeeds"] : ["location"]));
        dispatch(clearAppointmentData())
    }

    const clearAddress = () => {
        dispatch(setAddress(null));
        dispatch(setZipCode(""));
    }

    const handleChangeAddress = async (e: any) => {
        clearSelectedData();
        // const geoCode = await geocodeByPlaceId(e.value.place_id)
        setFormChecked(false);
        dispatch(setAddress(e));
        // if (e?.label) {
        //     dispatch(setAddress(e));
        // } else {
        //     dispatch(setAddress(null));
        // }
    }
    const handleChangeZip = (e: React.ChangeEvent<{}>, option: string | null) => {
        clearSelectedData();
        setFormChecked(false);
        setZip(option ?? "");
    }

    const handleBack = () => {
        clearAddress();
        clearSelectedData();
        if (!customerLoadedData?.id || currentUser) {
            onLogin();
        } else {
            onBack();
        }
    }

    const onSuccess = (data: TAncillaryPriceByZip) => {
        if (data.feeAmount === 0 && data.feeType === EAncillaryType.Amount) {
            onNext();
        } else {
            onOpen();
        }
    }

    const handleNext = () => {
        setFormChecked(true);
        if (!address) showError('"Address" is required');
        if (!zip?.length) showError('"Zip Code" is required');
        if (address && zip.length && scProfile) {
            dispatch(setZipCode(zip));
            const data: IAncillaryByZipRequest = {
                address: typeof address === 'string' ? address : address.label,
                zipCode: zip,
                serviceCenterId: scProfile?.id,
                serviceTypeOptionId: serviceTypeOption?.id ?? null,
            }
            dispatch(loadAncillaryPriceByZip(data, onSuccess, showError, onUnavailableOpen))
        }
    }

    const onInputChange = (e: React.ChangeEvent<{}>, value: string) => {
        if (scProfile) {
            dispatch(loadFilteredZip({serviceCenterId: scProfile.id, search: value}))
        }
    }

    const getPlaceholderLabel = (): string => {
        if (typeof address === 'string') return address;
        if (address?.label) return address?.label;
        return isFormChecked ? t('Address is required') : placeholder
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
                            addressValue: typeof address === 'string' ? address : address?.label ?? '',
                            className: typeof address === 'string'
                                ? !address && isFormChecked
                                : !address?.label && isFormChecked
                                    ? classes.errorSelect
                                    : classes.select,
                            onChange: handleChangeAddress,
                            onFocus: () => setFormChecked(false),
                            placeholder: getPlaceholderLabel(),
                            isClearable: true,
                            isSearchable: true,
                            defaultInputValue: typeof address === 'string' ? address : address?.label || "",
                            key: address?.label || 'label',
                        }}
                    />
                </div>

                <Autocomplete
                    options={filteredZipCodes}
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
            <Actions onBack={handleBack} onNext={handleNext} nextLabel={t("Next")}/>
            <DisplayAncillaryPrice onNext={onNext} open={isOpen} onClose={onClose}/>
            <UnavailableService open={isUnavailableOpen} onClose={onUnavailableClose} setFormChecked={setFormChecked}/>
        </StepWrapper>
    );
};

export default YourLocation;