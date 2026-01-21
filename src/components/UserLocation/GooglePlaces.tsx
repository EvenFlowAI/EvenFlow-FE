import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useLocationStyles } from '../../hooks/styling/useLocationStyles';

interface GooglePlacesProps {
  // TODO: fix address type here
  // eslint-disable-next-line
  userAddress: any;
  isFormChecked: boolean;
  placeholderLabel: string;
  // TODO: fix address type here
  // eslint-disable-next-line
  handleChangeAddress: (e: any) => void;
}

const GooglePlaces = ({
  userAddress,
  isFormChecked,
  placeholderLabel,
  handleChangeAddress,
}: GooglePlacesProps) => {
  const { classes } = useLocationStyles();

  return (
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
          typeof userAddress === 'string' && userAddress.length
            ? userAddress
            : (userAddress?.label ?? null),
        className:
          typeof userAddress === 'string' && userAddress.length
            ? classes.select
            : !userAddress?.label
              ? isFormChecked
                ? classes.errorSelect
                : classes.emptySelect
              : classes.select,
        onChange: handleChangeAddress,
        placeholder: placeholderLabel,
        isClearable: true,
        isSearchable: true,
        key: userAddress?.label || 'label',
        menuPosition: 'fixed',
      }}
    />
  );
};

export default GooglePlaces;
