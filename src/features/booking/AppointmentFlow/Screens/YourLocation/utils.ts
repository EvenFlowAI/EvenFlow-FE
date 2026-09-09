import { TParsedAddress } from './types';

type TGeoCodeItem = {
  types?: string[];
  short_name?: string;
  long_name?: string;
};

const findCity = (data: TGeoCodeItem[]): TGeoCodeItem | undefined => {
  return (
    data.find(el => el.types?.includes('locality')) ||
    data.find(el => el.types?.includes('sublocality')) ||
    data.find(el => el.types?.includes('colloquial_area'))
  );
};

const resolveAddressAndCity = ({
  city,
  addressString,
  mainText,
  secondaryText,
}: {
  city?: TGeoCodeItem;
  addressString: string;
  mainText?: string;
  secondaryText?: string;
}): { address: string; cityName: string } => {
  let address = mainText ?? '';
  let cityName = city?.short_name ?? '';

  if (cityName && !addressString.includes(cityName)) {
    cityName = city?.long_name ?? '';
  }

  if (city && secondaryText?.includes(city.long_name ?? '')) {
    let index = addressString.lastIndexOf(city.short_name ?? '');
    if (index <= 0) {
      index = addressString.lastIndexOf(city.long_name ?? '');
    }
    if (index > 0) {
      address = addressString.slice(0, index);
      const commaIndex = address.lastIndexOf(',');
      if (commaIndex) {
        address = address.slice(0, commaIndex);
      }
    }
  } else {
    cityName = secondaryText?.split(',')[0].trim() ?? cityName;
  }

  return { address, cityName };
};

export const parseGeoCode = (
  data: TGeoCodeItem[],
  addressString: string,
  mainText?: string,
  secondaryText?: string
): TParsedAddress => {
  const city = findCity(data);
  const state = data.find(el => el?.types?.includes('administrative_area_level_1'));
  const postalCode = data.find(el => el?.types?.includes('postal_code'));
  const { address, cityName } = resolveAddressAndCity({
    city,
    addressString,
    mainText,
    secondaryText,
  });

  return {
    city: cityName ?? '',
    state: state?.short_name ?? '',
    address: address ?? '',
    postalCode: postalCode?.long_name ?? '',
  };
};
