import { IServiceCenter } from '../../../../store/reducers/serviceCenters/types';
import { IEmployee } from '../../../../store/reducers/employees/types';
import { EDisplayOnBookingType } from '../../../../components/modals/admin/CreateEmployee/types';

export const getServiceCentersNames = (items: IServiceCenter[] | undefined): string => {
  let string = '';
  if (items?.length) {
    const names = items.map(el => el.name);

    names.forEach((name, index) => {
      string += index < names.length - 1 ? `${name}, ` : name;
    });
  }
  return string;
};

export const getDisplayData = (el: IEmployee): string => {
  let str = '';
  if (!el.displayOnBookingTypes?.length) {
    str = 'Not displayed';
  } else {
    if (el.displayOnBookingTypes.includes(EDisplayOnBookingType.Employee)) {
      str = 'Employee';
    }
    if (el.displayOnBookingTypes.includes(EDisplayOnBookingType.SelfService)) {
      str = str.length ? str.concat(', Self Service') : 'Self Service';
    }
  }
  return str;
};
