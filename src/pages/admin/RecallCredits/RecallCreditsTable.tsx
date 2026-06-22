import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Table } from '../../../components/tables/Table/Table';
import { IOrder, IPageRequest, TableRowDataType } from '../../../types/types';
import { useException } from '../../../hooks/useException/useException';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { ServiceCenterCredit } from '../RecallDatabase/types';
import { TableAvatar } from '../../../components/wrappers/TableAvatar/TableAvatar';

type TProps = {
  isEdit: boolean;
  pageData: IPageRequest;
  onChangePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number) => void;
  onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  data: ServiceCenterCredit[];
  setData: React.Dispatch<React.SetStateAction<ServiceCenterCredit[]>>;
  order: IOrder<ServiceCenterCredit>;
  setOrder: Dispatch<SetStateAction<IOrder<ServiceCenterCredit>>>;
  isLoading?: boolean;
};

const RecallCreditsTable: React.FC<TProps> = ({
  isEdit,
  pageData,
  onChangeRowsPerPage,
  onChangePage,
  data,
  setData,
  order,
  setOrder,
  isLoading,
}) => {
  const showError = useException();
  const [visibleData, setVisibleData] = useState<ServiceCenterCredit[]>([]);

  useEffect(() => {
    const sortedData = [...data];

    const start = pageData.pageIndex * pageData.pageSize;
    const end = start + pageData.pageSize;

    setVisibleData(sortedData.slice(start, end));
  }, [data, pageData, order]);

  const onChangeMonthlyRecallCredits = (el: ServiceCenterCredit, credits: number) => {
    setData(prev =>
      prev.map(item =>
        item.serviceCenterId === el.serviceCenterId ? { ...item, recallCredits: credits } : item
      )
    );
  };

  const RowData: TableRowDataType<ServiceCenterCredit>[] = [
    {
      header: 'Dealership Group',
      width: 250,
      val: el => el.dealershipName,
      align: 'left',
    },
    {
      header: 'Service Center Name',
      width: 302,
      val: el => el.serviceCenterName,
      align: 'left',
    },
    {
      header: 'Service Center ID',
      width: 167,
      val: el => '' + el.serviceCenterId,
      align: 'left',
    },
    {
      header: 'Current Month Usage',
      width: 167,
      val: el => '' + el.recallMonthlyUsageCredits,
      align: 'left',
    },
    {
      header: 'Monthly Recall Credits',
      width: 168,
      val: el =>
        isEdit ? (
          <TextField
            name={String(el.serviceCenterId)}
            value={el.recallCredits}
            type="number"
            inputProps={{ min: 0, max: 99999, step: 1 }}
            onChange={e => onChangeMonthlyRecallCredits(el, +e.target.value)}
            id={String(el.serviceCenterId)}
            sx={{ '& .MuiInputBase-input': { padding: '4px 8px', height: '32px' } }}
          />
        ) : (
          '' + el.recallCredits
        ),
      align: 'left',
    },
  ];

  const handleSort = (data: IOrder<ServiceCenterCredit>) => () => {
    if (!isEdit) {
      setOrder(prev => ({ ...data, isAscending: !prev.isAscending }));
      onChangePage(null, 0);
    } else {
      showError('Sorting is not possible in the EDIT mode');
    }
  };

  const startActions = (el: ServiceCenterCredit) => (
    <TableAvatar name={el.serviceCenterName || ''} src={el.avatarPath} />
  );

  return (
    <>
      <Table<ServiceCenterCredit>
        index="serviceCenterId"
        noDataTitle="No results."
        data={visibleData}
        order={order.orderBy}
        isAscending={order.isAscending}
        rowData={RowData}
        rowsPerPage={pageData.pageSize}
        startActions={startActions}
        page={pageData.pageIndex}
        count={data.length}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onChangePage={onChangePage}
        onSort={handleSort}
        hidePagination={data.length <= pageData.pageSize}
        isLoading={isLoading}
        customRowsPerPageOptions={[15, 50, 100]}
        customRowsPerPage={15}
      />
    </>
  );
};

export default RecallCreditsTable;
