import { ISR } from '../store/reducers/appointment/types';
import { IRecallByVin } from '../types/types';
import { TPackagePrice } from '../store/reducers/packages/types';
import { EMaintenanceOptionType, IPackageOptions } from '../api/types';
import { EServiceCategoryType, ICategory } from '../store/reducers/categories/types';
import {
  EPackagePricingType,
  IValueService,
  TServiceCategory,
} from '../store/reducers/appointmentFrameReducer/types';
import i18n from '../i18n';

export const getMaintenanceDescription = (
  srList: ISR[],
  selectedRecalls: IRecallByVin[],
  packagePriceTitles: TPackagePrice[],
  selectedSR?: number[],
  selectedPackage?: IPackageOptions | null,
  allCategories?: ICategory[],
  selectedCategories?: TServiceCategory[],
  valueService?: IValueService | null,
  packagePricingType?: EPackagePricingType | null,
  packageEMenuType?: EMaintenanceOptionType | null,
  optionTypes?: EMaintenanceOptionType[] | undefined
) => {
  const services: string[] = [];

  if (selectedPackage) {
    let name = `${selectedPackage.name} ${i18n.t('package')}`;
    if (packagePriceTitles?.length) {
      const price = packagePriceTitles.find(item => item.type === packagePricingType);
      if (price) name = name + ` (${price.title})`;
    }
    services.push(name);
  } else {
    if (packageEMenuType !== null && optionTypes?.length) {
      const firstOption = optionTypes[0];
      const name =
        packageEMenuType === firstOption ? i18n.t('Factory Package') : i18n.t('Dealer Package');
      services.push(i18n.t(name));
    }
  }

  if (selectedSR?.length) {
    const filtered = srList.filter(el => selectedSR.includes(el.id)).map(el => el.description);
    filtered.forEach(item => item && services.push(item));
  }

  services.push(...collectServiceNamesFromCategories(allCategories, selectedCategories));

  if (valueService?.selectedService?.name) services.push(valueService.selectedService.name);
  selectedRecalls.forEach(el => services.push(el.recallComponent));
  return services;
};

const collectServiceNamesFromCategories = (
  allCategories?: ICategory[],
  selectedCategories?: TServiceCategory[]
) => {
  const localServices: string[] = [];
  if (selectedCategories && allCategories) {
    const categories = allCategories.filter(category =>
      selectedCategories.map(item => item.id).includes(category.id)
    );

    categories.forEach(item => {
      if (item.name.includes('Going')) {
        localServices.push(i18n.t('My Description of Needs'));
      } else {
        if (item.type === EServiceCategoryType.GeneralCategory) localServices.push(item.name);
      }
    });
  }
  return localServices;
};
