import {
  EAssignmentLevel,
  IEmployeeAssignmentSetting,
} from '../../../store/reducers/employees/types';
import { Dispatch, SetStateAction } from 'react';
import { SelectChangeEvent } from '@mui/material';

export type TEmployeeAssignmentMobileProps = {
  data: IEmployeeAssignmentSetting[];
  expandedItem: IEmployeeAssignmentSetting | null;
  setExpandedItem: Dispatch<SetStateAction<IEmployeeAssignmentSetting | null>>;
  onMethodChange: (
    item: IEmployeeAssignmentSetting | null,
    level: EAssignmentLevel,
    role: 'Advisor' | 'Technician'
  ) => (e: SelectChangeEvent<number>) => void;
};
