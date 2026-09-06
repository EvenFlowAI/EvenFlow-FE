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

type TOptionStyleState = {
  isSelected: boolean;
  isFocused: boolean;
};

const selectStyles = {
  option: (provided: Record<string, unknown>, state: TOptionStyleState) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#EDEDED' : state.isFocused ? '#F5F5F5' : 'white',
    color: '#212121',
    ':active': {
      backgroundColor: '#E0E0E0',
    },
  }),
};

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
        value: typeof userAddress === 'string' ? null : userAddress?.label ? userAddress : null,
        className:
          typeof userAddress === 'string' && userAddress.length
            ? classes.select
            : !userAddress?.label
              ? isFormChecked
                ? classes.errorSelect
                : classes.emptySelect
              : classes.select,
        onChange: handleChangeAddress,
        // openMenuOnFocus: true,
        placeholder: placeholderLabel,
        isClearable: true,
        isSearchable: true,
        menuPosition: 'fixed',
        styles: selectStyles,
      }}
    />
  );
};

export default GooglePlaces;
