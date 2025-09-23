import { TRole } from '../../../store/reducers/users/types';
import {Roles} from "../../../types/types";

export const DashboardsIds = {
  AppointmentSummary: 'Bioab5mEC',
  ShopLoading: 'dXaJXN4Bx',
  ValetAppointments: '-p7lXERDK',
  MobileServiceAppointments: 'KILliymYmVIBMazCnOQMG',
  CustomerBehavior: 'psDZZLXdRm3CJXaZUPbnm',
  RepairOrderPerformance: 'oK0YxEfcoDkhsmMtFjGxo',
  CapacityManagementPerformance: 'nO0UhbMtl58MxO59VCC3x',
};

export const reportingAllowedRoles: TRole[] = [
  Roles.EvenFlowAdmin,
  Roles.EvenFlowAccountManager,
  Roles.EvenFlowSupport,
  Roles.EvenFlowAIAgent,
  Roles.DealerOwner,
  Roles.ServiceDirector,
  Roles.ServiceManager,
  Roles.BDCManager
];
