import React from 'react';
import { MenuItem, Select } from '@mui/material';
import {
  EAdvisorAssignMethod,
  EAssignmentLevel,
  IEmployeeAssignmentSetting,
} from '../../../../../store/reducers/employees/types';
import { getMethods, getOptionsByRole } from '../../utils';
import { methodOptions, secondaryOptions } from '../../constants';
import { SmallGreyGrid } from '../styles';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { EmptyMenuItem } from '../../../Appointments/AppointmentFilters/styles';
import { TEmployeeAssignmentMobileProps } from '../../types';

type TProps = Pick<TEmployeeAssignmentMobileProps, 'data' | 'onMethodChange'> & {
  item: IEmployeeAssignmentSetting;
  idx: number;
};

export const ServiceBookRowMobileDetails: React.FC<TProps> = ({
  item,
  idx,
  data,
  onMethodChange,
}) => {
  const {
    advisorPrimaryMethod,
    technicianPrimaryMethod,
    advisorSecondaryMethod,
    technicianSecondaryMethod,
  } = getMethods(item);

  const isAdvisorSecondaryDisabled = advisorPrimaryMethod !== EAdvisorAssignMethod.LastEmployee;
  const isTechSecondaryDisabled = technicianPrimaryMethod !== EAdvisorAssignMethod.LastEmployee;
  const advisorOptions = getOptionsByRole(methodOptions, 'Advisor');
  const technicianOptions = getOptionsByRole(methodOptions, 'Technician');
  const hasBottomBorder = idx === data.length - 1;
  const methodConflictAdvisor = advisorPrimaryMethod === advisorSecondaryMethod;
  const methodConflictTechnician = technicianPrimaryMethod === technicianSecondaryMethod;

  return (
    <>
      <SmallGreyGrid item xs={6} mdl={2} style={{ borderRightWidth: 0 }}>
        Advisors Primary
      </SmallGreyGrid>
      <SmallGreyGrid
        item
        xs={6}
        mdl={2}
        style={isAdvisorSecondaryDisabled ? { backgroundColor: '#EAEBEE' } : {}}
      >
        Advisors Secondary
      </SmallGreyGrid>
      <SmallGreyGrid item xs={6} mdl={2} style={{ borderRightWidth: 0 }}>
        <Select
          fullWidth
          onChange={onMethodChange(item, EAssignmentLevel.Primary, 'Advisor')}
          error={methodConflictAdvisor}
          value={advisorOptions.find(el => el.value === advisorPrimaryMethod)?.value ?? ''}
          input={<TextField />}
        >
          {advisorOptions.map(option => (
            <MenuItem key={option.name} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </SmallGreyGrid>
      <SmallGreyGrid
        item
        xs={6}
        mdl={2}
        style={isAdvisorSecondaryDisabled ? { backgroundColor: '#EAEBEE' } : {}}
      >
        <Select
          fullWidth
          onChange={onMethodChange(item, EAssignmentLevel.Secondary, 'Advisor')}
          disabled={isAdvisorSecondaryDisabled}
          error={methodConflictAdvisor}
          value={methodOptions.find(el => el.value === advisorSecondaryMethod)?.value ?? ''}
          input={<TextField />}
        >
          <EmptyMenuItem value="">Not Selected</EmptyMenuItem>
          {secondaryOptions.map(option => (
            <MenuItem key={option.name} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </SmallGreyGrid>
      <SmallGreyGrid item xs={6} mdl={2} style={{ borderRightWidth: 0 }}>
        Technician Primary
      </SmallGreyGrid>
      <SmallGreyGrid
        item
        xs={6}
        mdl={2}
        style={isTechSecondaryDisabled ? { backgroundColor: '#EAEBEE' } : {}}
      >
        Technician Secondary
      </SmallGreyGrid>
      <SmallGreyGrid
        item
        xs={6}
        mdl={2}
        style={{ borderBottomWidth: hasBottomBorder ? 1 : 0, borderRightWidth: 0 }}
      >
        <Select
          fullWidth
          onChange={onMethodChange(item, EAssignmentLevel.Primary, 'Technician')}
          error={methodConflictTechnician}
          value={technicianOptions.find(el => el.value === technicianPrimaryMethod)?.value ?? ''}
          input={<TextField />}
        >
          {technicianOptions.map(option => (
            <MenuItem key={option.name} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </SmallGreyGrid>
      <SmallGreyGrid
        item
        xs={6}
        mdl={2}
        style={{
          backgroundColor: isTechSecondaryDisabled ? '#EAEBEE' : 'transparent',
          borderBottomWidth: hasBottomBorder ? 1 : 0,
        }}
      >
        <Select
          fullWidth
          disabled={isTechSecondaryDisabled}
          onChange={onMethodChange(item, EAssignmentLevel.Secondary, 'Technician')}
          error={methodConflictTechnician}
          value={methodOptions.find(el => el.value === technicianSecondaryMethod)?.value ?? ''}
          input={<TextField />}
        >
          <EmptyMenuItem value="">Not Selected</EmptyMenuItem>
          {secondaryOptions.map(option => (
            <MenuItem key={option.name} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </SmallGreyGrid>
    </>
  );
};
