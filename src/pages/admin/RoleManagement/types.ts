/* eslint-disable max-lines */

import { TRole } from '../../../store/reducers/users/types';
import { TTechnicianLevel } from '../../../types/types';

export enum UserStatus {
  Active = 0,
  Inactive = 1,
  Removed = 2,
}

export interface IServiceCenter {
  id: number;
  name: string;
  dmsId?: string;
  position?: string;
  type?: number;
  displayOnBookingTypes?: number[];
  details?: {
    hourlyRate?: string;
    overtimeRate?: string;
    skillLevel?: TTechnicianLevel;
  };
}

export interface IDealership {
  id: number;
  name: string;
  serviceCenters: IServiceCenter[];
  hasFullAccess: boolean | null;
}

export const statusLabels: Record<UserStatus, string> = {
  [UserStatus.Active]: 'Active',
  [UserStatus.Inactive]: 'Inactive',
  [UserStatus.Removed]: 'Removed',
};

export interface IUserAccount {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  role: TRole;
  emailConfirmed: boolean;
  avatarPath: string;
  status: UserStatus;
  dealerships: IDealership[];
}

export interface INewUserAccount {
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  role: TRole;
  avatarPath: string;
  status: UserStatus;
  dealerships: IDealership[];
}
