import React, { useEffect, useMemo, useState } from 'react';
import { StepWrapper } from '../../../../../components/styled/StepWrapper';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';
import { ActionButtons } from '../../../ActionButtons/ActionButtons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import {
  clearAddress,
  clearAppointmentData,
  goToSlotsSelection,
  loadAncillaryPriceByZip,
  loadFilteredZip,
  setAddress,
  setCity,
  setDefaultVisitCenterOption,
  setPoliticalState,
  setServiceTypeOption,
  setShowServiceCentersList,
  setSideBarSteps,
  setStreetName,
  setWelcomeScreenView,
  setZipCode,
} from '../../../../../store/reducers/appointmentFrameReducer/actions';
import {
  EAncillaryType,
  EServiceType,
  IAncillaryByZipRequest,
  TAncillaryPriceByZip,
} from '../../../../../store/reducers/appointmentFrameReducer/types';
import { useTranslation } from 'react-i18next';
import AncillaryPriceModal from '../../../../../components/modals/booking/AncillaryPriceModal/AncillaryPriceModal';
import UnavailableServiceModal from '../../../../../components/modals/booking/UnavailableServiceModal/UnavailableServiceModal';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useHistory, useParams } from 'react-router-dom';
import { setUnavailableServiceOpen } from '../../../../../store/reducers/modals/actions';
import { parseGeoCode } from './utils';
import { useModal } from '../../../../../hooks/useModal/useModal';
import { useException } from '../../../../../hooks/useException/useException';
import { Routes } from '../../../../../routes/constants';
import { SelectWrapper, useAutocompleteStyles } from './styles';
import { useLocationStyles } from '../../../../../hooks/styling/useLocationStyles';
import { TYourLocationProps } from './types';

const YourLocation: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TYourLocationProps>>
> = ({ onBack, onNext, isManagingFlow, restoreAddress }) => {
  const { customerLoadedData, scProfile } = useSelector((state: RootState) => state.appointment);
  const {
    zipCode: zipCodeValue,
    address,
    filteredZipCodes,
    serviceTypeOption,
    appointmentByKey,
    serviceOptionChangedFromSlotPage,
    prevSelectedOption,
    ancillaryPriceLoading,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const [zip, setZip] = useState<string>('');
  const [isFormChecked, setFormChecked] = useState<boolean>(false);

  const { isOpen, onClose, onOpen } = useModal();
  const dispatch = useDispatch();
  const showError = useException();
  const { classes } = useLocationStyles();
  const error = isFormChecked && !zip;
  const { classes: autocompleteClasses } = useAutocompleteStyles({ error: error });
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const serviceType = useMemo(
    () => (serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter),
    [serviceTypeOption]
  );

  const placeholder = useMemo(
    () =>
      serviceTypeOption?.type === EServiceType.PickUpDropOff
        ? t('Enter pick up address')
        : t('Enter your requested location'),
    [serviceTypeOption]
  );

  const isSameServiceTypeOption = useMemo(() => {
    return appointmentByKey?.serviceTypeOption?.id === serviceTypeOption?.id;
  }, [appointmentByKey, serviceTypeOption]);

  const serviceString =
    serviceType === EServiceType.MobileService ? t('Mobile Service') : t('Pick Up / Drop Off');

  useEffect(() => {
    if (!zip && zipCodeValue) {
      setZip(zipCodeValue);
    }
  }, [zipCodeValue]);

  useEffect(() => {
    if (customerLoadedData?.address && !address) {
      dispatch(
        setAddress(
          customerLoadedData?.address?.fullAddress ??
            customerLoadedData?.address?.originalFullAddress ??
            null
        )
      );
    }
    if (customerLoadedData?.address?.zipCode && !zipCodeValue) {
      dispatch(
        setZipCode(
          customerLoadedData?.address?.zipCode
            ? customerLoadedData?.address?.zipCode.slice(0, 5)
            : ''
        )
      );
    }
  }, [customerLoadedData, address, zipCodeValue]);

  const clearSelectedData = () => {
    dispatch(
      setSideBarSteps(serviceType === EServiceType.VisitCenter ? ['serviceNeeds'] : ['location'])
    );
    dispatch(clearAppointmentData());
  };

  const onGetZipCodesList = (list: string[], postalCode: string) => {
    if (list.includes(postalCode)) setZip(postalCode);
  };

  const handleChangeAddress = async (e: any) => {
    if (!serviceOptionChangedFromSlotPage && !isManagingFlow) clearSelectedData();
    setFormChecked(false);
    dispatch(setAddress(e ?? null));
    dispatch(setZipCode(''));
    if (e?.value?.place_id && e?.label) {
      geocodeByPlaceId(e.value.place_id).then(res => {
        const data = parseGeoCode(
          res[0].address_components,
          e.label,
          e.value?.structured_formatting?.main_text,
          e.value?.structured_formatting?.secondary_text
        );
        if (data.city) dispatch(setCity(data.city));
        if (data.state) dispatch(setPoliticalState(data.state));
        if (data.address) dispatch(setStreetName(data.address));
        if (data.postalCode && scProfile) {
          dispatch(
            loadFilteredZip(
              { serviceCenterId: scProfile.id, search: data.postalCode },
              onGetZipCodesList
            )
          );
        }
      });
    }
  };
  const handleChangeZip = (e: React.ChangeEvent<{}>, option: string | null) => {
    if (!serviceOptionChangedFromSlotPage && !isManagingFlow) clearSelectedData();
    setFormChecked(false);
    setZip(option ?? '');
  };

  const setPrevSelectedOption = () => {
    if (prevSelectedOption) {
      dispatch(setServiceTypeOption(prevSelectedOption));
      dispatch(goToSlotsSelection(prevSelectedOption));
    }
  };

  const onGoToSlotsForVisitCenter = () => {
    appointmentByKey && restoreAddress ? restoreAddress() : dispatch(clearAddress());
    setPrevSelectedOption();
  };

  const goToFirstScreen = async () => {
    await dispatch(setShowServiceCentersList(false));
    await dispatch(setWelcomeScreenView('serviceSelect'));
    history.push(Routes.EndUser.Welcome + '/' + id + '?frame=1');
  };

  const handleBack = () => {
    serviceOptionChangedFromSlotPage ? setPrevSelectedOption() : onBack();
  };

  const onSuccess = (data: TAncillaryPriceByZip) => {
    if (data.feeAmount === 0 && data.feeType === EAncillaryType.Amount) {
      onNext();
    } else {
      onOpen();
    }
  };

  const showValidationErrors = () => {
    if (!address) showError('"Address" is required');
    if (!zip?.length) showError('"Zip Code" is required');
  };

  const onUnavailableOpen = () => dispatch(setUnavailableServiceOpen(true));

  const loadAncillaryPrice = () => {
    if (address && zip.length && scProfile) {
      dispatch(setZipCode(zip));
      const data: IAncillaryByZipRequest = {
        address: typeof address === 'string' ? address : address.label,
        zipCode: zip,
        serviceCenterId: scProfile?.id,
        serviceTypeOptionId: serviceTypeOption?.id ?? null,
      };
      dispatch(loadAncillaryPriceByZip(data, onSuccess, showError, onUnavailableOpen));
    }
  };

  const handleNext = () => {
    setFormChecked(true);
    showValidationErrors();
    loadAncillaryPrice();
  };

  const onInputChange = (e: React.ChangeEvent<{}>, value: string) => {
    if (scProfile) {
      if (value.length && filteredZipCodes.includes(value)) {
        if (!serviceOptionChangedFromSlotPage && !isManagingFlow) clearSelectedData();
        setFormChecked(false);
        setZip(value);
      }
      dispatch(loadFilteredZip({ serviceCenterId: scProfile.id, search: value }));
    }
  };

  const getPlaceholderLabel = (): string => {
    if (typeof address === 'string' && address.length) return address;
    if (address?.label) return address?.label;
    return isFormChecked ? t('Address is required') : placeholder;
  };

  const setDefaultVisitCenter = async () => {
    await dispatch(setDefaultVisitCenterOption());
    await dispatch(clearAppointmentData());
    await dispatch(setSideBarSteps([]));
  };

  const restorePrevData = () => {
    if (appointmentByKey?.address)
      dispatch(setAddress(appointmentByKey?.address?.fullAddress ?? null));
    if (appointmentByKey?.address?.zipCode) {
      dispatch(setZipCode(appointmentByKey?.address?.zipCode ?? ''));
    }
  };

  const onBackFromAncillaryModal = () => {
    if (serviceOptionChangedFromSlotPage) {
      onGoToSlotsForVisitCenter();
    } else {
      customerLoadedData?.isUpdating
        ? isSameServiceTypeOption
          ? restorePrevData()
          : onClose()
        : setDefaultVisitCenter();
    }
  };

  return (
    <StepWrapper>
      <SelectWrapper>
        <div style={{ width: '100%' }}>
          <p className="label">{t('Your Address')}</p>
          <GooglePlacesAutocomplete
            apiKey="AIzaSyCTy-LeuU4m1uoh1nhbUVZBC2G4HDUQQ04"
            apiOptions={{ language: 'en-GB', region: 'us' }}
            autocompletionRequest={{
              componentRestrictions: {
                country: ['us'],
              },
            }}
            selectProps={{
              addressValue:
                typeof address === 'string' && address.length ? address : (address?.label ?? null),
              className:
                typeof address === 'string' && address.length
                  ? classes.select
                  : !address?.label
                    ? isFormChecked
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
            placeholder:
              isFormChecked && !zip
                ? t('zip code required')
                : serviceTypeOption?.type === EServiceType.PickUpDropOff
                  ? t('Enter pick up zip code')
                  : t('Enter your requested zip code'),
            error: isFormChecked && !zip,
            required: true,
            key: zipCodeValue || 'zipcode',
          })}
          value={zip}
        />
      </SelectWrapper>
      <ActionButtons
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={t('Next')}
        loading={ancillaryPriceLoading}
      />
      <AncillaryPriceModal
        backButtonText={
          customerLoadedData?.isUpdating && !serviceOptionChangedFromSlotPage
            ? t('Back')
            : t('Visit Center instead')
        }
        onNext={onNext}
        open={isOpen}
        onClose={onClose}
        serviceString={serviceString}
        onBack={onBackFromAncillaryModal}
      />
      <UnavailableServiceModal
        setFormChecked={setFormChecked}
        onBackToServiceOption={goToFirstScreen}
        onBackToSelectSlotsForVisitCenter={onGoToSlotsForVisitCenter}
        onVisitCenter={setDefaultVisitCenter}
      />
    </StepWrapper>
  );
};

export default YourLocation;
