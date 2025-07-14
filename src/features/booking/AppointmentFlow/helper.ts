import { ISR } from '../../../store/reducers/appointment/types';
import { IMaintenanceItem, IRecallByVin } from '../../../types/types';
import { EMaintenanceOptionType, IPackageOptions } from '../../../api/types';
import { EServiceCategoryType, ICategory } from '../../../store/reducers/categories/types';
import {
  IValueService,
  TServiceCategory,
} from '../../../store/reducers/appointmentFrameReducer/types';
import i18n from '../../../i18n';

export const getMaintenanceList = (
  srList: ISR[],
  selectedRecalls: IRecallByVin[],
  selectedSR?: number[],
  selectedPackage?: IPackageOptions | null,
  allCategories?: ICategory[],
  selectedCategories?: TServiceCategory[],
  valueService?: IValueService | null,
  packageEMenuType?: EMaintenanceOptionType | null,
  optionTypes?: EMaintenanceOptionType[] | undefined
) => {
  const services: IMaintenanceItem[] = [];

  if (selectedPackage) {
    services.push({
      name: `${selectedPackage.name} ${i18n.t('package')}`,
      id: selectedPackage.id,
      type: 'package',
    });
  }
  if (selectedSR?.length) {
    const filtered = srList.filter(el => selectedSR.includes(el.id));
    filtered.forEach(
      item =>
        item &&
        services.push({
          id: item.id,
          name: item.description ?? item.code ?? '',
          type: 'service',
        })
    );
  }
  if (selectedCategories && allCategories) {
    const categories = allCategories.filter(
      category =>
        selectedCategories.map(item => item.id).includes(category.id) &&
        category.type === EServiceCategoryType.GeneralCategory
    );
    categories.forEach(item => {
      if (item.type === EServiceCategoryType.GeneralCategory) {
        services.push({
          id: item.id,
          name: item.name,
          type: 'category',
        });
      }
    });
  }
  if (valueService?.selectedService) {
    services.push({
      id: valueService.selectedService.id,
      name: valueService.selectedService.name,
      type: 'valueService',
    });
  }
  if (packageEMenuType !== null && optionTypes?.length) {
    const firstOption = optionTypes[0];
    services.push({
      type: 'package',
      name: `${packageEMenuType === firstOption ? i18n.t('Factory') : i18n.t('Dealer')} Package`,
    });
  }
  if (selectedRecalls.length) {
    selectedRecalls.forEach(item => {
      services.push({
        id: item.serviceRequestId,
        name: item.recallComponent,
        type: 'recall',
        campaignNumber: item.campaignNumber ?? item.oemProgram,
      });
    });
  }
  return services;
};
