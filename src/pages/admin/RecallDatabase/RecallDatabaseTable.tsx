import React, { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { Table } from '../../../components/tables/Table/Table';
import { IGlobalRecall, OrderByField } from './types';
import { IOrder, IPageRequest, TableRowDataType } from '../../../types/types';
import { RootState } from '../../../store/rootReducer';
import { useException } from '../../../hooks/useException/useException';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';

type TProps = {
  isEdit: boolean;
  pageData: IPageRequest;
  onChangePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number) => void;
  onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  data: IGlobalRecall[];
  setData: React.Dispatch<React.SetStateAction<IGlobalRecall[]>>;
  order: IOrder<IGlobalRecall>;
  setOrder: Dispatch<SetStateAction<IOrder<IGlobalRecall>>>;
};

const RecallDatabaseTable: React.FC<TProps> = ({
  isEdit,
  pageData,
  onChangeRowsPerPage,
  onChangePage,
  data,
  setData,
  order,
  setOrder,
}) => {
  const { isLoading, pagination } = useSelector((state: RootState) => state.recallDatabase);
  const showError = useException();

  const onChangeRecallComponent = (el: IGlobalRecall, text: string) => {
    setData(prev =>
      prev.map(item => (item.id === el.id ? { ...item, recallComponentBookingFlow: text } : item))
    );
  };

  const RowData: TableRowDataType<IGlobalRecall>[] = [
    {
      header: 'Reported Date',
      width: 130,
      val: el => el.reportedDate,
      orderId: String(OrderByField.ReportedDate),
      align: 'left',
    },
    {
      header: 'NHTSA Campaign',
      width: 133,
      val: el => el.nhtsaCampaign,
      orderId: String(OrderByField.NhtsaCampaign),
      align: 'left',
    },
    {
      header: 'OEM Program',
      width: 121,
      val: el => el.oemProgram,
      orderId: String(OrderByField.OemProgram),
      align: 'left',
    },
    {
      header: 'Manufacturer',
      width: 152,
      val: el => el.manufacturer,
      orderId: String(OrderByField.Manufacturer),
      align: 'left',
    },
    {
      header: 'Impacted Vehicles',
      val: el => String(el.impactedVehicles),
      width: 119,
      orderId: String(OrderByField.ImpactedVehicles),
      align: 'left',
    },
    {
      header: 'Recall Component',
      width: 234,
      val: el => el.recallComponent,
      orderId: String(OrderByField.RecallComponent),
      align: 'left',
    },
    {
      header: 'Recall Component Booking Flow',
      val: el =>
        isEdit ? (
          <TextField
            name={String(el.id)}
            value={el.recallComponentBookingFlow}
            type="text"
            onChange={e => onChangeRecallComponent(el, e.target.value)}
            id={String(el.id)}
            multiline
            rows={3}
            placeholder="Type recall text"
            sx={{ '& .MuiInputBase-input': { padding: '4px 8px' } }}
          />
        ) : (
          el.recallComponentBookingFlow
        ),
      align: 'left',
    },
  ];

  const handleSort = (data: IOrder<IGlobalRecall>) => () => {
    if (!isEdit) {
      setOrder(prev => ({ ...data, isAscending: !prev.isAscending }));
      onChangePage(null, 0);
    } else {
      showError('Sorting is not possible in the EDIT mode');
    }
  };

  return (
    <Table<IGlobalRecall>
      index="id"
      noDataTitle="No results."
      data={data}
      order={order.orderBy}
      isAscending={order.isAscending}
      rowData={RowData}
      rowsPerPage={pageData.pageSize}
      page={pageData.pageIndex}
      count={pagination.numberOfRecords}
      onChangeRowsPerPage={onChangeRowsPerPage}
      onChangePage={onChangePage}
      onSort={handleSort}
      hidePagination={pagination.numberOfRecords < 10}
      isLoading={isLoading}
    />
  );
};

export default RecallDatabaseTable;
