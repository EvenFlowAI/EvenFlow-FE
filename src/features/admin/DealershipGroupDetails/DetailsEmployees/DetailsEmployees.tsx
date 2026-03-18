import React from 'react';
import { IEmployee } from '../../../../store/reducers/employees/types';
import { IPagingResponse, TableRowDataType } from '../../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { Table } from '../../../../components/tables/Table/Table';
import { concatAddress } from '../../../../utils/utils';
import { TDetailComponentProps } from '../../../../pages/admin/DealerShipGroupDetails/types';

const rowData: TableRowDataType<IEmployee>[] = [
  { header: 'Name', val: v => v.fullName },
  { header: 'Role', val: v => v.role },
  { header: 'Service Centers', val: v => v.serviceCenters?.map(sc => sc.name).join(', ') },
  {
    header: 'Service Centers Address',
    val: v => v.serviceCenters?.map(sc => concatAddress(sc.address)).join(', '),
  },
];

export const DetailsEmployees: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TDetailComponentProps>>
> = props => {
  const [employees, employeesLoading, employeesPaging]: [IEmployee[], boolean, IPagingResponse] =
    useSelector((state: RootState) => [
      state.employees.dealershipEmployeesList,
      state.employees.loadingDealership,
      state.employees.dealershipPaging,
    ]);
  return (
    <Table<IEmployee>
      data={employees}
      index={'id'}
      isLoading={employeesLoading}
      page={props.page}
      rowsPerPage={props.rowsPerPage}
      onChangePage={props.onChangePage}
      onChangeRowsPerPage={props.onChangeRowsPerPage}
      count={employeesPaging.numberOfRecords}
      rowData={rowData}
    />
  );
};
