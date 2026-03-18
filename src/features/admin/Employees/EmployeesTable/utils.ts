import { IServiceCenter } from '../../../../store/reducers/serviceCenters/types';
import { IEmployee } from '../../../../store/reducers/employees/types';
import { EDisplayOnBookingType } from '../../../../components/modals/admin/CreateEmployee/types';
import { Roles } from '../../../../types/types';
import { IUserAccount } from '../../../../pages/admin/RoleManagement/types';

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

export const getDisplayData = (el: IUserAccount): string => {
  if (el.dealerships[0].serviceCenters.length === 1) {
    let str = '';
    const sc = el.dealerships[0].serviceCenters[0];

    if (!sc.displayOnBookingTypes?.length && el.role === Roles.Advisor) {
      return 'Not Displayed';
    } else if (!sc.displayOnBookingTypes?.length) {
      str = '-';
    } else {
      if (sc.displayOnBookingTypes.includes(EDisplayOnBookingType.Employee)) {
        str = 'Employee';
      }
      if (sc.displayOnBookingTypes.includes(EDisplayOnBookingType.SelfService)) {
        str = str.length ? str.concat(', Self Service') : 'Self Service';
      }
    }
    return str;
  } else {
    return '-';
  }
};
