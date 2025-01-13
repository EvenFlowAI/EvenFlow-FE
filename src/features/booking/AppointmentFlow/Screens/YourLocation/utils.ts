import { TParsedAddress } from './types';

export const parseGeoCode = (
  data: any[],
  addressString: string,
  mainText?: string,
  secondaryText?: string
): TParsedAddress => {
  let city = data.find(el => el.types?.includes('locality'));
  if (!city) city = data.find(el => el.types?.includes('sublocality'));
  if (!city) city = data.find(el => el.types?.includes('colloquial_area'));

  const state = data.find(el => el?.types?.includes('administrative_area_level_1'));
  let address = mainText;
  let cityName = city?.short_name ?? '';

  const postalCode = data.find(el => el?.types?.includes('postal_code'));

  if (cityName && !addressString.includes(cityName)) cityName = city?.long_name ?? '';

  if (city && secondaryText?.includes(city.long_name)) {
    let index = addressString.lastIndexOf(city?.short_name);
    if (index <= 0) index = addressString.lastIndexOf(city?.long_name);
    if (index > 0) {
      address = addressString.slice(0, index);
      const commaIndex = address.lastIndexOf(',');
      if (commaIndex) {
        address = address.slice(0, commaIndex);
      }
    }
  } else {
    cityName = secondaryText?.split(',')[0].trim();
  }

  return {
    city: cityName ?? '',
    state: state?.short_name ?? '',
    address: address ?? '',
    postalCode: postalCode?.long_name ?? '',
  };
};
