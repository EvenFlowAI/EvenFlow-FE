import React, { ChangeEvent } from 'react';
import { Table, TableBody, TableHead } from '@mui/material';
import { SubCellsWrapper, SubCellTitle, THeadCell, THeadCellWithSub } from '../styles';
import { TableRow } from '../../../../components/styled/TableRow';
import ServiceBookRow from './ ServiceBookRow/ServiceBookRow';
import {
  EAssignmentLevel,
  IEmployeeAssignmentSetting,
} from '../../../../store/reducers/employees/types';
import { TOption } from '../../ServiceBookModal/types';

type TProps = {
  isAdvisorSecondaryEnabled: boolean;
  isTechSecondaryEnabled: boolean;
  data: IEmployeeAssignmentSetting[];
  onMethodChange: (
    item: IEmployeeAssignmentSetting,
    level: EAssignmentLevel,
    role: 'Advisor' | 'Technician'
  ) => (e: ChangeEvent<{}>, value: TOption | null) => void;
};

const EmployeeAssignmentDesktop: React.FC<TProps> = ({
  isAdvisorSecondaryEnabled,
  data,
  onMethodChange,
  isTechSecondaryEnabled,
}) => {
  return (
    <Table style={{ border: '1px solid #DADADA' }}>
      <TableHead>
        <TableRow>
          <THeadCell key="serviceBook">
            <div>Service Book</div>
          </THeadCell>
          <THeadCellWithSub
            key="advisors"
            style={{ borderRight: '1px solid #DADADA', borderLeft: '1px solid #DADADA' }}
            width={400}
          >
            <SubCellTitle key="title">Advisors</SubCellTitle>
            <SubCellsWrapper key="subWrapper">
              <div key="primary">Primary</div>
              <div
                key="secondary"
                style={{ backgroundColor: !isAdvisorSecondaryEnabled ? '#DADADA' : '' }}
              >
                Secondary
              </div>
            </SubCellsWrapper>
          </THeadCellWithSub>
          <THeadCellWithSub key="technicians" width={400}>
            <SubCellTitle key="title">Technicians</SubCellTitle>
            <SubCellsWrapper key="subWrapper">
              <div key="primary">Primary</div>
              <div
                key="secondary"
                style={{ backgroundColor: !isTechSecondaryEnabled ? '#DADADA' : '' }}
              >
                Secondary
              </div>
            </SubCellsWrapper>
          </THeadCellWithSub>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(item => (
          <ServiceBookRow
            item={item}
            onMethodChange={onMethodChange}
            key={item.serviceBookId ?? item.serviceBookName}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default EmployeeAssignmentDesktop;
