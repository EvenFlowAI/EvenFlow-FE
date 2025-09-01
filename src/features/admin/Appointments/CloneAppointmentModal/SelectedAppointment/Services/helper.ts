import {
  EServiceCenterName,
  IAppointmentByKey,
  PackageSourceType,
} from '../../../../../../api/types';
import { IServiceCenterProfile } from '../../../../../../store/reducers/appointment/types';
import i18n from '../../../../../../i18n';
import { EServiceCategoryType } from '../../../../../../store/reducers/categories/types';

export const getServicesForCloning = (
  appointment: IAppointmentByKey | null,
  scProfile: IServiceCenterProfile | undefined
  // packagePriceTitles: TPackagePrice[],
) => {
  const services: string[] = [];
  if (appointment && scProfile) {
    if (appointment.maintenancePackageOption) {
      let name = '';
      if (
        scProfile.serviceCenterFlag === EServiceCenterName.DealerBuilt &&
        scProfile.packageSource === PackageSourceType.eMenu &&
        scProfile?.maintenancePackageOptionTypes?.length
      ) {
        const firstOption = scProfile?.maintenancePackageOptionTypes[0];
        name =
          appointment.maintenancePackageOption.type === firstOption
            ? i18n.t('Factory Package')
            : i18n.t('Dealer Package');
      } else {
        name = `${appointment.maintenancePackageOption.name} ${i18n.t('package')}`;
        // if (packagePriceTitles?.length) {
        //     const price = packagePriceTitles
        //         .find(item => item.type === appointment.maintenancePackageOption?.priceType);
        //     if (price) name = name + ` (${price.title})`;
        // }
      }
      services.push(name);
    }
    if (appointment.serviceRequests) {
      appointment.serviceRequests.forEach(item => item && services.push(item.description));
    }
    if (appointment.serviceCategories) {
      appointment.serviceCategories.forEach(item => {
        if (item.name.includes('Going')) {
          services.push(i18n.t('My Description of Needs'));
        } else {
          if (item.type === EServiceCategoryType.GeneralCategory) services.push(item.name);
        }
      });
    }
    if (appointment.recalls) {
      appointment.recalls.forEach(el => services.push(el));
    }
  }

  return services;
};
