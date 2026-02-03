import React from 'react';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { useStyles } from '../styles';
import { parseGeoCode } from '../../../booking/AppointmentFlow/Screens/YourLocation/utils';
import { TFormTekion, TFormXTime } from '../types';

interface AddressFieldsProps {
  formTekion?: TFormTekion;
  formXTime?: TFormXTime;
  setFormTekion?: React.Dispatch<React.SetStateAction<TFormTekion>>;
  setFormXTime?: React.Dispatch<React.SetStateAction<TFormXTime>>;
  setIsFormChecked: React.Dispatch<React.SetStateAction<boolean>>;
  isFormChecked: boolean;
}

const AddressFields = ({
  formTekion,
  formXTime,
  setFormXTime,
  setFormTekion,
  isFormChecked,
  setIsFormChecked,
}: AddressFieldsProps) => {
  const form = formTekion || formXTime;
  const { classes } = useStyles();

  if (!form) return null;

  const getPlaceholderLabel = (): string => {
    if (typeof form.pickUpAddress === 'string' && form.pickUpAddress.length)
      return form.pickUpAddress;
    return isFormChecked ? 'Address is required' : 'Enter pick up';
  };

  const getPlaceholderLabelForDropOff = (): string => {
    if (typeof form.dropOffAddress === 'string' && form.dropOffAddress.length)
      return form.dropOffAddress;
    return isFormChecked ? 'Address is required' : 'Enter drop off';
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeAddress = (e: any) => {
    setIsFormChecked(false);
    if (e?.value?.place_id && e?.label) {
      geocodeByPlaceId(e.value.place_id).then(res => {
        const data = parseGeoCode(
          res[0].address_components,
          e.label,
          e.value?.structured_formatting?.main_text,
          e.value?.structured_formatting?.secondary_text
        );
        if (setFormTekion) {
          setFormTekion(prev => ({ ...prev, pickUpAddress: data }));
        }
        if (setFormXTime) {
          setFormXTime(prev => ({ ...prev, pickUpAddress: data }));
        }
      });
    } else {
      if (setFormTekion) {
        setFormTekion(prev => ({ ...prev, pickUpAddress: null }));
      }
      if (setFormXTime) {
        setFormXTime(prev => ({ ...prev, pickUpAddress: null }));
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeAddressForDropOff = (e: any) => {
    setIsFormChecked(false);
    if (e?.value?.place_id && e?.label) {
      geocodeByPlaceId(e.value.place_id).then(res => {
        const data = parseGeoCode(
          res[0].address_components,
          e.label,
          e.value?.structured_formatting?.main_text,
          e.value?.structured_formatting?.secondary_text
        );
        if (setFormTekion) {
          setFormTekion(prev => ({ ...prev, dropOffAddress: data }));
        }
        if (setFormXTime) {
          setFormXTime(prev => ({ ...prev, dropOffAddress: data }));
        }
      });
    } else {
      if (setFormTekion) {
        setFormTekion(prev => ({ ...prev, dropOffAddress: null }));
      }
      if (setFormXTime) {
        setFormXTime(prev => ({ ...prev, dropOffAddress: null }));
      }
    }
  };

  return (
    <>
      <>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(0, 0, 0, 0.87)',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 600,
            }}
          >
            Pick Up Address *
          </p>
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
                typeof form.pickUpAddress === 'string' && form.pickUpAddress.length
                  ? form.pickUpAddress
                  : '',
              className:
                typeof form.pickUpAddress === 'string' && form.pickUpAddress.length
                  ? classes.select
                  : !form.pickUpAddress
                    ? isFormChecked
                      ? classes.errorSelect
                      : classes.emptySelect
                    : classes.select,
              onChange: handleChangeAddress,
              placeholder: getPlaceholderLabel(),
              isClearable: true,
              isSearchable: true,
            }}
          />
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(0, 0, 0, 0.87)',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 600,
            }}
          >
            Drop Off Address *
          </p>
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
                typeof form.dropOffAddress === 'string' && form.dropOffAddress.length
                  ? form.dropOffAddress
                  : '',
              className:
                typeof form.dropOffAddress === 'string' && form.dropOffAddress.length
                  ? classes.select
                  : !form.dropOffAddress
                    ? isFormChecked
                      ? classes.errorSelect
                      : classes.emptySelect
                    : classes.select,
              onChange: handleChangeAddressForDropOff,
              placeholder: getPlaceholderLabelForDropOff(),
              isClearable: true,
              isSearchable: true,
            }}
          />
        </div>
      </>
    </>
  );
};

export default AddressFields;
