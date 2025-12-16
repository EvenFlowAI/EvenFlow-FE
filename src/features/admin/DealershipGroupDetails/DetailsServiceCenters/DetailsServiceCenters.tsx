import React from 'react';
import { Table } from '../../../../components/tables/Table/Table';
import { IServiceCenterExtended } from '../../../../store/reducers/serviceCenters/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { concatAddress } from '../../../../utils/utils';
import { TDetailComponentProps } from '../../../../pages/admin/DealerShipGroupDetails/types';
import { TableRowDataType } from '../../../../types/types';

const rowData: TableRowDataType<IServiceCenterExtended>[] = [
  { header: 'Name', val: v => v.name },
  { header: 'Address', val: v => concatAddress(v.address) },
  { header: 'Employees', val: v => String(v.countOfEmployees), align: 'center' },
];

export const DetailsServiceCenters: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TDetailComponentProps>>
> = props => {
  const {
    dealershipSCs,
    dealershipPaging: { numberOfRecords },
    dealershipLoading,
  } = useSelector(({ serviceCenters }: RootState) => serviceCenters);

  return (
    <Table<IServiceCenterExtended>
      data={dealershipSCs}
      index={'id'}
      isLoading={dealershipLoading}
      rowData={rowData}
      onChangePage={props.onChangePage}
      onChangeRowsPerPage={props.onChangeRowsPerPage}
      page={props.page}
      count={numberOfRecords}
      rowsPerPage={props.rowsPerPage}
    />
  );
};
