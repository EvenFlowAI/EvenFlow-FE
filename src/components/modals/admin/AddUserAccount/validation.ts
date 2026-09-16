import { TRole } from '../../../../store/reducers/users/types';
import { Roles } from '../../../../types/types';
import { checkEmail } from '../../../../utils/utils';
import { TUserAccountForm } from './types';

const ROLES_WITHOUT_SC_CONFIGURATION: TRole[] = [
  Roles.EvenFlowAccountManager,
  Roles.Vendor,
  Roles.AIBookingAgent,
];

/** Service center configuration block is shown only for these roles. */
export const isScConfigurationVisible = (role: TRole | null): boolean =>
  Boolean(role) && !ROLES_WITHOUT_SC_CONFIGURATION.includes(role as TRole);

/**
 * Validates every field marked with `*` in the Add/Edit User Account form.
 * Used to keep the Save button disabled until all required fields are filled.
 */
export const isUserAccountFormValid = (form: TUserAccountForm, isAdding: boolean): boolean => {
  if (!form.firstName?.trim()) return false;
  if (!form.lastName?.trim()) return false;
  if (!form.email?.trim() || !checkEmail(form.email)) return false;
  if (!form.role) return false;

  // "Dealership group *" and "Service center *" are required only on creation
  if (isAdding) {
    if (!form.dealerships?.length) return false;
    if (!form.serviceCenters?.length) return false;
  }

  return true;
};
