import { EDisplayOnBookingType } from '../../../../components/modals/admin/CreateEmployee/types';
import { Roles } from '../../../../types/types';
import { IServiceCenter, IUserAccount } from '../../../../pages/admin/RoleManagement/types';

export const getDisplayData = (el: IUserAccount, filterServiceCenterId?: number): string => {
  let sc: IServiceCenter | undefined;

  if (filterServiceCenterId) {
    sc = el.dealerships[0].serviceCenters.find(s => s.id === filterServiceCenterId);
  } else if (el.dealerships[0].serviceCenters.length === 1) {
    sc = el.dealerships[0].serviceCenters[0];
  }

  if (!sc) {
    return '-';
  }

  if (!sc.displayOnBookingTypes?.length && el.role === Roles.Advisor) {
    return 'Not Displayed';
  } else if (!sc.displayOnBookingTypes?.length) {
    return '-';
  } else {
    let str = '';
    if (sc.displayOnBookingTypes.includes(EDisplayOnBookingType.Employee)) {
      str = 'Employee';
    }
    if (sc.displayOnBookingTypes.includes(EDisplayOnBookingType.SelfService)) {
      str = str.length ? str.concat(', Self Service') : 'Self Service';
    }
    return str;
  }
};
